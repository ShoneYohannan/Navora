from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from agents.travel_graph import TravelIntelligenceSystem
from models.trip_model import TripModel, TripRequest
from services.pdf_service import PDFService
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import uuid
from dotenv import load_dotenv
from bson import ObjectId
from fastapi.responses import Response
from datetime import datetime, timedelta

load_dotenv()

router = APIRouter()
system = TravelIntelligenceSystem()
pdf_service = PDFService()

# MongoDB setup
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=2000)
db = client.travelmind
trips_collection = db.trips

IN_MEMORY_TRIPS: Dict[str, Any] = {}

# File persistence fallback for trips when MongoDB is offline or unauthenticated
FALLBACK_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "trips_fallback.json")

def _load_fallback_store():
    global IN_MEMORY_TRIPS
    try:
        if os.path.exists(FALLBACK_FILE):
            with open(FALLBACK_FILE, "r", encoding="utf-8") as f:
                IN_MEMORY_TRIPS = json.load(f)
    except Exception as e:
        print(f"Error loading fallback trip store: {e}")

def _save_fallback_store():
    try:
        os.makedirs(os.path.dirname(FALLBACK_FILE), exist_ok=True)
        serializable_store = {}
        for tid, doc in IN_MEMORY_TRIPS.items():
            doc_copy = doc.copy()
            if "created_at" in doc_copy and isinstance(doc_copy["created_at"], datetime):
                doc_copy["created_at"] = doc_copy["created_at"].isoformat()
            serializable_store[tid] = doc_copy
        with open(FALLBACK_FILE, "w", encoding="utf-8") as f:
            json.dump(serializable_store, f, default=str, indent=2)
    except Exception as e:
        print(f"Error saving fallback trip store: {e}")

# Load fallback trips into memory on startup
_load_fallback_store()


@router.post("/generate-trip")
async def generate_trip(request: TripRequest):
    try:
        destination = request.destination
        days = request.days
        budget = request.budget
        travelers = getattr(request, "travelers", 1) or 1
        interests = request.interests or []
        currency = getattr(request, "currency", "USD") or "USD"
        
        # Date parsing & defaulting
        start_date = request.start_date
        if not start_date:
            start_date = datetime.now().strftime("%Y-%m-%d")
            
        end_date = request.end_date
        if not end_date:
            try:
                start_dt = datetime.strptime(start_date, "%Y-%m-%d")
                end_dt = start_dt + timedelta(days=max(0, days - 1))
                end_date = end_dt.strftime("%Y-%m-%d")
            except Exception:
                end_date = start_date

        # Timing & travel mode preferences
        start_time = getattr(request, "start_time", "08:00") or "08:00"
        end_time = getattr(request, "end_time", "20:00") or "20:00"
        breakfast_time = getattr(request, "breakfast_time", "07:00") or "07:00"
        lunch_time = getattr(request, "lunch_time", "12:00") or "12:00"
        dinner_time = getattr(request, "dinner_time", "19:00") or "19:00"
        travel_mode = getattr(request, "travel_mode", "mixed") or "mixed"

        if not destination or not days:
            raise HTTPException(
                status_code=400,
                detail="Destination and days are required"
            )

        result = system.generate_trip(
            destination=destination,
            days=days,
            budget=budget,
            travelers=travelers,
            interests=interests,
            currency=currency,
            start_date=start_date,
            end_date=end_date,
            start_time=start_time,
            end_time=end_time,
            breakfast_time=breakfast_time,
            lunch_time=lunch_time,
            dinner_time=dinner_time,
            travel_mode=travel_mode,
        )

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/save-trip")
async def save_trip(trip_data: Dict[str, Any]):
    try:
        trip = TripModel(**trip_data)
        serialized_trip = trip.dict(by_alias=True, exclude={"id"})
        
        try:
            result = await trips_collection.insert_one(serialized_trip)
            inserted_id = str(result.inserted_id)
            serialized_trip["_id"] = inserted_id
            IN_MEMORY_TRIPS[inserted_id] = serialized_trip
            _save_fallback_store()
            return {"id": inserted_id, "status": "saved"}
        except Exception as db_err:
            print(f"MongoDB save failed, falling back to in-memory: {db_err}")
            temp_id = str(uuid.uuid4())
            serialized_trip["_id"] = temp_id
            IN_MEMORY_TRIPS[temp_id] = serialized_trip
            _save_fallback_store()
            return {"id": temp_id, "status": "saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/trip-history", response_model=List[TripModel])
async def get_trip_history():
    try:
        trips = []
        try:
            cursor = trips_collection.find().sort("created_at", -1)
            async for document in cursor:
                document["_id"] = str(document["_id"])
                trips.append(TripModel(**document))
            if trips:
                return trips
        except Exception as db_err:
            print(f"MongoDB fetch history failed, using in-memory: {db_err}")

        in_memory_list = list(IN_MEMORY_TRIPS.values())
        in_memory_list.sort(key=lambda x: str(x.get("created_at", "")), reverse=True)
        for doc in in_memory_list:
            doc_copy = doc.copy()
            doc_copy["_id"] = str(doc_copy.get("_id", ""))
            trips.append(TripModel(**doc_copy))
        return trips
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/trip/{trip_id}", response_model=TripModel)
async def get_trip(trip_id: str):
    try:
        # 1. Try MongoDB by ObjectId (if 24-character hex string)
        try:
            if len(trip_id) == 24 and all(c in "0123456789abcdefABCDEF" for c in trip_id):
                document = await trips_collection.find_one({"_id": ObjectId(trip_id)})
                if document:
                    document["_id"] = str(document["_id"])
                    return TripModel(**document)
        except Exception as db_err:
            print(f"MongoDB fetch by ObjectId failed: {db_err}")

        # 2. Try MongoDB by string _id
        try:
            document = await trips_collection.find_one({"_id": trip_id})
            if document:
                document["_id"] = str(document["_id"])
                return TripModel(**document)
        except Exception as db_err:
            print(f"MongoDB fetch by string _id failed: {db_err}")

        # 3. Check in-memory / disk fallback store
        if trip_id in IN_MEMORY_TRIPS:
            doc = IN_MEMORY_TRIPS[trip_id].copy()
            doc["_id"] = str(doc.get("_id", trip_id))
            return TripModel(**doc)

        raise HTTPException(status_code=404, detail=f"Trip with ID {trip_id} not found")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/trip/{trip_id}")
async def delete_trip(trip_id: str):
    try:
        deleted = False
        try:
            if len(trip_id) == 24 and all(c in "0123456789abcdefABCDEF" for c in trip_id):
                result = await trips_collection.delete_one({"_id": ObjectId(trip_id)})
                if result.deleted_count > 0:
                    deleted = True
        except Exception as db_err:
            print(f"MongoDB delete trip failed: {db_err}")

        if not deleted:
            try:
                result = await trips_collection.delete_one({"_id": trip_id})
                if result.deleted_count > 0:
                    deleted = True
            except Exception:
                pass

        if trip_id in IN_MEMORY_TRIPS:
            del IN_MEMORY_TRIPS[trip_id]
            _save_fallback_store()
            deleted = True

        if not deleted:
            raise HTTPException(status_code=404, detail="Trip not found")

        return {"status": "deleted"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/trip/{trip_id}/export-pdf")
async def export_pdf(trip_id: str):
    try:
        document = None
        try:
            if len(trip_id) == 24 and all(c in "0123456789abcdefABCDEF" for c in trip_id):
                document = await trips_collection.find_one({"_id": ObjectId(trip_id)})
        except Exception as db_err:
            print(f"MongoDB find for PDF failed: {db_err}")

        if not document:
            try:
                document = await trips_collection.find_one({"_id": trip_id})
            except Exception:
                pass

        if not document and trip_id in IN_MEMORY_TRIPS:
            document = IN_MEMORY_TRIPS[trip_id]

        if not document:
            raise HTTPException(status_code=404, detail="Trip not found")

        pdf_bytes = pdf_service.generate_itinerary_pdf(document)

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=itinerary_{trip_id}.pdf"
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))