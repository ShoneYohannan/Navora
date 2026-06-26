from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime



from pydantic import BaseModel


class TripRequest(BaseModel):
    destination: str
    budget: int
    days: int
    interests: List[str]
    currency: Optional[str] = "USD"
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    start_time: Optional[str] = "08:00"   # HH:MM – when the day's activities begin
    end_time: Optional[str] = "20:00"     # HH:MM – when the day's activities end
    breakfast_time: Optional[str] = "07:00"
    lunch_time: Optional[str] = "12:00"
    dinner_time: Optional[str] = "19:00"
    travel_mode: Optional[str] = "mixed"  # walking, car, public_transport, bicycle, train, flight, motorcycle, mixed
    travelers: Optional[int] = 1


class TripModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    destination: str
    days: int
    budget: float
    currency: Optional[str] = "USD"
    travelers: Optional[int] = 1
    interests: List[str]
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    start_time: Optional[str] = "08:00"
    end_time: Optional[str] = "20:00"
    breakfast_time: Optional[str] = "07:00"
    lunch_time: Optional[str] = "12:00"
    dinner_time: Optional[str] = "19:00"
    travel_mode: Optional[str] = "mixed"
    weather_info: Optional[Dict[str, Any]] = None
    nearby_attractions: List[Dict[str, Any]] = []
    malls: List[Dict[str, Any]] = []
    restaurants: List[Dict[str, Any]] = []
    movie_theatres: List[Dict[str, Any]] = []
    local_events: List[Dict[str, Any]] = []
    movie_recommendations: List[Dict[str, Any]] = []

    itinerary: Optional[Dict[str, Any]] = None
    risk_summary_table: Optional[List[Dict[str, Any]]] = []
    budget_breakdown: Optional[Dict[str, Any]] = None
    packing_checklist: List[str] = []
    alternate_activities: List[str] = []
    safety_score: float = 0.0
    travel_quality_score: float = 0.0
    evaluator_feedback: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        extra = "ignore"  # Ignore extra LangGraph state fields (messages, errors, loop_count, etc.)
        json_encoders = {datetime: lambda v: v.isoformat()}
