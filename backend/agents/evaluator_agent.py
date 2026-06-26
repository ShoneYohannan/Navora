import os
import json
from typing import Dict, Any
from state import TravelState
from langchain_groq import ChatGroq
from prompts.evaluator_prompt import EVALUATOR_PROMPT
from dotenv import load_dotenv
from utils.helpers import safe_json_loads
from utils.config import Config

load_dotenv()

class EvaluatorAgent:
    def __init__(self):
        self.llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            api_key=Config.GROQ_API_KEY,
            temperature=0.2
        )

    def run(self, state: TravelState) -> Dict[str, Any]:
        print(f"--- Evaluating: {state['destination']} ---")
        
        plan_summary = {
            "itinerary": state.get("itinerary"),
            "budget_breakdown": state.get("budget_breakdown")
        }
        
        prompt = EVALUATOR_PROMPT.format(
            plan=json.dumps(plan_summary),
            destination=state["destination"],
            budget=state["budget"],
            currency=state.get("currency", "USD") or "USD",
            weather=json.dumps(state.get("weather_info", {}))
        )
        
        try:
            response = self.llm.invoke(prompt)
            content = response.content
            
            data = safe_json_loads(content, fallback={})
            
            # Combine feedback and corrections into one string for easier display/planner ingestion if needed
            feedback = data.get("evaluator_feedback", "")
            corrections = data.get("corrections", [])
            if corrections:
                feedback += "\nCorrections suggested:\n" + "\n".join(f"- {c}" for c in corrections)

            return {
                "safety_score": data.get("safety_score", 0.0),
                "travel_quality_score": data.get("travel_quality_score", 0.0),
                "evaluator_feedback": feedback
            }
        except Exception as e:
            print(f"Evaluator error: {e}")
            return {
                "safety_score": 0.0,
                "travel_quality_score": 0.0,
                "evaluator_feedback": "Evaluation failed."
            }

