from typing import Dict, Optional
from ..models.status import ConversionStatus

class StatusManager:
    def __init__(self):
        self._status: Dict[str, dict] = {}

    def create_status(self, task_id: str) -> None:
        self._status[task_id] = {
            "status": ConversionStatus.UPLOADING,  # Start with UPLOADING instead of QUEUED
            "progress": 25,
            "url": None,
            "error": None
        }

    def update_status(self, task_id: str, **kwargs) -> None:
        if task_id in self._status:
            self._status[task_id].update(kwargs)

    def get_status(self, task_id: str) -> Optional[dict]:
        return self._status.get(task_id)

status_manager = StatusManager()