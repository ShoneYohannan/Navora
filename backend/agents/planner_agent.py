import os
import json
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from state import TravelState
from langchain_groq import ChatGroq
from prompts.planner_prompt import PLANNER_PROMPT
from dotenv import load_dotenv
from utils.helpers import safe_json_loads
from utils.config import Config

load_dotenv()

class AlternateOption(BaseModel):
    name: str = Field(description="Place or Activity Name")
    type: str = Field(description="indoor or outdoor")
    description: str = Field(description="Short reason why this is a good alternative")
    is_best_pick: bool = Field(description="Mark exactly one option as the best pick")
    website: Optional[str] = Field(None, description="Official website URL of the place, if present in the context")

class AlternateOptions(BaseModel):
    has_risk: bool = Field(description="True if there is a weather risk for that day, else False")
    reason: str = Field(description="Reason for alternate options (e.g. rain predicted or clear weather)")
    options: List[AlternateOption] = Field(description="List of 2-3 alternative options")

class Activity(BaseModel):
    name: str = Field(description="Activity description including time, e.g. '09:00 – Visit Fort Kochi'")
    estimated_cost: Optional[float] = Field(None, description="Estimated cost for this activity in the trip's currency. 0 for free activities.")

class ItineraryDay(BaseModel):
    day: int = Field(description="Day number (1, 2, 3, etc.)")
    date: str = Field(description="Date in YYYY-MM-DD format")
    theme: str = Field(description="Theme of the day")
    weather_forecast: str = Field(description="High: XX°C, Low: XX°C, Condition: XXX, Precipitation: XX%")
    safety_risk_assessment: str = Field(description="Assessment text based on risk guidelines")
    dynamic_adjustments: Optional[str] = Field(None, description="Risk Alert description if activity is impacted, else null")
    activities: List[Activity] = Field(description="List of activities planned for the day, each with a name and estimated_cost")
    alternate_options: AlternateOptions = Field(description="Alternate options for the day")

class ItinerarySchema(BaseModel):
    days: List[ItineraryDay]

class RiskSummaryRow(BaseModel):
    day: int
    date: str
    primary_risk: str = Field(description="None / Rain / Wind / UV / Temp")
    level: str = Field(description="Low / Moderate / High / Health / Extreme")
    backup_plan: str = Field(description="Specific indoor backup plan")

class BudgetBreakdown(BaseModel):
    accommodation: float
    transport: float
    food: float
    activities: float
    miscellaneous: float
    total_estimated: float

class PlannerOutput(BaseModel):
    itinerary: ItinerarySchema
    risk_summary_table: List[RiskSummaryRow]
    budget_breakdown: BudgetBreakdown
    packing_checklist: List[str]
    alternate_activities: List[str]

class PlannerAgent:
    def __init__(self):
        self.llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            api_key=Config.GROQ_API_KEY,
            temperature=0.3
        )

    def run(self, state: TravelState) -> Dict[str, Any]:
        print(f"--- Planning: {state['destination']} ---")
        
        # Format feedback context if we are running in a loop
        feedback_context = ""
        feedback = state.get("evaluator_feedback")
        if feedback:
            feedback_context = f"""
Token warning override: revised planner instructions.
Evaluator Feedback: {feedback}
Please revise the itinerary and budget breakdown to address these concerns specifically.
"""

        prompt = PLANNER_PROMPT.format(
            destination=state["destination"],
            days=state["days"],
            budget=state["budget"],
            currency=state.get("currency", "USD") or "USD",
            travelers=state["travelers"],
            interests=", ".join(state["interests"]),
            weather=json.dumps(state.get("weather_info", {})),
            attractions=json.dumps(state.get("nearby_attractions", [])),
            restaurants=json.dumps(state.get("restaurants", [])),
            malls=json.dumps(state.get("malls", [])),
            theatres=json.dumps(state.get("movie_theatres", [])),
            events=json.dumps(state.get("local_events", [])),
            movies=json.dumps(state.get("movie_recommendations", [])),
            feedback_context=feedback_context,
            start_date=state.get("start_date") or "",
            end_date=state.get("end_date") or "",
            start_time=state.get("start_time") or "08:00",
            end_time=state.get("end_time") or "20:00",
            breakfast_time=state.get("breakfast_time") or "07:30",
            lunch_time=state.get("lunch_time") or "13:00",
            dinner_time=state.get("dinner_time") or "19:30",
            travel_mode=state.get("travel_mode") or "mixed",
        )
        
        try:
            structured_llm = self.llm.with_structured_output(PlannerOutput)
            response = structured_llm.invoke(prompt)
            data = response.model_dump()
            
            return {
                "itinerary": data.get("itinerary"),
                "risk_summary_table": data.get("risk_summary_table", []),
                "budget_breakdown": data.get("budget_breakdown"),
                "packing_checklist": data.get("packing_checklist", []),
                "alternate_activities": data.get("alternate_activities", [])
            }
        except Exception as e:
            print(f"Planner error: {e}")
            return {
                "errors": [f"Planner failed: {str(e)}"],
                "itinerary": {"days": []},
                "risk_summary_table": [],
                "budget_breakdown": {},
                "packing_checklist": [],
                "alternate_activities": []
            }


        
