
1. 프로젝트 개요
MSA 기반의 이벤트 / 보상 시스템
## ⚙️ 기술 스택

- **Node.js**: 18 (고정)
- **NestJS**: 최신
- **DB**: MongoDB
- **인증**: JWT
- **배포/실행**: Docker + docker-compose
- **언어**: TypeScript

2. 기능 상세









3. 설계 고려사항

모노레포 사용 여부 고민 : DTO등 스키마 공유, 프로젝트 구성등에 유리하고 적합하여 적용
기존 nestjs의 모노레포는 모든 패키지를 하나의 package.json으로 관리 하기 때문에, 추가적으로 pnpm workspace을 이용해서 개별 패키지 관리방식을 택함

