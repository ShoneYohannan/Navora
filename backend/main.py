from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import trip_routes
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="TravelMind AI API", description="Multi-Agent Travel Intelligence System")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(trip_routes.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to TravelMind AI API", "status": "running"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
