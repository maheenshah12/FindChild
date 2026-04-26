from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongodb_url: str
    groq_api_key: str
    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_whatsapp_number: str = ""
    backend_port: int = 8000
    upload_dir: str = "./uploads"
    alert_phone_numbers: str = ""  # Comma-separated phone numbers

    class Config:
        env_file = ".env"

settings = Settings()
