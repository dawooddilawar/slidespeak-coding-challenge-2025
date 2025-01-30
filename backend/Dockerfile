
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /app/temp && chmod 777 /app/temp

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD nc -zv unoserver 2002

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]