FROM python:3.11-slim

WORKDIR /app

COPY pyproject.toml .
RUN python -m pip install --no-cache-dir --upgrade pip
RUN python -m pip install --no-cache-dir .

COPY backend/ ./backend/
COPY scripts/ ./scripts/
COPY sample_target/ ./sample_target/

EXPOSE 8000
CMD ["uvicorn", "backend.sentinel.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
