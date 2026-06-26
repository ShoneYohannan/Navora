import sys
import os
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.research_agent import ResearchAgent
from langchain_groq import ChatGroq
from utils.config import Config
from state import TravelState
from prompts.planner_prompt import PLANNER_PROMPT
from prompts.evaluator_prompt import EVALUATOR_PROMPT

class AlternateOption(BaseModel):
    name: str = Field(description="Place or Activity Name")
    type: str = Field(description="indoor or outdoor")
    description: str = Field(description="Short reason why this is a good alternative")
    is_best_pick: bool = Field(description="Mark exactly one option as the best pick")

class AlternateOptions(BaseModel):
    has_risk: bool = Field(description="True if there is a weather risk for that day, else False")
    reason: str = Field(description="Reason for alternate options (e.g. rain predicted or clear weather)")
    options: List[AlternateOption] = Field(description="List of 2-3 alternative options")

class ItineraryDay(BaseModel):
    day: int = Field(description="Day number (1, 2, 3, etc.)")
    date: str = Field(description="Date in YYYY-MM-DD format")
    theme: str = Field(description="Theme of the day")
    weather_forecast: str = Field(description="High: XX°C, Low: XX°C, Condition: XXX, Precipitation: XX%")
    safety_risk_assessment: str = Field(description="Assessment text based on risk guidelines")
    dynamic_adjustments: Optional[str] = Field(None, description="Risk Alert description if activity is impacted, else null")
    activities: List[str] = Field(description="List of activities planned for the day")
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

class EvaluatorOutput(BaseModel):
    safety_score: float = Field(description="Safety score from 0.0 to 100.0")
    travel_quality_score: float = Field(description="Travel quality score from 0.0 to 100.0")
    evaluator_feedback: str = Field(description="Detailed feedback if safety or quality is low, or approval message")
    corrections: List[str] = Field(default=[], description="List of specific corrections needed if any")


def test():
    print("Doing Research...")
    research_agent = ResearchAgent()
    state = {
        "destination": "kochi",
        "days": 3,
        "budget": 1500,
        "travelers": 1,
        "interests": ["Culture"],
        "currency": "USD",
        "start_date": "2026-06-26",
        "end_date": "2026-06-28",
        "messages": [],
        "errors": [],
        "weather_info": None,
        "nearby_attractions": [],
        "malls": [],
        "restaurants": [],
        "movie_theatres": [],
        "local_events": [],
        "movie_recommendations": [],
        "itinerary": None,
        "budget_breakdown": None,
        "packing_checklist": [],
        "alternate_activities": [],
        "safety_score": 0.0,
        "travel_quality_score": 0.0,
        "evaluator_feedback": "",
        "loop_count": 0
    }
    
    research_result = research_agent.run(state)
    state.update(research_result)
    
    print("Running Planner with structured output...")
    llm_planner = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=Config.GROQ_API_KEY,
        temperature=0.3
    ).with_structured_output(PlannerOutput)
    
    import json
    prompt_planner = PLANNER_PROMPT.format(
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
        feedback_context="",
        start_date=state.get("start_date") or "",
        end_date=state.get("end_date") or ""
    )
    
    planner_res = llm_planner.invoke(prompt_planner)
    print("Planner res:", planner_res.model_dump())
    
    # Update state
    state.update(planner_res.model_dump())
    
    print("Running Evaluator with structured output...")
    llm_evaluator = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=Config.GROQ_API_KEY,
        temperature=0.2
    ).with_structured_output(EvaluatorOutput)
    
    plan_summary = {
        "itinerary": state.get("itinerary"),
        "budget_breakdown": state.get("budget_breakdown")
    }
    
    prompt_evaluator = EVALUATOR_PROMPT.format(
        plan=json.dumps(plan_summary),
        destination=state["destination"],
        budget=state["budget"],
        currency=state.get("currency", "USD") or "USD",
        weather=json.dumps(state.get("weather_info", {}))
    )
    
    evaluator_res = llm_evaluator.invoke(prompt_evaluator)
    print("Evaluator res:", evaluator_res.model_dump())

if __name__ == "__main__":
    test()
