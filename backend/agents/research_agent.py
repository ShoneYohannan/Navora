from typing import Dict, Any
from state import TravelState
from services.weather_service import WeatherService
from services.places_service import PlacesService
from services.movie_service import MovieService

class ResearchAgent:
    def __init__(self):
        self.weather_service = WeatherService()
        self.places_service = PlacesService()
        self.movie_service = MovieService()

    def run(self, state: TravelState) -> Dict[str, Any]:
        print(f"--- Researching: {state['destination']} ---")
        
        # 1. Fetch Weather
        weather = self.weather_service.get_weather(state["destination"])
        
        # 2. Fetch Attractions
        attractions = self.places_service.get_nearby_places(state["destination"], "attraction")
        
        # 3. Fetch Malls
        malls = self.places_service.get_nearby_places(state["destination"], "mall")
        
        # 4. Fetch Restaurants
        restaurants = self.places_service.get_nearby_places(state["destination"], "restaurant")
        
        # 5. Fetch Movies
        movies = self.movie_service.get_recommendations(state.get("interests", ["general"])[0])
        
        return {
            "weather_info": weather,
            "nearby_attractions": attractions,
            "malls": malls,
            "restaurants": restaurants,
            "movie_recommendations": movies
        }
