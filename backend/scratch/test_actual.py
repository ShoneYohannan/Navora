import sys
import os

# Add parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.travel_graph import TravelIntelligenceSystem
import json

def test():
    print("Initializing travel intelligence system using modified code...")
    try:
        system = TravelIntelligenceSystem()
        print("Generating trip for Kochi...")
        result = system.generate_trip(
            destination="kochi",
            days=3,
            budget=1500,
            travelers=1,
            interests=["Culture"],
            currency="USD",
            start_date="2026-06-26",
            end_date="2026-06-28"
        )
        print("Success! Generated trip dictionary fields:")
        print(f"Destination: {result.get('destination')}")
        print(f"Days: {result.get('days')}")
        print(f"Safety score: {result.get('safety_score')}")
        print(f"Quality score: {result.get('travel_quality_score')}")
        print(f"Feedback: {result.get('evaluator_feedback')}")
        print(f"Itinerary day count: {len(result.get('itinerary', {}).get('days', []))}")
        print("First day theme:", result.get('itinerary', {}).get('days', [])[0].get('theme'))
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test()
