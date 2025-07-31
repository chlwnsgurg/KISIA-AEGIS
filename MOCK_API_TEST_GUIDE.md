# 외부 API 연결 가이드

이 프로젝트는 외부 API 서버와 연결되어 있습니다. 로컬 개발 환경에서 테스트하려면 다음 단계를 따르세요.

## 환경 설정

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# 외부 API 서버 설정
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# 프로덕션 환경에서는 실제 API 서버 주소로 변경
# NEXT_PUBLIC_API_BASE_URL=https://your-api-server.com
```

### 2. 외부 API 서버 실행

백엔드 API 서버가 실행 중인지 확인하세요. 기본적으로 `http://localhost:8000`에서 실행됩니다.

## 인증 시스템

### 쿠키 기반 인증

이 프로젝트는 쿠키를 사용하여 인증 토큰을 관리합니다:

- **Access Token**: 7일간 유지되는 쿠키
- **Refresh Token**: 30일간 유지되는 쿠키
- **자동 토큰 갱신**: 토큰 만료 시 자동으로 갱신 시도

### 로그인 상태 유지

- 브라우저를 닫았다가 다시 열어도 로그인 상태가 유지됩니다
- 쿠키가 만료되면 자동으로 로그아웃됩니다
- 모든 API 요청에 자동으로 Bearer 토큰이 포함됩니다

## API 엔드포인트

### 인증 관련

- `POST /signup` - 회원가입
- `POST /login` - 로그인
- `GET /users/me` - 내 정보 조회

### 이미지 관련

- `POST /upload` - 이미지 업로드
- `POST /validate` - 이미지 검증
- `GET /images` - 사용자 이미지 목록 조회

## API 응답 형식

### 로그인 응답
```json
{
  "success": true,
  "description": "로그인 성공",
  "data": [
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "bearer"
    }
  ]
}
```

### 사용자 정보 응답
```json
{
  "id": 1,
  "name": "홍길동",
  "email": "user@example.com",
  "time_created": "2025-01-01T00:00:00Z"
}
```

### 이미지 업로드 응답
```json
{
  "id": 1,
  "user_id": 1,
  "time_created": "2025-01-01T00:00:00Z"
}
```

### 이미지 검증 응답
```json
{
  "message": "Validation successful",
  "input_data": "base64_encoded_data",
  "64bit": 123456789,
  "output_sr_h_data": "output_data"
}
```

## 개발 서버 실행

```bash
npm run dev
# 또는
pnpm dev
```

## 테스트

1. 회원가입 페이지에서 새 계정 생성
2. 로그인 페이지에서 로그인
3. 대시보드에서 이미지 업로드 및 검증 테스트
4. 내 이미지 페이지에서 업로드된 이미지 확인

## 주의사항

- 외부 API 서버가 실행되지 않으면 모든 API 요청이 실패합니다
- 환경 변수 `NEXT_PUBLIC_API_BASE_URL`이 올바르게 설정되어 있는지 확인하세요
- CORS 설정이 올바르게 되어 있어야 합니다
- 쿠키는 SameSite=Strict로 설정되어 있어 보안이 강화되어 있습니다