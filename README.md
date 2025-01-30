# SlideSpeak - PowerPoint to PDF Converter

A web application that allows users to convert PowerPoint (.pptx) files to PDF format easily and efficiently.

## Prerequisites

- Docker and Docker Compose
- AWS Account with:
  - Access Key ID
  - Secret Access Key
  - S3 Bucket created
  - Appropriate S3 permissions

## Quick Start

1. Clone the repository:
```bash
git clone [<repository-url>](https://github.com/dawooddilawar/slidespeak-coding-challenge-2025.git)
cd slidespeak-challenge
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Copy and rename `.env.example` to `.env` and update the file with your AWS credentials:

```env
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=your_aws_region
S3_BUCKET=your_s3_bucket_name
UNOSERVER_PORT=2002
UNOSERVER_HOST=slidespeak-unoserver
```

4. Start the application:
Make sure that you have Docker and Docker Compose installed, and that you are in the root directory of the project.
Run the following command to build and start the application:
```bash
docker compose up --build
```

## Accessing the Application

- Frontend: http://localhost:3000
- Backend API & Documentation: http://localhost:8000/docs

## API Endpoints

The main endpoints are:

- `POST /api/convert` - Upload and convert PPTX file
- `GET /api/status/{task_id}` - Check conversion status

For detailed API documentation and testing, visit http://localhost:8000/docs after starting the application.

## Stopping the Application

To stop the application and remove containers:
```bash
docker compose down
```
