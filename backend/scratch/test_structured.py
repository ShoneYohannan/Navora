import sys
import os
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from langchain_groq import ChatGroq
from utils.config import Config

# Define schemas
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


def test():
    print("Initializing ChatGroq...")
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=Config.GROQ_API_KEY,
        temperature=0.3
    )
    
    print("Binding structured output...")
    structured_llm = llm.with_structured_output(PlannerOutput)
    
    print("Invoking model...")
    # Just a simple prompt to see if it generates structured output successfully
    prompt = "Create a 1-day itinerary for Kochi on 2026-06-26. Weather: heavy rain, temp 26.7C, precipitation 80%."
    try:
        res = structured_llm.invoke(prompt)
        print("Success! Result type:", type(res))
        print("Result dict representation:")
        print(res.model_dump())
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test()
