import sys
import os

# Add parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.travel_graph import TravelIntelligenceSystem
import json

def test():
    print("Initializing system...")
    try:
        system = TravelIntelligenceSystem()
        print("Generating trip...")
        result = system.generate_trip(
            destination="kochi",
            days=3,
            budget=1500,
            travelers=1,
            interests=["Culture"],
            currency="USD"
        )
        print("Result:")
        print(json.dumps(result, indent=2))
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test()
