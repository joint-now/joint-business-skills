# 공개 검색 목록 제출 준비

목표는 다른 회사 사용자가 Claude·Codex의 탐색 화면에서 JOINT 플러그인을 검색하고 추가하는 것입니다. 공개 GitHub 저장소는 설치 원본이며 전체 공개 디렉터리 노출은 각 서비스에서 별도로 제출·심사·게시합니다.

## 제출할 테스트 플러그인

| 항목 | 값 |
| --- | --- |
| 표시 이름 | JOINT Meeting Actions |
| 저장소 | https://github.com/joint-now/joint-business-skills |
| 플러그인 경로 | `plugins/meeting-actions` |
| 추적 브랜치 | `main` |
| 스킬 | `joint-meeting-actions` |
| 용도 | 제공한 회의 메모에서 작업·담당자·기한·상태·근거 추리기 |
| 구성 | SKILL.md, 두 호스트의 manifest, README, 기존 JOINT 아이콘, MIT LICENSE |
| 외부 연동 | 플러그인에 MCP 서버·계정 연결·결제 기능을 구성하지 않음 |

## Claude

[개발자 포털](https://claude.ai/directory/manage)에서 저장소와 플러그인 경로를 입력하고 검증, 목록 확인, 데이터 처리 질문, 준수 확인과 제출을 진행합니다. 2026년 11월 5일 현재 로그인된 Joint 조직 계정에는 제출 권한이 없으며 화면에 조직 소유자에게 요청하라는 안내가 표시됐습니다. 이 계정으로 제출물을 만들거나 심사를 요청하지 않았습니다.

조직 소유자 또는 필요한 게시 권한을 가진 계정이 제출을 진행해야 합니다. GitHub 연결 계정도 저장소에 push 권한이 있어야 합니다. 연락처와 데이터 처리 답변, 약관 확인은 게시 책임자가 확정합니다. 버전 변경은 저장소에 반영하며 디렉터리에서는 검사와 게시 설정에 따라 반영됩니다.

## Codex·ChatGPT

[OpenAI 플러그인 포털](https://platform.openai.com/plugins)에 로그인해 업로드 화면에 접근하는 것까지 확인했습니다. 조직 선택 목록에는 개인 조직만 표시됐으며 JOINT 게시에 사용할 검증된 게시자·조직은 미확정입니다. 실제 ZIP 업로드와 심사 제출은 아직 진행하지 않았습니다.

OpenAI용 manifest에는 이름, 설명, 카테고리, 사용 예시와 아이콘을 넣었습니다. 공개 제출 전에 게시자 검증, 웹사이트·지원·개인정보 처리방침·이용약관의 공개 URL, 지원 국가와 데이터 처리 정책을 확정해야 합니다. 확인하지 않은 값은 패키지에 넣지 않았습니다. 스킬만 제공하는 플러그인은 MCP 심사용 사례와 데모 영상이 필요 없지만 디렉터리 등재 자격과 자동 검사는 별도로 확인합니다.

## Gemini

이번 지원 범위는 Gemini CLI의 개별 스킬 설치입니다. 같은 SKILL.md를 사용하며 설치 후 목록 노출을 확인합니다. Gemini 웹 앱의 검색·설치와 Gemini 확장 갤러리 등재는 아직 진행하지 않았습니다.

근거: [Claude 통합 탐색](https://support.claude.com/en/articles/14328846-browse-skills-connectors-and-plugins-in-one-directory), [Claude 제출 절차](https://claude.com/docs/plugins/submit), [OpenAI 제출 절차](https://developers.openai.com/plugins/deploy/submission), [Gemini CLI 스킬 설치](https://geminicli.com/docs/cli/using-agent-skills/).
