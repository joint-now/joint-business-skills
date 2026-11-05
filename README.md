# Joint Business Skills

다른 회사의 업무 담당자도 자기 회사 자료로 사용하는 공개 스킬 저장소입니다. Claude와 Codex용 플러그인을 제공하고 Gemini CLI에서는 같은 스킬을 개별 설치할 수 있습니다. 회사명과 서비스 설명, 회의 기록은 사용자가 입력합니다.

마켓플레이스 이름은 `joint-business-skills`입니다. 먼저 `meeting-actions` 플러그인의 `joint-meeting-actions` 스킬로 설치와 업데이트를 확인합니다. 이 스킬은 회의 메모에서 작업·담당자·기한·상태·근거를 표로 정리합니다. 기존 업무 스킬 4개는 `business-workflows` 플러그인에 있습니다.

공개 저장소 주소는 https://github.com/joint-now/joint-business-skills 입니다. 이 주소로 설치하는 배포와 Claude·Codex의 전체 공개 검색 목록 등재는 각각 별도 단계입니다. 현재 상태는 [검증 기록](docs/verification.md)을 기준으로 확인해 주세요.

| 스킬 | 결과 |
| --- | --- |
| `research-company` | 근거가 있는 고객사 브리핑과 확인 질문 |
| `prepare-customer-meeting` | 미팅 목표, 진행안과 우선 질문 |
| `summarize-customer-meeting` | 결정 사항, 미결 질문과 후속 작업 |
| `draft-followup-email` | 후속 메일 제목·본문과 사용자 확인 목록 |

사용자는 [플러그인 사용 안내](plugins/business-workflows/README.md)와 [회사 설명 입력 예시](plugins/business-workflows/examples/company-context.md)를 참고하시면 됩니다. 예제에 등장하는 회사와 사람은 모두 가상입니다.

## 설치

Claude 웹·데스크톱에서는 `Customize → Plugins → Add → Add marketplace → Add from a repository`에서 `https://github.com/joint-now/joint-business-skills`를 추가한 뒤 `JOINT Meeting Actions`를 설치합니다. 화면 언어와 앱 버전에 따라 사용자 지정·플러그인 메뉴의 위치는 달라질 수 있습니다.

Claude Code 사용자는 다음과 같이 설치할 수 있습니다.

```bash
claude plugin marketplace add joint-now/joint-business-skills
claude plugin install meeting-actions@joint-business-skills
```

Codex CLI에서는 다음과 같이 설치합니다. 지원되는 데스크톱 앱에서는 추가한 마켓플레이스를 플러그인 목록에서 선택할 수 있습니다.

```bash
codex plugin marketplace add joint-now/joint-business-skills
codex plugin add meeting-actions@joint-business-skills
```

Gemini CLI에서는 스킬 폴더를 지정합니다. 이 경로는 Gemini CLI 지원이며 Gemini 웹 채팅의 확장 설치와는 별개입니다.

```bash
gemini skills install https://github.com/joint-now/joint-business-skills --path plugins/meeting-actions/skills/joint-meeting-actions
```

설치 후 가상 회의 메모를 제공하고 “회의 후속 작업을 담당자와 기한별로 정리해 주세요”라고 요청해 주세요. [테스트 플러그인 안내](plugins/meeting-actions/README.md)에 입력 예시가 있습니다.

제작 중인 로컬 파일을 확인할 때는 이 저장소에서 다음을 실행합니다.

```bash
claude --plugin-dir ./plugins/business-workflows
```

웹·Cowork에서 파일로 확인하려면 아래 패키징 명령으로 만든 ZIP을 `Customize → Plugins → Add → Upload plugin`에 업로드합니다. CLI 형식 검사와 로컬 설치의 결과는 [검증 기록](docs/verification.md)에 따로 남깁니다.

## 개발과 패키징

제작 환경은 Node.js 22.20.0 이상, npm과 Python 3.9 이상입니다. 외부 사용자는 개발 도구를 설치하는 대신 Claude에서 플러그인을 추가해 사용합니다.

```bash
npm ci
npm run check
npm run check:claude
npm run package
```

`check`는 목록·스킬·예제·문서 연결을 확인합니다. `check:claude`는 설치된 Claude Code의 공식 형식 검사도 실행합니다. `package`는 정적 검사 후 ZIP과 SHA-256 파일을 `dist/`에 만듭니다. 같은 입력을 같은 Python 환경에서 패키징하면 파일 순서와 시간 정보가 일정하게 유지됩니다.

플러그인별 `plugin.json`과 `.claude-plugin/plugin.json`의 버전을 함께 올립니다. 정적 검사가 두 파일의 이름·버전·설명·작성자·라이선스 일치를 확인합니다. [공개 배포 절차](docs/releasing.md)에 버전 변경, 게시, 외부 계정 확인과 업데이트 방법을 정리했습니다.

## 구현과 검증 범위

[구현 문서](docs/implementation.md)는 실제 파일 구성, 동작과 검사 범위를 설명합니다. [평가 사례](evals/cases.json)는 스킬마다 정상 입력과 자료가 부족한 입력을 제공합니다. 정적 검사는 사례 정의와 연결 파일을 검사하고 실제 답변 품질은 사람이 Claude에서 실행해 확인합니다.

스킬은 Claude 웹·데스크톱 채팅, Cowork와 Claude Code에서 제공할 수 있는 Markdown 지침으로 구성했습니다. 각 환경의 실제 동작 확인 상태는 검증 기록을 기준으로 보시면 됩니다. 실시간 자료 조회는 사용자가 연결한 서비스와 그 계정의 권한을 따릅니다.

라이선스는 [MIT](LICENSE)입니다. 사용 방법이나 배포 문제는 공개 저장소의 Issues에 남길 수 있도록 게시 시 활성화합니다.

공식 기준: [플러그인 구성과 검사](https://claude.com/docs/plugins/build), [마켓플레이스 만들기](https://code.claude.com/docs/en/plugin-marketplaces), [업데이트 운영](https://code.claude.com/docs/en/plugins/host-marketplace).
