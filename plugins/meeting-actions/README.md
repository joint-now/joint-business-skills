# JOINT Meeting Actions

회의 메모에서 다음 행동을 추려 주는 공개 테스트 플러그인입니다. Claude와 Codex는 같은 스킬 원본을 사용하며 Gemini CLI에서도 개별 스킬로 설치할 수 있습니다. 각 환경의 확인 결과는 저장소의 검증 기록에 남깁니다.

## 사용하기

Claude Code 설치 명령입니다.

```text
/plugin install meeting-actions --marketplace joint-now/joint-business-skills
```

Codex CLI에서는 `codex plugin marketplace add joint-now/joint-business-skills` 실행 후 `codex plugin add meeting-actions@joint-business-skills`로 설치합니다.

설치한 뒤 회의 메모를 붙여 넣고 “후속 작업을 담당자와 기한별로 정리해 주세요”라고 요청해 주세요. `joint-meeting-actions` 스킬이 작업, 담당자, 기한, 상태와 근거를 표로 정리합니다. 회의 기록에 없는 정보는 확인할 항목으로 남깁니다.

다음은 가상 입력입니다.

```text
회의일: 2026-11-05, Asia/Seoul
민지: 제가 안내 자료를 11월 9일까지 보내겠습니다.
도윤: 가격은 내부 검토 후에 결정하겠습니다.
참석자: 다음 주에 데모를 보면 어떨까요? 일정은 아직 미정입니다.
```

첫 작업의 담당자는 민지이며 기한은 2026-11-09입니다. 가격 결정과 데모 제안은 확정 여부를 구분해서 정리합니다. 실제 고객 정보 대신 위와 같은 가상 자료로 먼저 확인하셔도 됩니다.

## 수정과 업데이트

원본은 `skills/joint-meeting-actions/SKILL.md`입니다. 지침을 수정하고 버전을 올려 배포하면 사용자가 설치한 경로에 따라 업데이트할 수 있습니다. 공개 디렉터리에 노출된 버전은 각 서비스의 검증과 게시 절차를 따릅니다.

이 플러그인은 별도의 서버, 계정 연동과 API 키를 요구하지 않습니다. 입력 자료는 실행하는 AI 서비스의 대화에 전달됩니다. 라이선스는 MIT입니다.
