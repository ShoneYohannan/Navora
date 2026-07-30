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

# CORS setup — permissive for local development
# For production, restrict allow_origins to your deployed frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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