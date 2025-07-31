# Aegis Frontend

Aegis는 이미지 보안 및 검증을 위한 웹 애플리케이션입니다. 이 프로젝트는 Next.js로 구축된 프론트엔드 애플리케이션으로, 외부 API 서버와 연결되어 있습니다.

## 주요 기능

- 🔐 사용자 인증 (회원가입/로그인)
- 🛡️ 이미지 워터마킹 (원본 보호)
- 🔍 이미지 위변조 검증
- 📊 대시보드 및 분석 통계
- 📱 반응형 디자인

## 기술 스택

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Hooks
- **Form Handling**: React Hook Form + Zod

## 시작하기

### 1. 의존성 설치

```bash
npm install
# 또는
pnpm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# 외부 API 서버 설정
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 3. 개발 서버 실행

```bash
npm run dev
# 또는
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## API 연결

이 프로젝트는 외부 API 서버와 연결되어 있습니다. API 서버가 실행 중인지 확인하고, 올바른 URL이 설정되어 있는지 확인하세요.

### API 엔드포인트

- `POST /signup` - 회원가입
- `POST /login` - 로그인
- `GET /users/me` - 내 정보 조회
- `POST /upload` - 이미지 업로드
- `POST /validate` - 이미지 검증
- `GET /images` - 사용자 이미지 목록 조회

## 프로젝트 구조

```
Aegis-frontend/
├── app/                    # Next.js App Router
│   ├── dashboard/         # 대시보드 페이지
│   ├── login/            # 로그인 페이지
│   ├── signup/           # 회원가입 페이지
│   ├── protect/          # 이미지 보호 페이지
│   ├── verify/           # 이미지 검증 페이지
│   └── my-images/        # 내 이미지 페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── ui/              # UI 컴포넌트 (Radix UI)
│   ├── header.tsx       # 헤더 컴포넌트
│   ├── footer.tsx       # 푸터 컴포넌트
│   └── file-upload.tsx  # 파일 업로드 컴포넌트
├── lib/                  # 유틸리티 및 API 클라이언트
│   ├── api.ts           # API 클라이언트
│   ├── auth-utils.ts    # 인증 유틸리티
│   └── utils.ts         # 일반 유틸리티
└── public/              # 정적 파일
```

## 개발 가이드

자세한 개발 가이드는 [MOCK_API_TEST_GUIDE.md](./MOCK_API_TEST_GUIDE.md)를 참조하세요.

## 배포

### Vercel 배포

1. Vercel에 프로젝트 연결
2. 환경 변수 설정:
   - `NEXT_PUBLIC_API_BASE_URL`: 프로덕션 API 서버 URL
3. 배포 완료

### 다른 플랫폼

```bash
npm run build
npm start
```

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 