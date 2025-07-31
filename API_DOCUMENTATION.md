**메인 URL:** `BASE_URL`

---

## 인증

본 API는 JWT(JSON Web Token)를 사용한 인증 방식을 사용합니다. 로그인이 필요한 모든 엔드포인트는 HTTP 요청 헤더에 `access-token`을 포함해야 합니다.

- **Header**: `access-token: <YOUR_ACCESS_TOKEN>`

---

## 1. 회원

### 1.1. 회원가입

새로운 사용자를 등록합니다.

*   **Endpoint:** `POST` `BASE_URL/signup`
*   **기능:** 이메일과 비밀번호를 받아 사용자 계정을 생성합니다. 이메일은 중복될 수 없습니다.

#### 요청 (Request)

*   **Body:** `application/json`

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `email` | string | Y | 사용자의 이메일 주소 |
| `password` | string | Y | 사용자의 비밀번호 |

#### 응답 (Response)

*   **200 OK (성공)**

```json
{
  "success": true,
  "description": "회원가입 성공",
  "data": [
    "OK"
  ]
}
```

*   **400 Bad Request (실패 - 이메일 중복)**

```json
{
  "detail": "이미 가입된 이메일입니다."
}
```

---

### 1.2. 로그인

등록된 사용자가 이메일과 비밀번호로 로그인하여 JWT 토큰을 발급받습니다.

*   **Endpoint:** `POST` `BASE_URL/login`
*   **기능:** 사용자 인증에 성공하면 `access_token`과 `refresh_token`을 발급합니다.

#### 요청 (Request)

*   **Body:** `application/json`

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `email` | string | Y | 사용자의 이메일 주소 |
| `password` | string | Y | 사용자의 비밀번호 |

#### 응답 (Response)

*   **200 OK (성공)**

```json
{
  "success": true,
  "description": "로그인 성공",
  "data": [
    {
      "access_token": "your_access_token",
      "refresh_token": "your_refresh_token",
      "token_type": "bearer"
    }
  ]
}
```

*   **401 Unauthorized (실패 - 인증 정보 오류)**

```json
{
  "detail": "이메일 또는 비밀번호가 올바르지 않습니다."
}
```

---

### 1.3. 내 정보 조회

현재 로그인된 사용자의 정보를 조회합니다.

*   **Endpoint:** `GET` `BASE_URL/users/me`
*   **기능:** `access-token`을 기반으로 현재 사용자의 정보를 반환합니다.

#### 요청 (Request)

*   **Header:**

| 키 | 값 |
| --- | --- |
| `access-token` | <YOUR_ACCESS_TOKEN> |

#### 응답 (Response)

*   **200 OK (성공)**

```json
{
  "success": true,
  "description": "조회 성공",
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "password": "hashed_password",
      "time_created": "2025-07-31T00:00:00.000Z"
    }
  ]
}
```

*   **401 Unauthorized (실패 - 토큰 없음 또는 유효하지 않은 토큰)**

```json
{
  "detail": "Access token missing" or "Invalid token"
}
```

*   **404 Not Found (실패 - 사용자를 찾을 수 없음)**

```json
{
  "detail": "User not found"
}
```

---

## 2. 이미지

### 2.1. 이미지 업로드

이미지 파일을 서버에 업로드하고 S3에 저장합니다.

*   **Endpoint:** `POST` `BASE_URL/upload`
*   **기능:** PNG 형식의 이미지 파일을 업로드합니다. 파일은 S3 버킷의 특정 경로에 여러 버전으로 저장됩니다.

#### 요청 (Request)

*   **Header:**

| 키 | 값 |
| --- | --- |
| `access-token` | <YOUR_ACCESS_TOKEN> |

*   **Body:** `multipart/form-data`

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `file` | file | Y | 업로드할 이미지 파일. `.png` 형식, 최대 10MB. |

#### 응답 (Response)

*   **200 OK (성공)**

```json
{
  "success": true,
  "description": "생성 성공",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "time_created": "2025-07-31T00:00:00.000Z"
    }
  ]
}
```

*   **400 Bad Request (실패 - 파일 유효성 검사 오류)**

```json
{
  "detail": "File is required" or "Only PNG files are allowed" or "File size exceeds 10MB limit"
}
```

*   **401 Unauthorized (실패 - 토큰 없음 또는 유효하지 않은 토큰)**

```json
{
  "detail": "Access token missing" or "Invalid token"
}
```

*   **500 Internal Server Error (실패 - S3 업로드 오류)**

```json
{
  "detail": "S3 upload error message"
}
```

---

### 2.2. 이미지 검증

업로드된 이미지에 대한 검증을 요청합니다.

*   **Endpoint:** `POST` `BASE_URL/validate`
*   **기능:** 이미지 파일을 받아 AI 서버를 통해 검증 로직을 수행합니다. (현재는 로직이 구현되지 않음)

#### 요청 (Request)

*   **Header:**

| 키 | 값 |
| --- | --- |
| `access-token` | <YOUR_ACCESS_TOKEN> |

*   **Body:** `multipart/form-data`

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `file` | file | Y | 검증할 이미지 파일. `.png` 형식, 최대 10MB. |

#### 응답 (Response)

*   **200 OK (성공)**

```json
{
  "success": true,
  "description": "검증 성공",
  "data": [
    {
      "message": "검증 로직은 아직 구현되지 않았습니다.",
      "input_data": "example.png",
      "64bit": 1,
      "output_sr_h_data": "검증된 이미지 데이터"
    }
  ]
}
```

*   **400 Bad Request (실패 - 파일 유효성 검사 오류)**

```json
{
  "detail": "File is required" or "Only PNG files are allowed" or "File size exceeds 10MB limit"
}
```

*   **401 Unauthorized (실패 - 토큰 없음 또는 유효하지 않은 토큰)**

```json
{
  "detail": "Access token missing" or "Invalid token"
}
```