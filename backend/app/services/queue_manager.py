import asyncio
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)

class ConversionQueueManager:
    def __init__(self, max_concurrent: int = 3):
        self.queue = asyncio.Queue()
        self.active_tasks: Dict[str, asyncio.Task] = {}
        self.max_concurrent = max_concurrent
        self.processing_task: Optional[asyncio.Task] = None

    async def start(self):
        self.processing_task = asyncio.create_task(self._process_queue())

    async def stop(self):
        if self.processing_task:
            self.processing_task.cancel()
            try:
                await self.processing_task
            except asyncio.CancelledError:
                pass

    async def add_task(self, task_id: str, coroutine):
        await self.queue.put((task_id, coroutine))
        logger.info(f"Added task {task_id} to queue. Queue size: {self.queue.qsize()}")

    async def _process_queue(self):
        while True:
            # Remove completed tasks
            self.active_tasks = {
                task_id: task
                for task_id, task in self.active_tasks.items()
                if not task.done()
            }

            # Process new tasks if under max_concurrent
            if len(self.active_tasks) < self.max_concurrent:
                try:
                    task_id, coroutine = await self.queue.get()
                    task = asyncio.create_task(coroutine)
                    self.active_tasks[task_id] = task
                    logger.info(f"Started processing task {task_id}")
                except asyncio.CancelledError:
                    break

            await asyncio.sleep(0.1)

queue_manager = ConversionQueueManager(max_concurrent=3)
