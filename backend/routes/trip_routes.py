from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List, Dict, Any
from agents.travel_graph import TravelIntelligenceSystem
from models.trip_model import TripModel
from services.pdf_service import PDFService
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from bson import ObjectId
from fastapi.responses import Response

load_dotenv()

router = APIRouter()
system = TravelIntelligenceSystem()
pdf_service = PDFService()

# MongoDB setup
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.travelmind
trips_collection = db.trips

@router.post("/generate-trip")
async def generate_trip(request: Dict[str, Any]):
    try:
        destination = request.get("destination")
        duration = request.get("duration")
        budget = request.get("budget")
        travelers = request.get("travelers")
        interests = request.get("interests", [])
        
        if not destination or not duration:
            raise HTTPException(status_code=400, detail="Destination and duration are required")
            
        result = system.generate_trip(destination, duration, budget, travelers, interests)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/save-trip")
async def save_trip(trip_data: Dict[str, Any]):
    try:
        # Pydantic validation
        trip = TripModel(**trip_data)
        serialized_trip = trip.dict(by_alias=True, exclude={"id"})
        result = await trips_collection.insert_one(serialized_trip)
        return {"id": str(result.inserted_id), "status": "saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trip-history", response_model=List[TripModel])
async def get_trip_history():
    try:
        cursor = trips_collection.find().sort("created_at", -1)
        trips = []
        async for document in cursor:
            document["_id"] = str(document["_id"])
            trips.append(TripModel(**document))
        return trips
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trip/{trip_id}", response_model=TripModel)
async def get_trip(trip_id: str):
    try:
        document = await trips_collection.find_one({"_id": ObjectId(trip_id)})
        if not document:
            raise HTTPException(status_code=404, detail="Trip not found")
        document["_id"] = str(document["_id"])
        return TripModel(**document)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/trip/{trip_id}")
async def delete_trip(trip_id: str):
    try:
        result = await trips_collection.delete_one({"_id": ObjectId(trip_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Trip not found")
        return {"status": "deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/trip/{trip_id}/export-pdf")
async def export_pdf(trip_id: str):
    try:
        document = await trips_collection.find_one({"_id": ObjectId(trip_id)})
        if not document:
            raise HTTPException(status_code=404, detail="Trip not found")
        
        pdf_bytes = pdf_service.generate_itinerary_pdf(document)
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=itinerary_{trip_id}.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
