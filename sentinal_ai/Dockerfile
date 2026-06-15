FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    shared-mime-info \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml .
RUN python -m pip install --no-cache-dir --upgrade pip
RUN python -m pip install --no-cache-dir .

COPY backend/ ./backend/
COPY scripts/ ./scripts/
COPY sample_target/ ./sample_target/

EXPOSE 8000
CMD ["uvicorn", "backend.sentinel.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
