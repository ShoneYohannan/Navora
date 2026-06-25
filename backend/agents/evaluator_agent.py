import os
import json
from typing import Dict, Any
from state import TravelState
from langchain_groq import ChatGroq
from prompts.evaluator_prompt import EVALUATOR_PROMPT
from dotenv import load_dotenv

load_dotenv()

class EvaluatorAgent:
    def __init__(self):
        self.llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            api_key=os.getenv("GROQ_API_KEY"),
            temperature=0.2
        )

    def run(self, state: TravelState) -> Dict[str, Any]:
        print(f"--- Evaluating: {state['destination']} ---")
        
        plan_summary = {
            "itinerary": state["itinerary"],
            "budget_breakdown": state["budget_breakdown"]
        }
        
        prompt = EVALUATOR_PROMPT.format(
            plan=json.dumps(plan_summary),
            destination=state["destination"],
            budget=state["budget"],
            weather=json.dumps(state["weather_info"])
        )
        
        try:
            response = self.llm.invoke(prompt)
            content = response.content
            
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
                
            data = json.loads(content)
            
            return {
                "safety_score": data.get("safety_score", 0.0),
                "travel_quality_score": data.get("travel_quality_score", 0.0),
                "evaluator_feedback": data.get("evaluator_feedback", "")
            }
        except Exception as e:
            print(f"Evaluator error: {e}")
            return {
                "safety_score": 0.0,
                "travel_quality_score": 0.0,
                "evaluator_feedback": "Evaluation failed."
            }
