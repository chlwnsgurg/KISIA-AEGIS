import os
from typing import Optional

# .env 파일이 있으면 로드, 없으면 시스템 환경변수 사용
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # dotenv가 없어도 시스템 환경변수는 사용 가능
    pass


class Settings:
    # Database Settings
    DB_USER: str = os.getenv("DB_USER", "root")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD")
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: str = os.getenv("DB_PORT", "3306")
    DB_NAME: str = os.getenv("DB_NAME", "aegis")
    
    def __init__(self):
        # 디버깅용 환경변수 출력
        print(f"=== Environment Variables Debug ===")
        print(f"DB_HOST: {self.DB_HOST}")
        print(f"DB_USER: {self.DB_USER}")
        print(f"DB_PORT: {self.DB_PORT}")
        print(f"DB_NAME: {self.DB_NAME}")
        print(f"=====================================")
    
    @property
    def async_database_url(self) -> str:
        return f"mysql+asyncmy://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    @property
    def sync_database_url(self) -> str:
        return f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    # JWT Settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "120"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
    
    # AWS S3 Settings
    AWS_ACCESS_KEY_ID: Optional[str] = os.getenv("AWS_ACCESS_KEY_ID") 
    AWS_SECRET_ACCESS_KEY: Optional[str] = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_REGION_NAME: str = os.getenv("AWS_REGION_NAME", "ap-northeast-2")
    
    # S3 Bucket Settings
    BUCKET_NAME: str = os.getenv("BUCKET_NAME")
    IMAGEDIR: str = os.getenv("IMAGEDIR", "image")
    RECORDDIR: str = os.getenv("RECORDDIR", "record")

    
    # File Upload Settings
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_FILE_TYPES: list = [".png"]
    ALLOWED_CONTENT_TYPES: list = ["image/png"]
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    @property
    def s3_url(self) -> str:
        """AWS S3 버킷 URL"""
        if not self.BUCKET_NAME or not self.AWS_REGION_NAME:
            raise ValueError("BUCKET_NAME과 AWS_REGION_NAME이 설정되어야 합니다")
        return f"https://{self.BUCKET_NAME}.s3.{self.AWS_REGION_NAME}.amazonaws.com"
    
    @property 
    def s3_image_dir(self) -> str:
        return f"{self.s3_url}/{self.IMAGEDIR}"
    
    @property
    def s3_record_dir(self) -> str:
        return f"{self.s3_url}/{self.RECORDDIR}"


settings = Settings()

# Legacy exports for backward compatibility
DB_USER = settings.DB_USER
DB_PASSWORD = settings.DB_PASSWORD  
DB_HOST = settings.DB_HOST
DB_PORT = settings.DB_PORT
DB_NAME = settings.DB_NAME
ASYNC_DATABASE_URL = settings.async_database_url
SYNC_DATABASE_URL = settings.sync_database_url 