# AEGIS 프로젝트 - 백엔드 API 연결 구현 기록

## 📅 작업 날짜: 2025-07-31

## 📋 작업 개요
AEGIS 프로젝트의 프론트엔드(Next.js)와 백엔드 API를 연결하는 작업을 완료했습니다. `API_DOCUMENTATION.md`와 `AEGIS_PROJECT_DOCUMENTATION.md`를 참고하여 실제 백엔드 엔드포인트와 통신할 수 있도록 구현했습니다.

## 🔧 주요 구현 사항

### 1. API 클라이언트 생성 (`/lib/api.ts`)
- **싱글톤 패턴**을 사용한 `ApiClient` 클래스 구현
- **JWT 토큰 관리**: localStorage를 통한 access_token 및 refresh_token 관리
- **타입 안전성**: TypeScript 인터페이스를 통한 응답 타입 정의
- **구현된 API 메서드**:
  - `signup(email, password)`: 회원가입
  - `login(email, password)`: 로그인 및 토큰 저장
  - `getMe()`: 현재 사용자 정보 조회
  - `uploadImage(file)`: 이미지 업로드 (워터마크 삽입)
  - `validateImage(file)`: 이미지 위변조 검증
  - `logout()`: 로그아웃 및 토큰 삭제
  - `isAuthenticated()`: 인증 상태 확인

### 2. 환경변수 설정 (`.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```
- 백엔드 API 서버 주소를 환경변수로 관리
- 개발/프로덕션 환경에 따라 변경 가능

### 3. 로그인 페이지 연동 (`/app/login/page.tsx`)
- **API 연동**: `apiClient.login()` 메서드 사용
- **에러 처리**: toast 알림을 통한 사용자 친화적 에러 메시지
- **리다이렉션**: 로그인 성공 시 대시보드로 자동 이동
- **토큰 저장**: 로그인 성공 시 자동으로 access_token 저장

### 4. 회원가입 페이지 연동 (`/app/signup/page.tsx`)
- **API 연동**: `apiClient.signup()` 메서드 사용
- **유효성 검사**: 비밀번호 일치 확인, 약관 동의 확인
- **에러 처리**: 이메일 중복 등의 에러 상황 처리
- **리다이렉션**: 회원가입 성공 시 로그인 페이지로 이동

### 5. 원본 보호 페이지 연동 (`/app/protect/page.tsx`)
- **인증 확인**: 페이지 접근 시 로그인 상태 확인
- **이미지 업로드**: `apiClient.uploadImage()` 사용
- **미인증 사용자 처리**: 로그인 페이지로 리다이렉션
- **토스트 알림**: 업로드 성공/실패 알림

### 6. 위변조 검증 페이지 연동 (`/app/verify/page.tsx`)
- **인증 확인**: 페이지 접근 시 로그인 상태 확인
- **이미지 검증**: `apiClient.validateImage()` 사용
- **결과 페이지 이동**: 검증 완료 후 결과 페이지로 이동
- **에러 처리**: 검증 실패 시 사용자에게 알림

### 7. 헤더 컴포넌트 업데이트 (`/components/header.tsx`)
- **인증 상태 반영**: 로그인/로그아웃 상태에 따른 UI 변경
- **로그아웃 기능**: `apiClient.logout()` 호출 및 홈으로 이동
- **내 계정 버튼**: 로그인 시 내 계정 버튼 표시
- **반응형 디자인**: 모바일/데스크톱 모두에서 작동

### 8. 대시보드 페이지 업데이트 (`/app/dashboard/page.tsx`)
- **사용자 정보 표시**: `apiClient.getMe()`를 통해 이메일 표시
- **인증 확인**: 미인증 사용자는 로그인 페이지로 리다이렉션
- **개인화된 인사말**: 사용자 이메일을 포함한 환영 메시지

## 🔐 보안 고려사항
1. **토큰 관리**: localStorage를 사용하여 클라이언트 사이드에서 JWT 토큰 관리
2. **API 헤더**: 모든 인증이 필요한 요청에 `access-token` 헤더 자동 추가
3. **인증 확인**: 보호된 페이지 접근 시 자동으로 인증 상태 확인

## 🚨 주의사항 및 향후 개선사항

### 현재 제한사항:
1. **Refresh Token 처리**: 현재 refresh token 로직이 구현되지 않음
2. **이미지 URL**: 백엔드에서 처리된 이미지 URL을 받아오는 부분 미구현
3. **에러 세분화**: 더 구체적인 에러 메시지 처리 필요
4. **로딩 상태**: 전역 로딩 상태 관리 필요

### 향후 구현 필요:
1. **토큰 자동 갱신**: refresh token을 사용한 access token 자동 갱신
2. **이미지 다운로드**: S3에서 처리된 이미지 다운로드 기능
3. **결과 상세 페이지**: 실제 분석 결과 데이터 표시
4. **내 이미지 목록**: 업로드한 이미지 목록 조회 및 관리
5. **프로필 관리**: 사용자 정보 수정 기능

## 🧪 테스트 방법

### 백엔드 서버 실행:
```bash
# 백엔드 서버가 http://localhost:8000 에서 실행 중이어야 함
```

### 프론트엔드 실행:
```bash
npm run dev
# 또는
pnpm dev
```

### 테스트 시나리오:
1. **회원가입**: `/signup`에서 새 계정 생성
2. **로그인**: `/login`에서 생성한 계정으로 로그인
3. **원본 보호**: `/protect`에서 이미지 업로드 (PNG 파일만 지원)
4. **위변조 검증**: `/verify`에서 이미지 검증
5. **로그아웃**: 헤더의 로그아웃 버튼 클릭

## 📝 API 응답 형식
백엔드 API는 다음과 같은 통일된 응답 형식을 사용합니다:

### 성공 응답:
```json
{
  "success": true,
  "description": "작업 성공 메시지",
  "data": [
    // 실제 데이터
  ]
}
```

### 실패 응답:
```json
{
  "detail": "에러 메시지"
}
```

## 🔄 Git 커밋 메시지
이 작업에 대한 권장 커밋 메시지:
```
feat: 백엔드 API 연결 구현

- API 클라이언트 생성 및 JWT 토큰 관리
- 로그인/회원가입 페이지 백엔드 연동
- 이미지 업로드/검증 페이지 인증 및 API 연결
- 헤더 컴포넌트 인증 상태 반영
- 대시보드 사용자 정보 표시

백엔드 서버 주소는 .env.local의 NEXT_PUBLIC_API_BASE_URL로 설정
```

## 📚 참고 문서
- `API_DOCUMENTATION.md`: 백엔드 API 엔드포인트 명세
- `AEGIS_PROJECT_DOCUMENTATION.md`: 프로젝트 전체 구조 및 요구사항
- Next.js 공식 문서: https://nextjs.org/docs
- TypeScript 공식 문서: https://www.typescriptlang.org/docs

---

## 🧪 목업 백엔드 서버 구현 (추가 작업)

### 📅 작업 날짜: 2025-07-31

### 📋 작업 개요
실제 백엔드 서버 없이 테스트할 수 있도록 Next.js API Routes를 사용한 목업 백엔드를 구현했습니다.

### 🔧 구현 내용

#### 1. 외부 API 연결 (`/lib/api.ts`)
- **싱글톤 패턴**으로 구현된 API 클라이언트
- 외부 API 서버와 통신
- JWT 토큰 기반 인증
- 환경변수 `NEXT_PUBLIC_API_BASE_URL`로 API 서버 주소 설정

#### 2. 인증 유틸리티 (`/lib/auth-utils.ts`)
- Base64 인코딩을 사용한 간단한 JWT 토큰 구현
- 토큰 생성 및 검증 함수
- 액세스 토큰: 1시간 만료
- 리프레시 토큰: 30일 만료

#### 3. 외부 API 엔드포인트 연결
- **POST /signup**: 회원가입 처리
  - 외부 API 서버로 회원가입 요청 전송
  
- **POST /login**: 로그인 처리
  - 외부 API 서버로 로그인 요청 전송
  - JWT 토큰 수신 및 저장
  
- **GET /users/me**: 사용자 정보 조회
  - 토큰 검증
  - 외부 API 서버에서 사용자 정보 조회
  
- **POST /upload**: 이미지 업로드
  - 토큰 검증
  - 외부 API 서버로 이미지 업로드
  
- **POST /validate**: 이미지 검증
  - 토큰 검증
  - 외부 API 서버로 이미지 검증 요청
  
- **GET /images**: 사용자 이미지 목록 조회
  - 토큰 검증
  - 외부 API 서버에서 사용자 이미지 목록 조회

#### 4. API 클라이언트 수정
- 기본 API URL을 외부 서버 주소로 변경
- 환경변수 `NEXT_PUBLIC_API_BASE_URL`로 API 서버 주소 설정
- Bearer 토큰 인증 방식 사용

### 🎯 사용 방법

1. **개발 서버 실행**:
   ```bash
   npm run dev
   ```

2. **환경 변수 설정**:
   `.env.local` 파일 생성:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

3. **외부 API 서버 실행**:
   백엔드 API 서버가 `http://localhost:8000`에서 실행 중인지 확인

### ⚠️ 제한사항
- 외부 API 서버가 실행되지 않으면 모든 기능이 작동하지 않음
- API 서버의 응답 형식에 따라 클라이언트 코드 수정 필요
- CORS 설정이 올바르게 되어 있어야 함

### 📝 테스트 가이드
상세한 테스트 시나리오는 `MOCK_API_TEST_GUIDE.md` 파일 참조