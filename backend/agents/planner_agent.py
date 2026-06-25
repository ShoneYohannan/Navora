import os
import json
from typing import Dict, Any
from state import TravelState
from langchain_groq import ChatGroq
from prompts.planner_prompt import PLANNER_PROMPT
from dotenv import load_dotenv

load_dotenv()

class PlannerAgent:
    def __init__(self):
        self.llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            api_key=os.getenv("GROQ_API_KEY"),
            temperature=0.3
        )

    def run(self, state: TravelState) -> Dict[str, Any]:
        print(f"--- Planning: {state['destination']} ---")
        
        prompt = PLANNER_PROMPT.format(
            destination=state["destination"],
            duration=state["duration"],
            budget=state["budget"],
            travelers=state["travelers"],
            interests=", ".join(state["interests"]),
            weather=json.dumps(state["weather_info"]),
            attractions=json.dumps(state["nearby_attractions"]),
            restaurants=json.dumps(state["restaurants"]),
            malls=json.dumps(state["malls"]),
            movies=json.dumps(state["movie_recommendations"])
        )
        
        try:
            response = self.llm.invoke(prompt)
            content = response.content
            
            # Clean JSON if it contains markdown markers
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
                
            data = json.loads(content)
            
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
        
