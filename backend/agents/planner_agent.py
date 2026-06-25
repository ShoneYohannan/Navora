import os
import json
from typing import Dict, Any
from state import TravelState
from langchain_groq import ChatGroq
from prompts.planner_prompt import PLANNER_PROMPT
from dotenv import load_dotenv
from utils.helpers import safe_json_loads
from utils.config import Config

load_dotenv()

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
=========================================
WARNING: PREVIOUS EVALUATION FAILED OR REQUIRES CORRECTIONS
Evaluator Feedback: {feedback}
Please revise the itinerary and budget breakdown to address these concerns specifically.
=========================================
"""

        prompt = PLANNER_PROMPT.format(
            destination=state["destination"],
            days=state["days"],
            budget=state["budget"],
            travelers=state["travelers"],
            interests=", ".join(state["interests"]),
            weather=json.dumps(state.get("weather_info", {})),
            attractions=json.dumps(state.get("nearby_attractions", [])),
            restaurants=json.dumps(state.get("restaurants", [])),
            malls=json.dumps(state.get("malls", [])),
            theatres=json.dumps(state.get("movie_theatres", [])),
            events=json.dumps(state.get("local_events", [])),
            movies=json.dumps(state.get("movie_recommendations", [])),
            feedback_context=feedback_context
        )
        
        try:
            response = self.llm.invoke(prompt)
            content = response.content
            
            data = safe_json_loads(content, fallback={})
            
            return {
                "itinerary": data.get("itinerary"),
                "budget_breakdown": data.get("budget_breakdown"),
                "packing_checklist": data.get("packing_checklist", []),
                "alternate_activities": data.get("alternate_activities", [])
            }
        except Exception as e:
            print(f"Planner error: {e}")
            return {
                "errors": [f"Planner failed: {str(e)}"],
                "itinerary": {"days": []},
                "budget_breakdown": {},
                "packing_checklist": [],
                "alternate_activities": []
            }

        
