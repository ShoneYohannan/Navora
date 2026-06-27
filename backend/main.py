import os
import sys

os.environ.setdefault("PYTHONUTF8", "1")

try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import trip_routes
import uvicorn
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Navora AI API",
    description="Multi-Agent Travel Intelligence System"
)

# CORS setup
origins = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "https://sales-loss-new.web.app",
    "https://sales-loss-new.firebaseapp.com",
]

env_origins = os.getenv("ALLOWED_ORIGINS")
if env_origins:
    origins.extend([o.strip() for o in env_origins.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(set(origins)),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(trip_routes.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to Navora AI API", "status": "running"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)