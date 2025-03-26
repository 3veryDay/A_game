# 러닝 음악 동기화 앱 개발 로드맵 (상세 버전)

## 1. 기획 및 요구사항 정의 (3/26)

### 🎯 목표 설정: 러닝 음악 동기화 앱의 핵심 가치 제안

#### 핵심 기능 상세 정의
1. **음악 연동 시스템**
   - Spotify, Apple Music API 통합
   - BPM 기반 음악 자동 선택 알고리즘
   - 페이스별 음악 템포 매칭
   - 사용자 맞춤형 플레이리스트 생성

2. **운동 데이터 추적**
   - 실시간 운동 시간 측정
   - 페이스 변화 감지 (빠른/느린 구간)
   - 칼로리 소모량 계산
   - 심박수 모니터링 (optional)

### 👥 사용자 페르소나 및 스토리

#### 타겟 사용자 정의
- 20-40대 러너
- 음악에 동기부여를 받는 운동 愛好家
- 데이터 기반 운동 관리에 관심 있는 사용자

#### 상세 사용자 스토리
1. "러닝 초보 민수는 음악과 함께 동기부여를 받으며 운동하고 싶어 한다."
   - 앱 실행 → Spotify 연동 → 페이스별 음악 자동 선택
   - 운동 중 음악 템포에 따라 페이스 유지
   - 운동 후 기록 확인 및 성취감 느낌

2. "꾸준한 마라토너 지은은 데이터 기반 트레이닝을 원한다."
   - 개인 맞춤형 플레이리스트 설정
   - 운동 기록 분석을 통한 성과 추적
   - 페이스별 심박수 모니터링

### 🛠 기술 스택 최종 선정

#### 모바일 앱 개발
- **React Native** 선택 이유
  - 크로스 플랫폼 개발
  - 네이티브 성능
  - 풍부한 음악/센서 라이브러리
  - 큰 커뮤니티 지원

#### 백엔드 및 데이터베이스
- **Firebase** 풀 스택 솔루션
  - Firestore: NoSQL 데이터베이스
  - Authentication: 소셜 로그인
  - Cloud Functions: 서버리스 백엔드
  - Storage: 사용자 데이터 관리

#### 음악 API 통합
- Spotify Web API
- Apple Music API
- OAuth 2.0 인증 지원

## 2. 초기 아키텍처 설계 (1~2주)

### 🔗 시스템 아키텍처 상세 설계

```
[모바일 앱]
   ↓
[Firebase Authentication]
   ↓
[Firebase Cloud Functions]
   ↓
[Firestore Database]
   ↓
[Spotify/Apple Music API]
```

#### 아키텍처 핵심 원칙
- 모듈성: 각 컴포넌트 독립적 설계
- 확장성: 새로운 기능 추가 용이
- 성능: 최소 리소스 사용
- 보안: 데이터 암호화 및 안전한 통신

### 📊 데이터 모델 상세 설계

#### 사용자 데이터 모델
```javascript
{
  userId: string,
  profile: {
    name: string,
    age: number,
    weight: number
  },
  settings: {
    musicPreferences: {
      fastPaceBPM: [160, 180],
      slowPaceBPM: [120, 140]
    }
  },
  subscriptionType: 'free' | 'premium'
}
```

#### 운동 기록 데이터 모델
```javascript
{
  workoutId: string,
  userId: string,
  date: timestamp,
  duration: number, // 초 단위
  pace: {
    fast: {
      duration: number,
      averageBPM: number
    },
    slow: {
      duration: number,
      averageBPM: number
    }
  },
  musicPlaylist: [
    {
      trackId: string,
      artist: string,
      bpm: number
    }
  ],
  calories: number
}
```

### 🌐 API 엔드포인트 상세 설계

#### 인증 관련 API
- `POST /auth/spotify-login`
- `POST /auth/apple-music-login`
- `GET /auth/refresh-token`

#### 운동 관련 API
- `POST /workout/start`
  - 입력: 운동 타입, 음악 플랫폼
  - 출력: 워크아웃 세션 ID

- `PUT /workout/update`
  - 실시간 운동 데이터 업데이트
  - 페이스 변화 감지
  - 음악 템포 조정

- `POST /workout/stop`
  - 운동 종료 
  - 총 운동 데이터 저장

- `GET /workout/history`
  - 페이지네이션 지원
  - 필터링 옵션 (날짜, 운동 타입)

#### 음악 관련 API
- `GET /music/playlist`
  - BPM 기반 플레이리스트 생성
- `POST /music/play`
- `PUT /music/pause`
- `PUT /music/next-track`

## 3. MVP 개발 단계 (4~6주)

### 🖥️ UI/UX 상세 설계

#### 와이어프레임 구조
1. 온보딩 화면
2. 메인 대시보드
3. 운동 시작 화면
4. 음악 플레이어
5. 운동 기록 화면
6. 설정 화면

#### 디자인 가이드라인
- 최소 인지적 부하
- 명확한 정보 계층
- 운동 중 쉬운 인터랙션
- 반응형 디자인

### 🎵 음악 연동 전략

#### OAuth 2.0 인증 흐름
1. 사용자 로그인 요청
2. 토큰 발급 및 저장
3. 토큰 갱신 메커니즘
4. 안전한 토큰 관리

#### 백그라운드 재생 처리
- 네이티브 백그라운드 서비스 활용
- 운동 중 음악 지속 재생
- 배터리 최적화

### 🗄️ 데이터 관리 전략

#### Firebase Firestore 최적화
- 인덱싱 전략
- 효율적인 쿼리 설계
- 오프라인 동기화 지원

#### 캐싱 메커니즘
- React Native Async Storage
- Redux Persist
- 최소 네트워크 사용량
