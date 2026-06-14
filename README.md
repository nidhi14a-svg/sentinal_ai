# Sentinel AI

Sentinel AI is a full-stack AI security command center composed of three local services:

- `sentinal_ai` - unified backend for scanner, remediation, reporting, and related APIs.
- `orchestrator` - FastAPI middle layer that routes frontend requests to teammate backends with mock fallback data.
- `sentinel-ai-dashboard` - React, Vite, and Tailwind dashboard UI.

## Run Locally

Start each service in its own PowerShell terminal.

### 1. Unified Backend - Port 8001

```powershell
cd d:\Sentinal-AI\sentinal_ai
.\venv\Scripts\python.exe -m uvicorn backend.sentinel.api.main:app --host 0.0.0.0 --port 8001 --reload
```

Wait for `Application startup complete.`

### 2. Orchestrator - Port 8002

```powershell
cd d:\Sentinal-AI\orchestrator
.\venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8002 --reload
```

Wait for `Application startup complete.`

### 3. Frontend - Port 5173

```powershell
cd d:\Sentinal-AI\sentinel-ai-dashboard
npm run dev
```

Open `http://localhost:5173`.

## Service Map

| Order | Service | Port |
| --- | --- | --- |
| 1 | Unified Backend | 8001 |
| 2 | Orchestrator | 8002 |
| 3 | Frontend | 5173 |

## Notes

- Copy `orchestrator/.env.example` to `orchestrator/.env` for local configuration.
- Person B's AI backend can be connected later; the orchestrator currently supports mock fallback data when upstream services are offline.
