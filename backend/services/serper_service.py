import requests
from typing import List, Dict, Any
from utils.config import Config

class SerperService:
    def __init__(self):
        self.api_key = Config.SERPER_API_KEY
        self.search_url = "https://google.serper.dev/search"
        self.places_url = "https://google.serper.dev/places"

    def search_organic(self, query: str) -> List[Dict[str, Any]]:
        """Queries the Google Search API endpoint for organic results (useful for events)."""
        if not self.api_key:
            print("WARNING: SERPER_API_KEY is not configured. Returning empty search results.")
            return []

        headers = {
            "X-API-KEY": self.api_key,
            "Content-Type": "application/json"
        }
        payload = {"q": query}

        try:
            response = requests.post(self.search_url, headers=headers, json=payload, timeout=3)
            response.raise_for_status()
            data = response.json()
            
            results = []
            for item in data.get("organic", [])[:5]:
                results.append({
                    "name": item.get("title"),
                    "link": item.get("link"),
                    "snippet": item.get("snippet")
                })
            return results
        except Exception as e:
            print(f"Serper search error for query '{query}': {e}")
            return []

    def search_places(self, query: str) -> List[Dict[str, Any]]:
        """Queries the Google Places API endpoint to get coordinates for mapping."""
        if not self.api_key:
            print("WARNING: SERPER_API_KEY is not configured. Returning empty places results.")
            return []

        headers = {
            "X-API-KEY": self.api_key,
            "Content-Type": "application/json"
        }
        payload = {"q": query}

        try:
            response = requests.post(self.places_url, headers=headers, json=payload, timeout=3)
            response.raise_for_status()
            data = response.json()
            
            results = []
            for item in data.get("places", [])[:5]:
                # Map coordinate names to lat/lon for react-leaflet compatibility
                results.append({
                    "name": item.get("title"),
                    "address": item.get("address"),
                    "lat": item.get("latitude"),
                    "lon": item.get("longitude"),
                    "rating": item.get("rating"),
                    "website": item.get("website"),
                    "snippet": f"Rating: {item.get('rating')} - {item.get('address')}"
                })
            return results
        except Exception as e:
            print(f"Serper places search error for query '{query}': {e}")
            return []

    def get_destination_data(self, destination: str) -> Dict[str, List[Dict[str, Any]]]:
        """Gathers all local info for a destination using Serper search and places queries in parallel."""
        print(f"--- Fetching Serper.dev data for {destination} in parallel ---")
        
        from concurrent.futures import ThreadPoolExecutor, as_completed

        tasks = {
            "attractions": lambda: self.search_places(f"tourist attractions in {destination}"),
            "restaurants": lambda: self.search_places(f"restaurants in {destination}"),
            "malls": lambda: self.search_places(f"shopping malls in {destination}"),
            "theatres": lambda: self.search_places(f"movie theatres in {destination}"),
            "events": lambda: self.search_organic(f"local events and activities in {destination}")
        }

        results = {
            "attractions": [],
            "restaurants": [],
            "malls": [],
            "theatres": [],
            "events": []
        }

        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = {executor.submit(func): key for key, func in tasks.items()}
            for future in as_completed(futures):
                key = futures[future]
                try:
                    results[key] = future.result(timeout=4.0)
                except Exception as e:
                    print(f"Serper parallel fetch failed for {key}: {e}")
                    results[key] = []

        return results
