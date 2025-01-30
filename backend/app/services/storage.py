import aioboto3
import aiofiles
from ..core.config import settings
import os

async def upload_to_s3(file_path: str, object_name: str) -> str:
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