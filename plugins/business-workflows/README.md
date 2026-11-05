# Business Workflows

고객사 조사, 미팅 준비, 회의 정리와 후속 메일 작성을 돕는 Claude 업무 스킬입니다. 다른 회사의 사용자도 자기 회사 설명과 업무 자료를 입력해 사용할 수 있습니다. 회사명, 제품과 담당자를 자료에서 읽어 결과에 반영합니다.

처음에는 [회사 설명 예시](examples/company-context.md)를 자기 회사에 맞게 작성해 요청과 함께 첨부하세요. 이 파일은 선택 입력입니다. 회사 설명과 회의록을 대화에 직접 붙여넣어도 됩니다. 새 대화에서 필요한 회사 정보를 함께 제공하면 됩니다.

| 스킬 | 요청할 일 | 필요한 자료 |
| --- | --- | --- |
| 고객사 조사 | 대상 회사 브리핑과 확인 질문 작성 | 회사명과 홈페이지 또는 회사 소개 자료 |
| 미팅 준비 | 목표, 진행안과 우선 질문 작성 | 미팅 목적과 이전 대화 |
| 회의 정리 | 결정, 미결 사항과 후속 작업 추출 | 회의 메모 또는 녹취 |
| 후속 메일 | 제목과 본문 초안 작성 | 수신자, 연락 목적과 대화 근거 |

## 설치

Claude 웹·데스크톱에서 `Customize → Plugins → Add → Add marketplace → Add from a repository`를 선택하고 배포 저장소 주소를 추가하세요. 목록에서 `Business Workflows`를 설치하면 업무 스킬을 사용할 수 있습니다. ZIP으로 받았으면 `Add → Upload plugin`에서 해당 파일을 업로드하세요.

Claude Code 사용자는 아래 OWNER/REPO를 실제 배포 저장소로 교체해 설치할 수 있습니다.

```bash
claude plugin marketplace add OWNER/REPO
claude plugin install business-workflows@joint-business-skills
```

## 첫 실행

[가상 회의록](examples/meeting-notes.md)을 첨부하고 다음과 같이 요청하세요.

```text
고객 회의 정리 스킬로 첨부한 회의록을 정리해 주세요.
확정된 결정, 검토 중인 제안과 후속 작업을 구분해 주세요.
담당자와 기한은 원문에서 확인한 값으로 적어 주세요.
```

[고객 조사 자료](examples/company-brief.md), [자료가 부족한 회의 메모](examples/incomplete-meeting.md)와 [업무별 요청 예시](examples/requests.md)도 함께 제공합니다. 예제의 회사와 사람은 모두 가상입니다.

각 스킬은 단독으로 사용하거나 조사 → 미팅 준비 → 회의 정리 → 후속 메일 순서로 이어 쓸 수 있습니다. 회사별 자료와 결과 공유 범위는 해당 요청에서 지정하세요. 확인된 사실과 가설, 제안과 합의를 구분하며 필요한 정보가 없으면 확인할 항목으로 남깁니다.

## 실행 환경과 업데이트

Claude 웹·데스크톱 채팅, Cowork와 Claude Code에서 사용하는 Markdown 스킬입니다. 웹과 Cowork에서는 스킬을 선택하거나 자연어로 업무를 요청하세요. Claude Code에서는 `/business-workflows:summarize-customer-meeting`처럼 스킬을 지정할 수 있습니다.

사용할 입력 자료는 사용자가 준비합니다. 웹 조회가 가능한 환경에서는 허용한 범위에서 공개 자료를 참고하고 자료 조회 도구가 없으면 첨부 자료를 기준으로 작성합니다. 메일 결과는 검토할 초안으로 제공합니다. 서비스 연결이 필요한 작업은 사용자의 연결 계정과 접근 권한을 따릅니다.

웹·Cowork의 마켓플레이스에는 `Check for updates`와 GitHub의 `Sync automatically` 설정을 사용할 수 있습니다. Claude Code에서 직접 추가한 마켓플레이스는 `/plugin → Marketplaces`에서 자동 업데이트를 켜거나 다음 명령으로 갱신합니다.

```bash
claude plugin marketplace update joint-business-skills
claude plugin update business-workflows@joint-business-skills
```

문제가 있으면 배포 저장소의 Issues에 사용 환경, 플러그인 버전과 재현 방법을 남겨 주세요. 사례에는 가상 자료를 사용해 주시면 확인과 재현이 쉽습니다.
