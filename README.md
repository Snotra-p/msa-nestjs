
1. 프로젝트 개요
## 구조
/
├── apps/
│   ├── auth-server/
│   ├── gateway-server/
│   └── event-server/
├── libs/
│   ├── core/
│   └── shared/
└── docker-compose.yml

MSA 기반의 이벤트 / 보상 시스템
## ⚙️ 기술 스택

- **Node.js**: 18 (고정)
- **NestJS**: 최신
- **DB**: MongoDB
- **인증**: JWT
- **배포/실행**: Docker + docker-compose
- **언어**: TypeScript

## 실행 방법
docker compose up -d

2. 기능 상세(api)
auth-server(3000 port)
gateway-server(3001 port)
event-server(3002 port) /api-docs 의 swagger을 통해 테스트 가능합니다.

복수 스키마를 가지는 필드는 oneOf로 표시
디버깅 편의를 위해 요구사항에 나와있지 않은 조회 api는 따로 보안 인증을 하지 않았습니다.

## API Endpoints

### Auth API

| Method | Path            | Description                                   |
|--------|-----------------|-----------------------------------------------|
| POST   | /auth/login     | 로그인, Access/Refresh 토큰 발급              |
| POST   | /auth/refresh   | 토큰 갱신, Access/Refresh 토큰 재발급         |
| POST   | /auth/logout    | 로그아웃                                      |
| POST   | /auth/users     | 유저 생성 (테스트 편의상 인증 없음)           |

---

### Event Gateway API

#### Event

| Method | Path                      | Description                   |
|--------|---------------------------|-------------------------------|
| GET    | /event-gateway/event      | 이벤트 목록/상세 조회         |
| POST   | /event-gateway/event      | 이벤트 생성                   |

#### Rewards

| Method | Path                      | Description                   |
|--------|---------------------------|-------------------------------|
| GET    | /event-gateway/rewards    | 보상 목록/상세 조회           |
| POST   | /event-gateway/rewards    | 보상 등록                     |

#### User Events --- 유저 이벤트 진행 관련 조건 검증을 위한 스키마 및 api

| Method | Path                                   | Description                   |
|--------|----------------------------------------|-------------------------------|
| GET    | /event-gateway/user-events             | 유저 이벤트 내역 조회         |
| POST   | /event-gateway/user-events/process     | 유저 이벤트 처리 (조건 저장)  |

DTO특이사항 : 현재 /event-gateway/user-events/process 의 value는 퀘스트 조건일때만 임의의 questId로만 쓰입니다.

#### User Rewards Claims

| Method | Path                                             | Description                           |
|--------|--------------------------------------------------|---------------------------------------|
| GET    | /event-gateway/user-reward-claims                | 전체 유저 보상 요청 이력 조회         |
| POST   | /event-gateway/user-reward-claims                | 유저 보상 요청                        |
| GET    | /event-gateway/user-reward-claims/me             | (본인) 보상 요청 이력 조회            |
| PATCH  | /event-gateway/user-reward-claims/{id}/approve   | 보상 요청 승인 (관리자/운영자)        |
| PATCH  | /event-gateway/user-reward-claims/{id}/reject    | 보상 요청 거절 (관리자/운영자)        |


테스트 시나리오 1
POST /auth/users 로 ADMIN 유저 생성
POST /auth/login 진행, 받은 토큰 오른쪽 상단 자물쇠 authroize를 눌러 리프레시 토큰 세팅
POST /auth/refresh 호출, 새로 받은 리프레시 토큰 세팅
POST /auth/logout  호출
POST /auth/refresh 호출하면 로그아웃으로 인한 세션 만료

POST /event-gateway/event 호출
예시 body data
{
  "name": "이벤트1",
  "activate": true,
  "description": "이벤트입니다",
  "startedAt": "2025-05-11T06:09:53.361Z",
  "endedAt": "2025-05-25T06:09:53.361Z",
  "userId": "682c1aaa6fb6c7f00ae8ae33",
  "requireApproval": true,
  "contents": [
    {
      "type": "attendance",
      "count": 1
    }
  ]
}

POST /event-gateway/rewards 호출
예시 body data
{
  "eventId": "682c1d0e2a31d50249631487",
  "userId": "682c1aaa6fb6c7f00ae8ae33",
  "contents": [
    {
      "type": "item",
      "itemName": "슈퍼박스",
      "quantity": 2
    },

    {
      "type": "item",
      "itemName": "슈퍼박스2",
      "quantity": 2
    },

    {
      "type": "item",
      "itemName": "슈퍼박스3",
      "quantity": 2
    }
  ]
}

POST /event-gateway/user-events/process 호출
예시 데이터
{
  "eventType": "attendance",
  "userId": "682c1aaa6fb6c7f00ae8ae33",
  "count": 1
}


POST /event-gateway/user-reward-claims
예시 데이터
{
  "userId": "682c1aaa6fb6c7f00ae8ae33",
  "rewardsId": "682c1d712a31d5024963148c"
}

requireApproval에 따라 processing, 혹은 pending

GET /event-gateway/user-reward-claims/me 결과 확인

POST /event-gateway/user-reward-claims/{id}/approve 결과 확인


복수 조건, 복수 이벤트에 대한 유저이벤트조건 달성 갱신 확인 가능



3. 설계 고려사항

1) 모노레포 사용 : DTO등 스키마 공유, msa 프로젝트 구성등에 유리하고 적합하여 적용
기본 nestjs의 모노레포는 모든 패키지를 하나의 package.json으로 관리 하기 때문에, 추가적으로 pnpm workspace을 이용해서 개별 패키지 관리방식을 택함
공유 libs 모듈 core, shared 로 분리하여 전체 프로젝트에 사용되는 공통 부분은 core, DTO등 일부 서버에서 사용되는것이 있으면 shared로 관리


2) Role 관리 설계
Role(권한) 관련 정책은 실제 서비스 운영상 자주, 즉각적으로 변경되는 요소가 아니며,
실시간 동적 변경의 필요성이 없는 요구사항으로 판단하였습니다.

만약 향후 정책 변경/관리가 필요해질 경우, 각 권한별로 허용 URL Path(리소스) 매핑 등으로 확장 가능하지만,
현 단계에서는 별도의 Role 테이블(DB) 없이 어플리케이션 상수(Constant) 기반으로 관리하는 구조를 채택하였습니다.

Role의 추가/변경 시에는 단순 DB 데이터만 수정하는 것으로는 실질적 권한 정책 변경이 반영되지 않고,
실제 Application 코드(가드, 인가 분기 등)도 반드시 함께 수정/배포가 필요합니다.

따라서, 불필요한 데이터베이스 테이블로 복잡성을 증가시키는 대신, 코드 상수로 명확하게 관리하는 방법을 택하였습니다.

3) JWT 알고리즘 선택 및 설계
RS256 비대칭키를 통해 auth 서버에서는 시크릿키를 통한 발급을 담당하고
gateway 혹은 그외 서버에서는 공개키를 통한 인증을 하도록 구성
무분별한 토큰 발급 제한을 위해 refresh시 hash 검증 및 교체, session 데이터 유지하도록 설계, refresh시에만 DB 갱신

4) 스키마리스 데이터베이스 활용하면서도 정적 스키마 보장
이벤트와 보상 스키마를 자유롭게 변형 / 추가 가능한 데이터구조를 적용
정적인 타입을 Union조건을 주어서 타입에 따라 처리 discrimitor 적용을 통해 스키마 정합성 보장

5) 보상 구조 설계
마스터 데이터 아이디를 기준으로 설계 하지 않고 embed형태로 처리
보상은 여러가지 형태가 혼합되어 제공될수 있으므로, contents 필드를 배열형태로 저장

6) 중복 보상 방지
msa구조상으로 보상을 지급을 처리하는 임의의 별도 서버가 있다고 가정하고, 해당 서버에서는 userId, eventId를 복합키로 가지고 처리하며 중복지급을 DB를 통해 방지합니다. 
따라서 지급 요청 내역의 eventId가 중복되어 생성되지 않는다면 하면 추가적인 다른 처리할 필요 없다고 생각했습니다.
보상 지급완료는 최종적으로는 콜백을 통해 최종 status를 업데이트 합니다. 
request가 실패하는 경우에 대비하여 배치서버를 통해 30초~1분이상 processing status 상태의 요청의 경우 재시도(혹은, 지급요청시 processing 경우 재시도) 하는 추가 로직이 필요합니다.

만약 중복 방지 책임이 이벤트 서버에 있다고 하면
분산락 솔루션을 이용하거나 replication과 함께 트랜잭션+낙관적 락을 사용 할 수 있습니다.

시나리오
조건확인 => claim 생성(processing) => claim 연관 유저 보상지급 이벤트 발행 => 콜백 으로 status complete 업데이트
조건확인 => claim 생성(processing) => claim 연관 유저 보상지급 이벤트 발행 => 실패 => 배치서버로 재시도 => 콜백


7) 이벤트 설계
or, and 조건처리가 둘다 가능하도록 설계 가능하지만, 시간 관계상 and 조건만 처리가능하도록 설계
이벤트에 복수의 conditions을 정의하고, 모든 조건의 충족을 확인할수 있게 만들었습니다.
이미 조건을 충족한 경우, 추가적인 업데이트를 하지 않는 정책을 기준으로했기 때문에, 조건 완료 여부를 
유저 행동에 따른 업데이트(user-event 테이블)에서 체크하도록 했습니다.


8) application level 서킷브레이커 적용
cockatiel 라이브러리 활용해 각 endpoint 값을 따로 관리하도록 구성한 서킷브레이커, retry 패턴 적용
