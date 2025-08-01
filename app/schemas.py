from typing import List, Any, Optional
from pydantic import BaseModel, Field, EmailStr


class BaseResponse(BaseModel):
    success: bool = Field(True, description="요청 성공 여부")
    description: Optional[str] = Field(None, description="응답 설명")
    data: List[Any] = Field(description="응답 데이터")


class ErrorResponse(BaseModel):
    detail: str = Field(..., description="에러 메시지")
    error_code: Optional[str] = Field(None, description="에러 코드")
    field: Optional[str] = Field(None, description="에러가 발생한 필드")


class UserCreate(BaseModel):
    name: str = Field(..., description="사용자 이름", min_length=1, max_length=255)
    email: EmailStr = Field(..., description="이메일 주소")
    password: str = Field(..., description="비밀번호", min_length=6)


class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="이메일 주소")
    password: str = Field(..., description="비밀번호")


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    time_created: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class AIValidationRequest(BaseModel):
    input_image_base64: str = Field(..., description="입력 이미지 Base64 데이터")
    filename: str = Field(..., description="파일명")


class AIValidationResponse(BaseModel):
    has_watermark: bool = Field(..., description="워터마크 존재 여부")
    detected_watermark_image_id: Optional[int] = Field(None, description="감지된 워터마크 이미지 ID")
    modification_rate: Optional[float] = Field(None, description="변조율 (0.0 ~ 1.0)")
    confidence_score: Optional[float] = Field(None, description="신뢰도 점수")
    visualization_image_base64: Optional[str] = Field(None, description="변조 시각화 이미지 (Base64)")


class ValidationResponse(BaseModel):
    validation_id: str
    has_watermark: bool
    detected_watermark_image_id: Optional[int]
    modification_rate: Optional[float]
    confidence_score: Optional[float]
    input_filename: str
    validation_time: Optional[str]
    input_image_base64: str
    visualization_image_base64: Optional[str]


class ImageUploadResponse(BaseModel):
    image_id: int
    filename: str
    copyright: str
    upload_time: str
    s3_paths: dict


class ValidationHistoryItem(BaseModel):
    validation_id: str
    input_filename: str
    has_watermark: bool
    detected_watermark_image_id: Optional[int]
    modification_rate: Optional[float]
    validation_time: str


class ValidationSummary(BaseModel):
    user_statistics: dict
    validation_history: List[ValidationHistoryItem]