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
    visualization_image_base64: Optional[str] = Field(None, description="변조 시각화 이미지 (Base64)")


class ValidationResponse(BaseModel):
    validation_id: str
    has_watermark: bool
    detected_watermark_image_id: Optional[int]
    modification_rate: Optional[float]
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


class UserReportRequest(BaseModel):
    validation_uuid: str = Field(..., description="검증 레코드 UUID", min_length=36, max_length=36)
    report_link: Optional[str] = Field(None, description="위변조 이미지 습득 링크", max_length=2000)
    report_text: Optional[str] = Field(None, description="위변조 관련 상세 설명", max_length=10000)

    class Config:
        json_schema_extra = {
            "example": {
                "validation_uuid": "123e4567-e89b-12d3-a456-426614174000",
                "report_link": "https://example.com/image-source",
                "report_text": "이 이미지는 SNS에서 발견되었으며, 원본과 비교했을 때 명백한 변조 흔적이 있습니다."
            }
        }


class UserReportResponse(BaseModel):
    validation_uuid: str
    report_link: Optional[str]
    report_text: Optional[str]
    updated_time: str