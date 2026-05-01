from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongodb_url: str
    groq_api_key: str
    waapi_token: str = ""
    waapi_instance_url: str = ""
    whatsapp_provider: str = "waapi"
    backend_port: int = 8000
    upload_dir: str = "./uploads"
    alert_phone_numbers: str = ""  # Comma-separated phone numbers
    cloudinary_cloud_name: str = ""  # Cloudinary credentials for image hosting
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
