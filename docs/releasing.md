# 공개 배포 절차

공개 배포는 다른 회사 사용자가 자기 계정에서 저장소를 추가하고 업무를 실행하는 것을 기준으로 합니다. 마켓플레이스는 `joint-business-skills`, 테스트 플러그인은 `meeting-actions`, 기존 업무 플러그인은 `business-workflows`입니다. 공개 위치는 사용자가 선택한 `joint-now/joint-business-skills`입니다.

## 게시 전 준비

1. 스킬의 용도와 결과를 확인하고 [평가 사례](../evals/cases.json)를 실행합니다. 각 사례의 기대 결과를 보고 실제 출력이 적절한지 기록합니다.
2. README의 지원 환경과 회사별 입력 방법을 확인합니다. 예제는 가상 자료를 사용하고 사용자 회사의 자료와 인증은 사용자가 준비합니다.
3. 변경한 플러그인의 `plugin.json`과 `.claude-plugin/plugin.json` 버전을 함께 올리고 [변경 기록](../CHANGELOG.md)을 갱신합니다. 이름은 공개 후 같은 식별자를 유지합니다.
4. 검사와 ZIP 생성을 실행합니다.

```bash
npm ci
npm run check:claude
npm run package
```

생성된 `dist/business-workflows-버전.zip`과 같은 이름의 `.sha256` 파일을 확인합니다. ZIP을 풀었을 때 루트에 `.claude-plugin/plugin.json`이 있어야 합니다. 변경 후에는 새 ZIP과 체크섬을 다시 생성합니다.

## 공개 저장소 게시

GitHub 계정과 실제 저장소 주소를 확정한 뒤 해당 계정의 공개 저장소에 소스를 게시합니다. 라이선스는 MIT입니다. 아래 명령은 사용자가 선택한 조직의 공개 저장소를 만드는 예시입니다.

```bash
git add .
git commit -m "feat: add public business skill marketplace"
gh repo create joint-now/joint-business-skills --public --source=. --remote=origin --push
```

이 명령은 공개 저장소를 실제로 생성하고 파일을 게시합니다. 기존 저장소를 사용할 때는 그 저장소의 origin을 연결하는 절차를 따릅니다. 게시 후 README의 주소와 외부 사용자에게 전달할 설치 명령을 실제 값으로 갱신합니다.

## 외부 계정 검증

Joint 조직에 속하지 않은 Claude 계정으로 다음을 확인합니다.

1. 웹·데스크톱에서 `Customize → Plugins → Add → Add marketplace → Add from a repository`로 실제 저장소 주소를 추가합니다.
2. `JOINT Meeting Actions`를 설치하고 `joint-meeting-actions` 스킬과 버전을 확인합니다.
3. 가상 회사 자료로 정상 입력과 자료 부족 사례를 실행합니다. 회사 정보, 사실과 가정, 결정과 제안이 구분되는지 살펴봅니다.
4. 해당 계정이 속한 회사의 설치 정책과 필요한 서비스 연결 상태를 확인합니다.
5. 지원할 다른 환경에서도 같은 흐름을 확인하고 [검증 기록](verification.md)에 결과를 남깁니다.

현재 플러그인 설치는 Claude의 지원되는 유료 플랜을 전제로 합니다. 사용자 회사의 조직 가입과 서비스 인증은 그 회사의 정책과 계정 권한을 따릅니다. [Claude 설치 안내](https://support.claude.com/en/articles/13837440-use-plugins-in-claude)

## 업데이트

변경한 스킬과 문서를 검토하고 버전을 올린 뒤 공개 저장소에 반영합니다. 웹·Cowork에서는 마켓플레이스의 `Check for updates`를 사용하거나 GitHub의 `Sync automatically`를 켤 수 있습니다. Claude Code 자체 마켓플레이스는 별도의 자동 업데이트 설정을 사용합니다.

```bash
claude plugin marketplace update joint-business-skills
claude plugin update meeting-actions@joint-business-skills
codex plugin marketplace upgrade joint-business-skills
codex plugin add meeting-actions@joint-business-skills
gemini skills install https://github.com/joint-now/joint-business-skills --path plugins/meeting-actions/skills/joint-meeting-actions
```

같은 외부 계정에서 새 버전과 변경된 결과를 확인합니다. 문제가 생기면 이전에 정상 동작한 내용을 복원해 새 패치 버전으로 배포하고 결과를 다시 확인합니다. [웹·Cowork 업데이트](https://claude.com/docs/plugins/overview), [Claude Code 업데이트](https://code.claude.com/docs/en/plugins/host-marketplace)

## 공식 디렉터리

저장소 URL로 설치하는 마켓플레이스와 전체 공개 검색 목록 등재는 별도 절차입니다. [제출 준비 현황](submission-preparation.md)에 두 서비스의 등록 경로와 계정에서 확인한 제한을 기록합니다. 스킬 원본은 자유롭게 수정할 수 있으며 공개 검색 목록의 새 버전은 각 서비스의 검사·게시 절차를 따릅니다. [Claude 제출](https://claude.com/docs/plugins/submit), [OpenAI 제출](https://developers.openai.com/plugins/deploy/submission)
