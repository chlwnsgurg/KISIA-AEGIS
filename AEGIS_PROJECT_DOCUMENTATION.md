# AEGIS AI 위변조 탐지 서비스 - 프로젝트 문서

## 📋 프로젝트 개요

AEGIS는 AI 기반 위변조(딥페이크) 탐지 및 검증 서비스입니다. 사용자가 이미지를 업로드하여 위변조 여부를 확인하고, 원본 이미지에 보이지 않는 워터마크를 삽입하여 저작권을 보호할 수 있는 웹 서비스입니다.

### 주요 기능
- 🛡️ **디지털 원본 보호**: 보이지 않는 워터마크 삽입
- 🔍 **AI 위변조 검증**: 딥페이크 및 편집 흔적 탐지
- 📊 **상세 분석 보고서**: 법적 증거로 활용 가능한 리포트
- 👤 **사용자 관리**: 로그인, 회원가입, 이미지 히스토리 관리

## 🎨 디자인 시스템

### 색상 팔레트
\`\`\`css
/* Primary Colors */
--primary: 237 83% 26%;           /* 다크 블루 (#1A237E) */
--primary-foreground: 210 40% 98%; /* 흰색 텍스트 */

/* Accent Colors */
--accent: 174 100% 29%;           /* 틸 (#009688) - 긍정적 결과 */
--destructive: 0 84% 37%;         /* 레드 (#D32F2F) - 부정적 결과 */

/* Background Colors */
--background: 0 0% 100%;          /* 화이트 (#FFFFFF) */
--secondary: 210 40% 96%;         /* 라이트 그레이 (#F5F5F5) */
\`\`\`

### 타이포그래피
- **폰트**: 시스템 폰트 스택 (Apple SD Gothic Neo, Pretendard, Noto Sans KR 등)
- **반응형**: 모든 기기에서 최적화된 텍스트 크기

## 🏗️ 프로젝트 구조

\`\`\`
aegis-website/
├── app/
│   ├── globals.css                 # 전역 스타일
│   ├── layout.tsx                  # 루트 레이아웃
│   ├── page.tsx                    # 메인 페이지
│   ├── loading.tsx                 # 로딩 컴포넌트
│   ├── login/
│   │   └── page.tsx               # 로그인 페이지
│   ├── signup/
│   │   └── page.tsx               # 회원가입 페이지
│   ├── protect/
│   │   └── page.tsx               # 원본 보호 페이지
│   ├── verify/
│   │   └── page.tsx               # 위변조 검증 페이지
│   ├── result/
│   │   └── [id]/
│   │       └── page.tsx           # 결과 페이지
│   ├── dashboard/
│   │   ├── page.tsx               # 대시보드
│   │   └── loading.tsx            # 대시보드 로딩
│   └── my-images/
│       ├── page.tsx               # 내 이미지 목록
│       └── loading.tsx            # 이미지 목록 로딩
├── components/
│   ├── header.tsx                 # 공통 헤더
│   ├── footer.tsx                 # 공통 푸터
│   ├── file-upload.tsx            # 파일 업로드 컴포넌트
│   ├── image-comparison.tsx       # 이미지 비교 슬라이더
│   └── ui/                        # shadcn/ui 컴포넌트들
└── package.json                   # 의존성 관리
\`\`\`

## 📱 페이지별 상세 구현

### 1. 메인 페이지 (`/`)
- **Hero 섹션**: 서비스 소개 및 CTA
- **핵심 기능 소개**: 3개 카드로 주요 기능 설명
- **기술적 우위**: Zero-shot 대응, 95% 정밀도, 강인한 워터마크
- **반응형 디자인**: 데스크톱, 태블릿, 모바일 최적화

### 2. 로그인 페이지 (`/login`)
- **기본 로그인**: 이메일/비밀번호
- **소셜 로그인**: Google, 카카오 (UI만 구현)
- **추가 기능**: 비밀번호 보기/숨기기, 로그인 상태 유지
- **폼 검증**: 클라이언트 사이드 검증

### 3. 회원가입 페이지 (`/signup`)
- **회원 정보**: 이름, 이메일, 비밀번호, 비밀번호 확인
- **약관 동의**: 이용약관, 개인정보처리방침
- **소셜 가입**: Google, 카카오 (UI만 구현)
- **폼 검증**: 비밀번호 일치 확인, 약관 동의 확인

### 4. 원본 보호 페이지 (`/protect`)
- **파일 업로드**: 드래그 앤 드롭 지원
- **저작권 정보**: 선택적 메타데이터 입력
- **처리 과정**: 로딩 상태 표시
- **결과 다운로드**: 워터마크가 삽입된 이미지 다운로드

### 5. 위변조 검증 페이지 (`/verify`)
- **파일 업로드**: 드래그 앤 드롭 지원
- **분석 과정**: AI 분석 진행 상태 표시
- **결과 리다이렉트**: 분석 완료 후 결과 페이지로 이동

### 6. 결과 페이지 (`/result/[id]`)
- **결과 요약**: 위변조 여부, 신뢰도, 저작권 정보
- **상세 분석**: 탐지된 위변조 내역
- **이미지 비교**: 드래그 슬라이더로 원본/분석 결과 비교
- **보고서 기능**: PDF 다운로드, 링크 복사, 결과 공유

### 7. 대시보드 (`/dashboard`)
- **통계 카드**: 총 분석 횟수, 보호된 이미지, 탐지된 위변조, 정확도
- **최근 분석**: 최근 처리된 이미지 목록
- **차트**: 월별 이용 현황 (UI만 구현)

### 8. 내 이미지 (`/my-images`)
- **이미지 그리드**: 업로드한 모든 이미지 표시
- **검색/필터**: 파일명 검색, 유형별/상태별 필터링
- **상태 표시**: 보호됨, 안전, 위변조 탐지 상태 구분
- **액션 버튼**: 결과 보기, 다운로드

## 🔧 주요 컴포넌트

### Header (`components/header.tsx`)
- **적응형 스타일**: 페이지별 배경에 따른 색상 변경
- **반응형 네비게이션**: 데스크톱/모바일 메뉴
- **인증 상태**: 로그인/로그아웃 상태에 따른 UI 변경 (준비됨)

### FileUpload (`components/file-upload.tsx`)
- **드래그 앤 드롭**: react-dropzone 사용
- **파일 검증**: 형식, 크기 제한
- **미리보기**: 업로드된 이미지 썸네일 표시

### ImageComparison (`components/image-comparison.tsx`)
- **슬라이더 비교**: 마우스 드래그로 이미지 비교
- **반응형**: 모든 기기에서 작동
- **접근성**: 키보드 네비게이션 지원

## 🔌 백엔드 연결을 위한 API 명세

### 1. 인증 API

#### 회원가입
\`\`\`typescript
POST /api/auth/signup
Content-Type: application/json

Request Body:
{
  "name": string,
  "email": string,
  "password": string
}

Response:
{
  "success": boolean,
  "message": string,
  "user": {
    "id": string,
    "name": string,
    "email": string,
    "createdAt": string
  },
  "token": string
}
\`\`\`

#### 로그인
\`\`\`typescript
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": string,
  "password": string,
  "rememberMe": boolean
}

Response:
{
  "success": boolean,
  "message": string,
  "user": {
    "id": string,
    "name": string,
    "email": string
  },
  "token": string
}
\`\`\`

#### 로그아웃
\`\`\`typescript
POST /api/auth/logout
Authorization: Bearer {token}

Response:
{
  "success": boolean,
  "message": string
}
\`\`\`

### 2. 이미지 처리 API

#### 원본 보호 (워터마크 삽입)
\`\`\`typescript
POST /api/protect
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request Body:
{
  "image": File,
  "copyrightInfo": string (optional)
}

Response:
{
  "success": boolean,
  "message": string,
  "data": {
    "id": string,
    "originalFilename": string,
    "protectedImageUrl": string,
    "copyrightInfo": string,
    "processedAt": string
  }
}
\`\`\`

#### 위변조 검증
\`\`\`typescript
POST /api/verify
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request Body:
{
  "image": File
}

Response:
{
  "success": boolean,
  "message": string,
  "data": {
    "id": string,
    "analysisId": string,
    "status": "processing" | "completed",
    "estimatedTime": number
  }
}
\`\`\`

#### 분석 결과 조회
\`\`\`typescript
GET /api/result/{analysisId}
Authorization: Bearer {token}

Response:
{
  "success": boolean,
  "data": {
    "id": string,
    "originalFilename": string,
    "isManipulated": boolean,
    "confidence": number,
    "copyrightInfo": string | null,
    "originalImageUrl": string,
    "analysisImageUrl": string,
    "detectedManipulations": [
      {
        "type": string,
        "confidence": number,
        "region": string,
        "coordinates": {
          "x": number,
          "y": number,
          "width": number,
          "height": number
        }
      }
    ],
    "reportUrl": string,
    "processedAt": string
  }
}
\`\`\`

### 3. 사용자 데이터 API

#### 내 이미지 목록
\`\`\`typescript
GET /api/my-images?page=1&limit=20&type=all&status=all&search=""
Authorization: Bearer {token}

Response:
{
  "success": boolean,
  "data": {
    "images": [
      {
        "id": string,
        "filename": string,
        "uploadDate": string,
        "type": "protect" | "verify",
        "status": "safe" | "manipulated" | "protected" | "processing",
        "confidence": number | null,
        "thumbnailUrl": string,
        "size": string,
        "analysisId": string | null
      }
    ],
    "pagination": {
      "currentPage": number,
      "totalPages": number,
      "totalItems": number,
      "hasNext": boolean,
      "hasPrev": boolean
    }
  }
}
\`\`\`

#### 대시보드 통계
\`\`\`typescript
GET /api/dashboard/stats
Authorization: Bearer {token}

Response:
{
  "success": boolean,
  "data": {
    "totalAnalyses": number,
    "protectedImages": number,
    "detectedFakes": number,
    "successRate": number,
    "monthlyStats": [
      {
        "month": string,
        "analyses": number,
        "protections": number,
        "detections": number
      }
    ],
    "recentAnalyses": [
      {
        "id": string,
        "filename": string,
        "type": "protect" | "verify",
        "status": string,
        "confidence": number,
        "date": string
      }
    ]
  }
}
\`\`\`

### 4. 파일 관리 API

#### 이미지 다운로드
\`\`\`typescript
GET /api/download/{imageId}
Authorization: Bearer {token}

Response: Binary file stream
Headers:
- Content-Type: image/jpeg | image/png | image/webp
- Content-Disposition: attachment; filename="protected_image.jpg"
\`\`\`

#### 보고서 다운로드
\`\`\`typescript
GET /api/report/{analysisId}/pdf
Authorization: Bearer {token}

Response: Binary PDF stream
Headers:
- Content-Type: application/pdf
- Content-Disposition: attachment; filename="aegis-report-{analysisId}.pdf"
\`\`\`

## 🗄️ 데이터베이스 스키마

### Users 테이블
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Images 테이블
\`\`\`sql
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  original_filename VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  original_image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Analyses 테이블
\`\`\`sql
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id UUID REFERENCES images(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('protect', 'verify')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('processing', 'completed', 'failed')),
  is_manipulated BOOLEAN,
  confidence DECIMAL(5,2),
  copyright_info TEXT,
  processed_image_url TEXT,
  report_url TEXT,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Manipulations 테이블
\`\`\`sql
CREATE TABLE manipulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  confidence DECIMAL(5,2) NOT NULL,
  region VARCHAR(100),
  coordinates JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## 🔐 보안 고려사항

### 인증 및 권한
- **JWT 토큰**: 사용자 인증
- **토큰 만료**: 액세스 토큰 (1시간), 리프레시 토큰 (30일)
- **권한 검증**: 각 API 엔드포인트에서 사용자 권한 확인

### 파일 보안
- **파일 크기 제한**: 최대 10MB
- **파일 형식 검증**: JPEG, PNG, WEBP만 허용
- **바이러스 스캔**: 업로드된 파일 검사
- **안전한 저장**: 클라우드 스토리지 (AWS S3, Google Cloud Storage 등)

### 데이터 보호
- **개인정보 암호화**: 민감한 데이터 암호화 저장
- **HTTPS 강제**: 모든 통신 암호화
- **CORS 설정**: 허용된 도메인에서만 API 접근

## 🚀 배포 및 환경 설정

### 환경 변수
\`\`\`env
# 데이터베이스
DATABASE_URL=postgresql://username:password@localhost:5432/aegis_db

# JWT 시크릿
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-token-secret

# 파일 스토리지
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=aegis-images-bucket
AWS_REGION=ap-northeast-2

# AI 모델 API
AI_MODEL_API_URL=https://your-ai-model-api.com
AI_MODEL_API_KEY=your-ai-model-api-key

# 이메일 서비스 (선택사항)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# 기타
NEXT_PUBLIC_APP_URL=https://aegis.example.com
NODE_ENV=production
\`\`\`

### Docker 설정 (선택사항)
\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
\`\`\`

## 📊 모니터링 및 로깅

### 로그 수집
- **사용자 활동**: 로그인, 이미지 업로드, 분석 요청
- **시스템 성능**: API 응답 시간, 에러율
- **보안 이벤트**: 실패한 로그인 시도, 의심스러운 활동

### 메트릭 추적
- **사용량 통계**: 일일/월별 활성 사용자, 처리된 이미지 수
- **성능 지표**: 평균 처리 시간, 정확도 통계
- **비즈니스 메트릭**: 전환율, 사용자 유지율

## 🔄 향후 개발 계획

### Phase 1: 기본 기능 구현
- [ ] 사용자 인증 시스템
- [ ] 이미지 업로드 및 처리
- [ ] AI 모델 연동
- [ ] 기본 대시보드

### Phase 2: 고급 기능
- [ ] 실시간 알림
- [ ] 배치 처리
- [ ] API 키 관리
- [ ] 결제 시스템

### Phase 3: 확장 기능
- [ ] 모바일 앱
- [ ] 기업용 대시보드
- [ ] 화이트라벨 솔루션
- [ ] 다국어 지원

## 📞 기술 지원

### 개발 환경 설정
1. Node.js 18+ 설치
2. PostgreSQL 설치 및 설정
3. 환경 변수 설정
4. `npm install` 실행
5. `npm run dev` 로 개발 서버 시작

### 주요 의존성
- **Next.js 14**: React 프레임워크
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 스타일링
- **shadcn/ui**: UI 컴포넌트
- **react-dropzone**: 파일 업로드
- **Lucide React**: 아이콘

이 문서는 AEGIS 프로젝트의 전체적인 구조와 백엔드 연동을 위한 상세한 가이드를 제공합니다. 추가적인 질문이나 구체적인 구현 방법에 대해서는 개발팀과 상의하시기 바랍니다.
