from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime



from pydantic import BaseModel


class TripRequest(BaseModel):
    destination: str
    budget: int
    days: int
    interests: List[str]


class TripModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    destination: str
    duration: int
    budget: float
    travelers: int
    interests: List[str]
    weather_info: Optional[Dict[str, Any]]
    nearby_attractions: List[Dict[str, Any]]
    malls: List[Dict[str, Any]]
    restaurants: List[Dict[str, Any]]
    movie_recommendations: List[Dict[str, Any]]
    itinerary: Dict[str, Any]
    budget_breakdown: Dict[str, Any]
    packing_checklist: List[str]
    alternate_activities: List[str]
    safety_score: float
    travel_quality_score: float
    evaluator_feedback: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}
