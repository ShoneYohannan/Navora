import sys
import os
import asyncio

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from main import app
from datetime import datetime

def test_routes():
    print("Initializing FastAPI TestClient...")
    client = TestClient(app)
    
    # 1. Test generate-trip
    print("Testing /api/generate-trip...")
    payload = {
        "destination": "kochi",
        "days": 3,
        "budget": 1500,
        "currency": "USD",
        "interests": ["Culture"]
    }
    
    # Since generating the trip hits the live Groq API, let's call it and expect success
    response = client.post("/api/generate-trip", json=payload)
    print("Response status:", response.status_code)
    assert response.status_code == 200, "Generate trip failed"
    trip_data = response.json()
    print("Generated trip keys:", list(trip_data.keys()))
    
    # 2. Test save-trip (with MongoDB offline)
    print("Testing /api/save-trip (MongoDB fallback test)...")
    save_response = client.post("/api/save-trip", json=trip_data)
    print("Save Response status:", save_response.status_code)
    assert save_response.status_code == 200, "Save trip failed"
    save_data = save_response.json()
    print("Saved Trip Response:", save_data)
    saved_id = save_data.get("id")
    assert saved_id is not None, "Saved ID is None"
    
    # 3. Test get-trip
    print(f"Testing /api/trip/{saved_id}...")
    get_response = client.get(f"/api/trip/{saved_id}")
    print("Get Response status:", get_response.status_code)
    assert get_response.status_code == 200, "Get trip failed"
    get_data = get_response.json()
    print("Retrieved trip destination:", get_data.get("destination"))
    assert get_data.get("destination") == "kochi", "Mismatching destination"
    
    # 4. Test trip-history
    print("Testing /api/trip-history...")
    history_response = client.get("/api/trip-history")
    print("History Response status:", history_response.status_code)
    assert history_response.status_code == 200, "History failed"
    history_data = history_response.json()
    print("History items count:", len(history_data))
    assert len(history_data) >= 1, "Expected at least 1 trip in history"
    
    print("\n--- ALL ROUTE AND FALLBACK TESTS PASSED ---")

if __name__ == "__main__":
    test_routes()
