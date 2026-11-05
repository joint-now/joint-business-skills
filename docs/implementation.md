# 구현 현황

이 프로젝트는 공개 마켓플레이스입니다. 다른 회사 사용자가 자기 Claude·Codex 계정에 설치합니다. `joint-business-skills`가 `meeting-actions`와 `business-workflows` 플러그인을 제공합니다. 테스트용 회의 후속 작업 스킬 1개와 기존 업무 스킬 4개로 구성하며 초기 버전은 각각 `0.1.0`입니다. Gemini CLI는 같은 SKILL.md를 개별 설치합니다.

## 파일과 동작

| 파일 | 동작 |
| --- | --- |
| `.claude-plugin/marketplace.json` | 저장소 안의 플러그인 위치를 상대 경로로 안내합니다. |
| `.agents/plugins/marketplace.json` | Codex용 목록, 플러그인 경로와 설치 정책을 정의합니다. |
| `plugins/*/plugin.json` | Agent Plugins 형식의 공통 정보와 OpenAI 표시 정보를 정의합니다. |
| `plugins/meeting-actions/skills/joint-meeting-actions/SKILL.md` | 회의 기록에서 작업·담당자·기한·상태·근거를 정리합니다. |
| `plugins/business-workflows/.claude-plugin/plugin.json` | 플러그인 식별자, 버전, 설명과 라이선스를 정의합니다. |
| `plugins/business-workflows/skills/*/SKILL.md` | 요청에 맞는 업무 지침과 결과 형식을 제공합니다. |
| `plugins/business-workflows/examples/` | 회사 설명과 가상 업무 자료, 요청 예시를 제공합니다. |
| `evals/cases.json` | 스킬마다 정상 입력과 자료 부족 입력, 총 10개 평가 기준을 정의합니다. |
| `scripts/check.mjs` | JSON·YAML, 경로, 이름, 문서 연결과 평가 입력을 검사합니다. |
| `scripts/package-plugin.py` | 플러그인 폴더와 루트 LICENSE를 ZIP에 담고 SHA-256 파일을 만듭니다. |
| `.github/workflows/validate.yml` | main 푸시와 PR에서 의존성 설치, 정적 검사와 ZIP 생성을 실행합니다. |

회사 정보는 사용자 입력이며 제공한 회사 설명 파일은 대화에 함께 첨부하는 선택 자료입니다. 플러그인의 `userConfig`나 특정 회사의 사전 인증을 전제로 삼지 않습니다. 스킬은 제공 자료만으로 시작할 수 있고 웹 조회와 연결 도구는 사용 가능한 환경에서 지정한 범위로 사용합니다.

업무용 프롬프트는 앞서 작성한 후보 초안을 바탕으로 구성했습니다. 고객사 조사에는 공식 웹사이트 외에 첨부 회사 소개로도 대상을 식별하는 입력을 명시했습니다. 아직 내부 사례 수집으로 실제 업무 목록을 확정한 상태는 아닙니다.

## 검사 계약

정적 검사는 이 저장소가 사용하는 상대 경로형 플러그인 소스를 대상으로 합니다. 목록·폴더·플러그인 이름이 일치해야 하고 스킬 폴더 이름은 frontmatter의 name과 같아야 합니다. 두 호스트의 목록과 manifest 정보를 대조하며 버전은 두 manifest에 같은 major.minor.patch로 기록합니다. OpenAI 표시 정보의 짧은 설명 길이와 아이콘 파일의 존재도 검사합니다.

YAML은 yaml 2.9.1로 파싱하고 중복 키와 잘못된 문법을 확인합니다. 배포 폴더의 심볼릭 링크와 제작자 로컬 경로를 검사하며 Markdown 문서의 로컬 파일 링크와 평가 사례의 입력 파일이 존재하는지도 확인합니다. 이 검사는 실제 업무 답변의 품질을 평가하지 않습니다.

`npm run check:claude`는 같은 정적 검사 후 설치된 Claude Code의 기본 프로필 형식 검사를 실행합니다. 공식 디렉터리 제출용 검사는 별도 범위이며 현재 CI에는 Claude Code를 설치하거나 모델을 호출하는 단계가 없습니다.

## ZIP 계약

`npm run package`는 prepackage 단계에서 정적 검사를 실행합니다. 플러그인마다 ZIP을 만들며 루트에 `plugin.json`, `.claude-plugin/plugin.json`, 사용자 README, 스킬, 아이콘과 LICENSE가 들어갑니다. 업무 플러그인은 가상 예제도 포함합니다. 저장소의 개발 스크립트, 평가 사례와 구현 문서는 배포 ZIP에 포함하지 않습니다.

파일은 이름순으로 정렬하고 ZIP 안의 날짜를 1980년 1월 1일로 고정합니다. 같은 입력과 같은 Python 압축 환경에서는 같은 ZIP을 생성합니다. 다른 압축 환경의 결과까지 동일하다고 보장하는 계약은 아닙니다. ZIP과 SHA-256 파일은 dist/에 생성하며 Git에서는 제외합니다.

## 검증과 남은 범위

실행한 검사와 결과는 [검증 기록](verification.md)에 남깁니다. 파일 검사, 격리된 CLI 설치·목록 확인, ZIP 내용 확인과 문서 정합성을 구분합니다. 외부 계정의 웹·Cowork 업무 실행과 원격 업데이트는 [공개 배포 절차](releasing.md)에 따라 확인합니다.

공식 근거: [플러그인 구성과 검사](https://claude.com/docs/plugins/build), [스킬 구조](https://claude.com/docs/skills/how-to), [마켓플레이스 구조](https://code.claude.com/docs/en/plugin-marketplaces).
