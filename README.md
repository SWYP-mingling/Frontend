# 📍 Mingling (밍글링) - 중간 위치로 만날 곳 정하기

![Mingling Logo](public/images/banner.jpg)
[🔗밍글링 사이트 바로가기](https://www.mingling.kr/)

## 📝 프로젝트 소개

**Mingling(밍글링)** 은 모임 참석자들의 출발 위치를 바탕으로 **가장 공평하고 이동이 편리한 중간 지점을 찾아주는 서비스**입니다. 
지인들과 약속 장소를 정할 때 "어디서 만날까?"라는 고민과 위치 선정의 불공평함을 해결하기 위해 기획되었습니다. 단순한 물리적 중간 거리가 아닌 **실제 지하철 이동 시간과 환승 횟수**를 고려하여 서울 내 최적의 번화가와 모임의 목적(식당, 카페, 놀거리 등)에 맞는 장소를 추천해 줍니다.

### 🎯 핵심 컨셉
- **공평함**: 모두의 이동 시간이 엇비슷한 진짜 '중간' 지점 탐색
- **편의성**: 복잡한 계산 없이 출발역만 입력하면 끝나는 직관적인 흐름
- **맞춤형 추천**: 모임 목적에 부합하는 장소(카테고리별) 제안

---
## ✨ 팀원 구성
|**강동윤 (프론트엔드)**|**김태우 (프론트엔드)**|**이용석 (백엔드)**|
|:-:|:-:|:-:|
|<img src="https://avatars.githubusercontent.com/u/58673491?v=4" width="150" height="150"/><br/>[@kangdy25](https://github.com/kangdy25)|<img src="https://avatars.githubusercontent.com/u/70637743?v=4" width="150" height="150"/><br/>[@kim3360](https://github.com/kim3360)|<img src="https://avatars.githubusercontent.com/u/189859697?v=4" width="150" height="150"/><br/>[@Yongseok-2](https://github.com/Yongseok-2)|
|**심세영 (백엔드)**|**임준식 (백엔드)**|**강경훈 (백엔드)**|
|<img src="https://avatars.githubusercontent.com/u/160497402?v=4" width="150" height="150"/><br/>[@casylm](https://github.com/casylm)|<img src="https://avatars.githubusercontent.com/u/148741097?v=4" width="150" height="150"/><br/>[@sik2Boii](https://github.com/sik2Boii)|<img src="https://avatars.githubusercontent.com/u/184194654?v=4" width="150" height="150"/><br/>[@rkdrudgns0412](https://github.com/rkdrudgns0412)|

<sub>[Table made by TIT](https://team-info-table.seondal.kr/)</sub>

## 🚀 주요 기능
- **공평한 중간 지점 계산**: 위치 기반이 아닌, 대중교통(지하철) 이동 시간과 환승 효율을 고려한 최적의 중간역 산출
- **번화가 추천**: 단순 중간 지점이 아닌, 실제로 모이기 좋고 놀거리가 많은 **서울 내 상위 3개 번화가** 추천
- **목적별 장소 큐레이션**: 식당, 카페, 술집, 놀거리, 장소 대여 등 카테고리별 장소 추천
- **참석자별 이동 정보 제공**: 각 참석자들의 예상 이동 시간, 환승 노선 등 세부 경로 제공 (Kakao Maps API 연동)
- **간편한 모임 공유**: 링크(URL) 하나로 손쉽게 친구들을 초대하고 출발지를 취합하는 기능
- **실시간 참여 현황**: 누가 어디서 출발하는지 실시간으로 확인 및 수정 가능

---

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js (v16)
- **Language**: TypeScript
- **State Management**:
  - **Client/UI State**: Zustand (v5)
  - **Server State**: TanStack Query (v5)
- **Styling**: Tailwind CSS V4, Shadcn/UI
- **Map & Location**: Kakao Maps API (`react-kakao-maps-sdk`)
- **Utilities**: `es-hangul` (한국어 처리)
- **Package Manager**: pnpm

---

## 📂 프로젝트 구조

Next.js App Router 아키텍처를 기반으로 도메인과 역할을 명확히 분리하여 설계했습니다.

```bash
src/ (또는 root)
 ├ 📁 app/           # Next.js App Router 기반 페이지 (create, join, meeting, recommend, share 등)
 ├ 📁 components/    # 도메인별/재사용 가능한 UI 컴포넌트 (map, modal, ui, providers)
 ├ 📁 hooks/         # 커스텀 훅 (UI 로직, React Query 기반 api/query, api/mutation)
 ├ 📁 lib/           # 유틸리티 함수, 공통 API fetcher (api.ts 코어 로직)
 ├ 📁 store/         # Zustand 전역 상태 관리 (useModalStore 등)
 ├ 📁 types/         # TypeScript 인터페이스 및 타입 정의
 └ 📁 public/        # 정적 에셋 (이미지, 아이콘 등)
```

---

## ⚙️ 실행 방법

이 프로젝트는 `pnpm`을 패키지 매니저로 사용합니다.

```bash
# 1. 저장소 클론
git clone [repository-url]

# 2. 의존성 설치
pnpm install

# 3. 환경변수 설정
# .env.local 파일을 생성하고 빌드와 실행에 필요한 환경변수(예: KAKAO_MAP_API_KEY)를 세팅합니다.

# 4. 개발 서버 실행
pnpm dev
```
브라우저에서 `http://localhost:3000`으로 접속하여 확인할 수 있습니다.

---

## 📸 주요 화면

| 랜딩 페이지 | 모임 생성 |
|:---:|:---:|
| <img src="public/readme/main.png" width="350px" height="250px" alt="main" /> | <img src="public/readme/create.png" width="350px" height="250px" alt="create" /> |

| 모임 참여 | 출발 위치 선택 |
|:---:|:---:|
|  <img src="public/readme/join.png" width="350px" height="250px" alt="join" /> | <img src="public/readme/meeting.png" width="350px" height="250px" alt="Route" /> |

| 중간지점 및 경로 확인 | 목적별 장소 추천 |
|:---:|:---:|
| <img src="public/readme/result.png" width="350px" height="250px" alt="midpoint" /> | <img src="public/readme/recommend.png" width="350px" height="250px" alt="recommend" /> |
