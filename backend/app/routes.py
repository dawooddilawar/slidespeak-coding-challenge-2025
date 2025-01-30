# app/routes.py
from fastapi import APIRouter, UploadFile, HTTPException
from typing import Dict
import os
import uuid
from .models import ConversionStatus, ConversionStatusResponse, ConversionResponse
from .services.conversion import convert_to_pdf
from .services.storage import upload_to_s3

router = APIRouter()

conversion_status: Dict[str, dict] = {}


@router.post("/convert", response_model=ConversionResponse)
async def convert_file(file: UploadFile):
    file_id = None
    pptx_path = None
    pdf_path = None

    try:
        if not file.filename.endswith('.pptx'):
            raise HTTPException(status_code=400, detail="Only .pptx files are allowed")

        os.makedirs('temp', exist_ok=True)

        file_id = str(uuid.uuid4())
        pptx_path = f"temp/{file_id}.pptx"
        pdf_path = f"temp/{file_id}.pdf"

        conversion_status[file_id] = {
            "status": ConversionStatus.UPLOADING,
            "progress": 25,
            "url": None,
            "error": None
        }

        with open(pptx_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        conversion_status[file_id].update({
            "status": ConversionStatus.CONVERTING,
            "progress": 50
        })

        await convert_to_pdf(pptx_path, pdf_path)

        conversion_status[file_id].update({
            "status": ConversionStatus.UPLOADING,
            "progress": 75
        })

        s3_object_name = f"conversions/{file_id}.pdf"
        s3_url = await upload_to_s3(pdf_path, s3_object_name)

        conversion_status[file_id].update({
            "status": ConversionStatus.COMPLETED,
            "progress": 100,
            "url": s3_url
        })

        os.remove(pptx_path)
        os.remove(pdf_path)

        return {"id": file_id, "status": "processing"}

    except Exception as e:
        print(f"Error during conversion process: {str(e)}")
        if pptx_path and os.path.exists(pptx_path):
            os.remove(pptx_path)
        if pdf_path and os.path.exists(pdf_path):
            os.remove(pdf_path)

        if file_id and file_id in conversion_status:
            conversion_status[file_id].update({
                "status": ConversionStatus.ERROR,
                "error": str(e)
            })
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status/{task_id}", response_model=ConversionStatusResponse)
async def get_status(task_id: str):
    if task_id not in conversion_status:
        raise HTTPException(404, "Task not found")

    return conversion_status[task_id]