from fastapi import APIRouter, UploadFile, HTTPException
import os
import uuid
from ..services.queue_manager import queue_manager
from ..services.status_manager import status_manager
from ..services.conversion import convert_to_pdf
from ..services.storage import upload_to_s3
from ..models.status import ConversionStatus

router = APIRouter()


@router.post("/convert")
async def convert_file(file: UploadFile):
    file_id = str(uuid.uuid4())
    pptx_path = f"temp/{file_id}.pptx"
    pdf_path = f"temp/{file_id}.pdf"

    try:
        if not file.filename.endswith('.pptx'):
            raise HTTPException(status_code=400, detail="Only .pptx files are allowed")

        os.makedirs('temp', exist_ok=True)

        # Initialize status with UPLOADING
        status_manager.create_status(file_id)

        content = await file.read()
        with open(pptx_path, "wb") as buffer:
            buffer.write(content)

        async def process_file():
            try:
                status_manager.update_status(
                    file_id,
                    status=ConversionStatus.CONVERTING,
                    progress=50
                )

                await convert_to_pdf(pptx_path, pdf_path)

                status_manager.update_status(
                    file_id,
                    status=ConversionStatus.UPLOADING,
                    progress=75
                )

                s3_object_name = f"conversions/{file_id}.pdf"
                s3_url = await upload_to_s3(pdf_path, s3_object_name)

                status_manager.update_status(
                    file_id,
                    status=ConversionStatus.COMPLETED,
                    progress=100,
                    url=s3_url
                )

            except Exception as e:
                status_manager.update_status(
                    file_id,
                    status=ConversionStatus.ERROR,
                    error=str(e)
                )
                raise e
            finally:
                # Clean up temporary files
                for path in [pptx_path, pdf_path]:
                    if os.path.exists(path):
                        os.remove(path)

        await queue_manager.add_task(file_id, process_file())

        return {"id": file_id, "status": ConversionStatus.UPLOADING}

    except Exception as e:
        # Clean up on error during file upload
        if pptx_path and os.path.exists(pptx_path):
            os.remove(pptx_path)

        # Update error status if we have a file_id
        if file_id and status_manager.get_status(file_id):
            status_manager.update_status(
                file_id,
                status=ConversionStatus.ERROR,
                error=str(e)
            )

        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status/{task_id}")
async def get_status(task_id: str):
    status = status_manager.get_status(task_id)
    if not status:
        raise HTTPException(404, "Task not found")
    return status