from .config import settings

UNOSERVER_ENDPOINT = "/request"
UNOSERVER_BASE_URL = f"http://{settings.unoserver_host}:{settings.unoserver_port}" 