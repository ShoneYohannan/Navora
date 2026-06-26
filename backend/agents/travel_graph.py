from langgraph.graph import StateGraph, START, END
from state import TravelState
from agents.research_agent import ResearchAgent
from agents.planner_agent import PlannerAgent
from agents.evaluator_agent import EvaluatorAgent

def create_travel_graph():
    # Initialize agents
    research_agent = ResearchAgent()
    planner_agent = PlannerAgent()
    evaluator_agent = EvaluatorAgent()

    # Define nodes
    def research_node(state: TravelState):
        result = research_agent.run(state)
        return result

    def planner_node(state: TravelState):
        current_loops = state.get("loop_count", 0)
        result = planner_agent.run(state)
        result["loop_count"] = current_loops + 1
        return result

    def evaluator_node(state: TravelState):
        result = evaluator_agent.run(state)
        return result

    def route_after_evaluator(state: TravelState):
        safety = state.get("safety_score", 0.0)
        quality = state.get("travel_quality_score", 0.0)
        loop_count = state.get("loop_count", 0)
        
        print(f"--- Evaluator Results ---")
        print(f"Safety Score: {safety}")
        print(f"Quality Score: {quality}")
        print(f"Loop Count: {loop_count}")

        # If the planner returned an empty itinerary (e.g. rate-limit failure),
        # do NOT loop — the retry will just hit the same error and waste tokens.
        itinerary = state.get("itinerary") or {}
        days = itinerary.get("days", []) if isinstance(itinerary, dict) else []
        if not days:
            print("[SKIP] Planner returned no days (likely rate-limited). Ending without retry.")
            return END
        
        # Loop back if scores are below 70 and we have tried less than 2 times
        if (safety < 70.0 or quality < 70.0) and loop_count < 2:
            print("[X] Scores are below 70/100. Routing back to Planner for corrections...")
            return "planner"
        else:
            print("[OK] Scores are acceptable or loop limit reached. Ending process.")
            return END

    # Build graph
    builder = StateGraph(TravelState)
    
    builder.add_node("research", research_node)
    builder.add_node("planner", planner_node)
    builder.add_node("evaluator", evaluator_node)

    # Define edges
    builder.add_edge(START, "research")
    builder.add_edge("research", "planner")
    builder.add_edge("planner", "evaluator")
    
    builder.add_conditional_edges(
        "evaluator",
        route_after_evaluator,
        {
            "planner": "planner",
            END: END
        }
    )

    return builder.compile()

# Example usage interface
class TravelIntelligenceSystem:
    def __init__(self):
        self.graph = create_travel_graph()

    def generate_trip(
        self,
        destination: str,
        days: int,
        budget: float,
        travelers: int,
        interests: list,
        currency: str = "USD",
        start_date: str = None,
        end_date: str = None,
        start_time: str = "08:00",
        end_time: str = "20:00",
        breakfast_time: str = "07:30",
        lunch_time: str = "13:00",
        dinner_time: str = "19:30",
        travel_mode: str = "mixed",
    ):
        initial_state = {
            "destination": destination,
            "days": days,
            "budget": budget,
            "travelers": travelers,
            "interests": interests,
            "currency": currency,
            "start_date": start_date,
            "end_date": end_date,
            "start_time": start_time,
            "end_time": end_time,
            "breakfast_time": breakfast_time,
            "lunch_time": lunch_time,
            "dinner_time": dinner_time,
            "travel_mode": travel_mode,
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
            "loop_count": 0,
        }

        final_state = self.graph.invoke(initial_state)
        return final_state

