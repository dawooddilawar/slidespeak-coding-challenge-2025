import os
import asyncio
import aiofiles
import aioboto3
from .config import settings
import httpx
from .constants import UNOSERVER_ENDPOINT, UNOSERVER_BASE_URL

class ConversionStatus:
    UPLOADING = "uploading"
    CONVERTING = "converting"
    COMPLETED = "completed"
    ERROR = "error"


async def validate_file_paths(input_path: str, output_path: str) -> None:
    """Validate input and output file paths."""
    if not os.path.exists(input_path):
        raise Exception(f"Input file not found: {input_path}")

    output_dir = os.path.dirname(output_path)
    if not os.path.exists(output_dir):
        raise Exception(f"Output directory does not exist: {output_dir}")


async def make_unoserver_request(client: httpx.AsyncClient, input_path: str) -> bytes:
    """Make the actual conversion request to unoserver."""
    files = {
        'file': (
            os.path.basename(input_path),
            open(input_path, 'rb'),
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        )
    }
    data = {'convert-to': 'pdf'}
    url = f"{UNOSERVER_BASE_URL}{UNOSERVER_ENDPOINT}"

    response = await client.post(url, files=files, data=data)

    if response.status_code != 200:
        raise Exception(f"Conversion failed (HTTP {response.status_code}): {response.text}")

    return response.content


async def save_converted_file(content: bytes, output_path: str) -> None:
    """Save the converted content to the output path."""
    with open(output_path, 'wb') as f:
        f.write(content)

    if not os.path.exists(output_path):
        raise Exception(f"Output PDF file was not created at {output_path}")


async def convert_to_pdf(input_path: str, output_path: str) -> None:
    """Convert PowerPoint to PDF using unoserver REST API."""
    max_retries = 3
    retry_delay = 2

    for attempt in range(max_retries):
        try:
            await validate_file_paths(input_path, output_path)

            async with httpx.AsyncClient() as client:
                content = await make_unoserver_request(client, input_path)
                await save_converted_file(content, output_path)
            return

        except Exception as e:
            if attempt < max_retries - 1:
                print(f"Error in convert_to_pdf: {str(e)}, retrying in {retry_delay} seconds...")
                await asyncio.sleep(retry_delay)
                continue
            print(f"Error in convert_to_pdf after all retries: {str(e)}")
            raise Exception(f"Error converting file: {str(e)}")


async def upload_to_s3(file_path: str, object_name: str) -> str:
    """Upload file to S3 and return a pre-signed URL."""
    session = aioboto3.Session()

    async with session.client(
        's3',
        aws_access_key_id=settings.aws_access_key_id,
        aws_secret_access_key=settings.aws_secret_access_key,
        region_name=settings.aws_region
    ) as s3_client:
        try:
            async with aiofiles.open(file_path, 'rb') as file:
                file_content = await file.read()

            await s3_client.put_object(
                Bucket=settings.s3_bucket,
                Key=object_name,
                Body=file_content,
                ContentType='application/pdf'
            )

            url = await s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': settings.s3_bucket,
                    'Key': object_name,
                    'ResponseContentDisposition': f'attachment; filename="{os.path.basename(file_path)}"'
                },
                ExpiresIn=3600
            )

            return url

        except Exception as e:
            raise Exception(f"Error uploading to S3: {str(e)}")