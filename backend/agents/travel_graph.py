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
        result = planner_agent.run(state)
        return result

    def evaluator_node(state: TravelState):
        result = evaluator_agent.run(state)
        return result

    # Build graph
    builder = StateGraph(TravelState)
    
    builder.add_node("research", research_node)
    builder.add_node("planner", planner_node)
    builder.add_node("evaluator", evaluator_node)

    # Define edges
    builder.add_edge(START, "research")
    builder.add_edge("research", "planner")
    builder.add_edge("planner", "evaluator")
    builder.add_edge("evaluator", END)

    return builder.compile()

# Example usage interface
class TravelIntelligenceSystem:
    def __init__(self):
        self.graph = create_travel_graph()

    def generate_trip(self, destination: str, duration: int, budget: float, travelers: int, interests: list):
        initial_state = {
            "destination": destination,
            "duration": duration,
            "budget": budget,
            "travelers": travelers,
            "interests": interests,
            "messages": [],
            "errors": [],
            "weather_info": None,
            "nearby_attractions": [],
            "malls": [],
            "restaurants": [],
            "movie_recommendations": [],
            "itinerary": None,
            "budget_breakdown": None,
            "packing_checklist": [],
            "alternate_activities": [],
            "safety_score": 0.0,
            "travel_quality_score": 0.0,
            "evaluator_feedback": ""
        }
        
        final_state = self.graph.invoke(initial_state)
        return final_state
