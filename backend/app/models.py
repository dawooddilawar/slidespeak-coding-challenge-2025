from enum import Enum
from pydantic import BaseModel
from typing import Optional

class ConversionStatus(str, Enum):
    UPLOADING = "uploading"
    CONVERTING = "converting"
    COMPLETED = "completed"
    ERROR = "error"

class ConversionStatusResponse(BaseModel):
    status: ConversionStatus
    progress: int
    url: Optional[str] = None
    error: Optional[str] = None

class ConversionResponse(BaseModel):
    id: str
    status: str