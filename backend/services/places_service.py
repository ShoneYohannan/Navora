import requests
from typing import List, Dict, Any

class PlacesService:
    def __init__(self):
        self.overpass_url = "http://overpass-api.de/api/interpreter"

    def get_nearby_places(self, city: str, place_type: str = "attraction", limit: int = 5) -> List[Dict[str, Any]]:
        # Define tags based on type
        tags = {
            "attraction": '["tourism"="attraction"]',
            "mall": '["shop"="mall"]',
            "restaurant": '["amenity"="restaurant"]'
        }
        
        tag_filter = tags.get(place_type, '["tourism"="attraction"]')
        
        query = f"""
        [out:json][timeout:25];
        area[name="{city}"]->.searchArea;
        (
          node{tag_filter}(area.searchArea);
          way{tag_filter}(area.searchArea);
          rel{tag_filter}(area.searchArea);
        );
        out center {limit};
        """
        
        try:
            response = requests.post(self.overpass_url, data={'data': query})
            response.raise_for_status()
            data = response.json()
            
            results = []
            for element in data.get("elements", []):
                name = element.get("tags", {}).get("name", "Unknown")
                lat = element.get("lat") or element.get("center", {}).get("lat")
                lon = element.get("lon") or element.get("center", {}).get("lon")
                
                if name != "Unknown":
                    results.append({
                        "name": name,
                        "lat": lat,
                        "lon": lon,
                        "type": place_type,
                        "address": element.get("tags", {}).get("addr:street", "Nearby")
                    })
            return results
        except Exception as e:
            print(f"Places API error: {e}")
            return []
