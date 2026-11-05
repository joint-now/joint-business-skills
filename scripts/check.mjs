import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, readFileSync, readdirSync, realpathSync } from "node:fs";
import { basename, dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { isMap, parseDocument } from "yaml";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));

function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function requireText(value, label) {
  requireCondition(typeof value === "string" && value.trim().length > 0, `${label}: 값이 필요합니다.`);
}

function requireName(value, label) {
  requireText(value, label);
  requireCondition(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 64, `${label}: 이름 형식을 확인해 주세요.`);
}

function collectFiles(directoryPath) {
  return readdirSync(directoryPath).toSorted().flatMap((name) => {
    const filePath = resolve(directoryPath, name);
    const fileState = lstatSync(filePath);
    requireCondition(!fileState.isSymbolicLink(), `${filePath}: 배포 파일은 실제 파일로 보관해 주세요.`);
    return fileState.isDirectory() ? collectFiles(filePath) : [filePath];
  });
}

function checkMarkdownLinks(filePath) {
  const markdown = readFileSync(filePath, "utf8").replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, "");
  for (const match of markdown.matchAll(/\[[^\]]+\]\(([^\s)]+)\)/g)) {
    const target = match[1].split("#")[0];
    if (!target || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
    const targetPath = resolve(dirname(filePath), decodeURIComponent(target));
    requireCondition(existsSync(targetPath), `${relative(repositoryRoot, filePath)}: 연결된 파일 ${target}을 찾을 수 없습니다.`);
  }
}

function checkSkill(skillDirectory) {
  const skillPath = resolve(skillDirectory, "SKILL.md");
  const markdown = readFileSync(skillPath, "utf8");
  const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  requireCondition(frontmatter, `${skillPath}: YAML frontmatter가 필요합니다.`);
  const document = parseDocument(frontmatter[1], { uniqueKeys: true });
  requireCondition(document.errors.length === 0 && document.warnings.length === 0, `${skillPath}: YAML 문법을 확인해 주세요.`);
  requireCondition(isMap(document.contents), `${skillPath}: frontmatter는 객체여야 합니다.`);
  const metadata = document.toJS({ maxAliasCount: 20 });
  requireName(metadata.name, skillPath);
  requireCondition(metadata.name === basename(skillDirectory), `${skillPath}: 폴더 이름과 name이 다릅니다.`);
  requireText(metadata.description, `${skillPath} description`);
  requireCondition(metadata.description.length <= 1024, `${skillPath}: description은 1024자 이내로 작성해 주세요.`);
  requireCondition(markdown.slice(frontmatter[0].length).trim().length > 0, `${skillPath}: 본문이 필요합니다.`);
  return metadata.name;
}

function checkRepository() {
  const marketplace = readJson(resolve(repositoryRoot, ".claude-plugin/marketplace.json"));
  const codexMarketplace = readJson(resolve(repositoryRoot, ".agents/plugins/marketplace.json"));
  requireCondition(codexMarketplace.name === marketplace.name, "Claude와 Codex 마켓플레이스 이름을 일치시켜 주세요.");
  requireCondition(codexMarketplace.plugins.length === marketplace.plugins.length, "Claude와 Codex 플러그인 목록을 일치시켜 주세요.");
  requireName(marketplace.name, "marketplace.name");
  requireText(marketplace.description, "marketplace.description");
  requireText(marketplace.owner?.name, "marketplace.owner.name");
  requireCondition(Array.isArray(marketplace.plugins) && marketplace.plugins.length > 0, "플러그인을 하나 이상 등록해 주세요.");
  requireCondition(new Set(marketplace.plugins.map((entry) => entry.name)).size === marketplace.plugins.length, "플러그인 이름이 중복됩니다.");
  requireCondition(existsSync(resolve(repositoryRoot, "LICENSE")), "LICENSE 파일이 필요합니다.");
  const pluginsRoot = resolve(repositoryRoot, "plugins");
  requireCondition(lstatSync(pluginsRoot).isDirectory() && !lstatSync(pluginsRoot).isSymbolicLink(), "plugins/는 실제 폴더여야 합니다.");

  const skillNames = new Set();
  const pluginDirectories = [];
  for (const entry of marketplace.plugins) {
    requireName(entry.name, "plugins[].name");
    requireCondition(typeof entry.source === "string" && entry.source.startsWith("./plugins/"), `${entry.name}: plugins/ 안의 상대 경로를 사용해 주세요.`);
    const pluginDirectory = resolve(repositoryRoot, entry.source);
    const pluginRelativePath = relative(pluginsRoot, pluginDirectory);
    requireCondition(pluginRelativePath && !isAbsolute(pluginRelativePath) && !pluginRelativePath.split(sep).includes(".."), `${entry.name}: 플러그인 경로가 plugins/를 벗어납니다.`);
    requireCondition(!entry.source.split("/").includes(".."), `${entry.name}: source에 상위 폴더 경로를 사용하지 않습니다.`);
    const resolvedPluginPath = relative(realpathSync(pluginsRoot), realpathSync(pluginDirectory));
    requireCondition(resolvedPluginPath && !isAbsolute(resolvedPluginPath) && !resolvedPluginPath.split(sep).includes(".."), `${entry.name}: 실제 플러그인 위치가 plugins/를 벗어납니다.`);
    requireCondition(!lstatSync(pluginDirectory).isSymbolicLink(), `${entry.name}: 플러그인 폴더는 실제 폴더여야 합니다.`);
    const plugin = readJson(resolve(pluginDirectory, ".claude-plugin/plugin.json"));
    const portablePlugin = readJson(resolve(pluginDirectory, "plugin.json"));
    for (const field of ["name", "version", "description", "author", "license"]) {
      requireCondition(JSON.stringify(portablePlugin[field]) === JSON.stringify(plugin[field]), `${entry.name}: 두 manifest의 ${field} 값을 일치시켜 주세요.`);
    }
    const codexEntry = codexMarketplace.plugins.find((item) => item.name === entry.name);
    requireCondition(codexEntry?.source?.path === entry.source && codexEntry.source.source === "local", `${entry.name}: Codex 소스 경로를 일치시켜 주세요.`);
    requireCondition(codexEntry.policy?.installation === "AVAILABLE" && codexEntry.policy?.authentication === "ON_INSTALL", `${entry.name}: Codex 설치 정책을 확인해 주세요.`);
    const pluginInterface = portablePlugin.extensions?.["com.openai"]?.interface;
    requireText(pluginInterface?.displayName, `${entry.name} displayName`);
    requireText(pluginInterface?.shortDescription, `${entry.name} shortDescription`);
    requireCondition(pluginInterface.shortDescription.length <= 30, `${entry.name}: 짧은 소개는 30자 이내로 작성해 주세요.`);
    requireCondition(pluginInterface.category === codexEntry.category, `${entry.name}: 카테고리를 일치시켜 주세요.`);
    for (const field of ["logo", "composerIcon"]) {
      requireCondition(typeof pluginInterface[field] === "string" && pluginInterface[field].startsWith("./assets/"), `${entry.name}: ${field}에 assets/ 안의 파일을 지정해 주세요.`);
      requireCondition(existsSync(resolve(pluginDirectory, pluginInterface[field])), `${entry.name}: ${field} 파일을 찾을 수 없습니다.`);
    }
    requireCondition(plugin.name === entry.name && plugin.name === basename(pluginDirectory), `${entry.name}: 목록·폴더·플러그인의 이름을 일치시켜 주세요.`);
    requireCondition(/^\d+\.\d+\.\d+$/.test(plugin.version), `${entry.name}: 버전은 major.minor.patch로 작성해 주세요.`);
    requireCondition(!Object.hasOwn(entry, "version"), `${entry.name}: 버전은 plugin.json에서 관리합니다.`);
    requireText(plugin.description, `${entry.name} description`);
    requireText(plugin.author?.name, `${entry.name} author`);
    requireText(plugin.license, `${entry.name} license`);
    const pluginReadme = readFileSync(resolve(pluginDirectory, "README.md"), "utf8");
    requireCondition(pluginReadme.trim().split(/\s+/).length >= 40, `${entry.name}: README에 사용 방법을 충분히 적어 주세요.`);
    const skillsRoot = resolve(pluginDirectory, "skills");
    const skillDirectories = readdirSync(skillsRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory());
    requireCondition(skillDirectories.length > 0, `${entry.name}: 스킬이 필요합니다.`);
    for (const directory of skillDirectories) skillNames.add(checkSkill(resolve(skillsRoot, directory.name)));
    for (const filePath of collectFiles(pluginDirectory)) {
      const fileName = basename(filePath);
      requireCondition(!fileName.startsWith(".env") && fileName !== ".DS_Store", `${filePath}: 배포 파일 구성을 확인해 주세요.`);
      if (filePath.endsWith(".md")) {
        requireCondition(!readFileSync(filePath, "utf8").includes("/Users/"), `${filePath}: 제작자의 로컬 경로를 제거해 주세요.`);
      }
    }
    pluginDirectories.push(pluginDirectory);
  }

  const evaluationCases = readJson(resolve(repositoryRoot, "evals/cases.json"));
  const caseIdentifiers = new Set();
  for (const evaluationCase of evaluationCases) {
    requireCondition(!caseIdentifiers.has(evaluationCase.id), "평가 사례 ID가 중복됩니다.");
    caseIdentifiers.add(evaluationCase.id);
    requireCondition(skillNames.has(evaluationCase.skill), `${evaluationCase.id}: 등록된 스킬을 지정해 주세요.`);
    requireText(evaluationCase.prompt, `${evaluationCase.id} prompt`);
    requireCondition(Array.isArray(evaluationCase.expectations) && evaluationCase.expectations.length > 0, `${evaluationCase.id}: 기대 결과가 필요합니다.`);
    for (const input of evaluationCase.inputs) requireCondition(existsSync(resolve(repositoryRoot, input)), `${evaluationCase.id}: 입력 파일 ${input}이 없습니다.`);
  }
  for (const skillName of skillNames) {
    requireCondition(evaluationCases.some((item) => item.skill === skillName && item.scenario === "normal"), `${skillName}: 정상 사례가 필요합니다.`);
    requireCondition(evaluationCases.some((item) => item.skill === skillName && item.scenario === "incomplete"), `${skillName}: 자료 부족 사례가 필요합니다.`);
  }
  for (const directory of [resolve(repositoryRoot, "docs"), ...pluginDirectories]) {
    for (const filePath of collectFiles(directory).filter((filePath) => filePath.endsWith(".md"))) checkMarkdownLinks(filePath);
  }
  checkMarkdownLinks(resolve(repositoryRoot, "README.md"));
  console.log(`정적 검사 통과: 플러그인 ${pluginDirectories.length}개, 스킬 ${skillNames.size}개, 평가 사례 ${evaluationCases.length}개`);

  if (process.argv.includes("--claude")) {
    for (const directory of [repositoryRoot, ...pluginDirectories]) {
      execFileSync("claude", ["plugin", "validate", directory, "--strict"], { stdio: "inherit" });
    }
  }
}

try {
  checkRepository();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
