from typing import Dict, Any
from datetime import datetime
from state import TravelState
from services.weather_service import WeatherService
from services.serper_service import SerperService
from services.movie_service import MovieService

class ResearchAgent:
    def __init__(self):
        self.weather_service = WeatherService()
        self.serper_service = SerperService()
        self.movie_service = MovieService()

    def run(self, state: TravelState) -> Dict[str, Any]:
        print(f"--- Researching: {state['destination']} ---")
        
        # 1. Fetch Weather Forecast
        start_date = state.get("start_date") or datetime.now().strftime("%Y-%m-%d")
        weather = self.weather_service.get_forecast(state["destination"], state["days"], start_date)
        
        # 2. Fetch Destination Data from Serper.dev
        serper_data = self.serper_service.get_destination_data(state["destination"])
        
        # 3. Fetch Movies (TMDB)
        movies = self.movie_service.get_recommendations(state.get("interests", ["general"])[0])
        
        return {
            "weather_info": weather,
            "nearby_attractions": serper_data.get("attractions", []),
            "malls": serper_data.get("malls", []),
            "restaurants": serper_data.get("restaurants", []),
            "movie_theatres": serper_data.get("theatres", []),
            "local_events": serper_data.get("events", []),
            "movie_recommendations": movies
        }

