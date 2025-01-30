from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    unoserver_host: str
    unoserver_port: int
    aws_access_key_id: str
    aws_secret_access_key: str
    aws_region: str
    s3_bucket: str
    temp_dir: str = "/app/temp"

    class Config:
        env_file = ".env"

settings = Settings()