import requests
from typing import List, Dict, Any, Optional
from utils.config import Config

class MovieService:
    def __init__(self):
        self.api_key = Config.TMDB_API_KEY
        self.base_url = "https://api.themoviedb.org/3"


    def get_recommendations(self, genre_context: str = "") -> List[Dict[str, Any]]:
        if not self.api_key:
            return [{"title": "Inception", "rating": 8.8, "overview": "A thief who steals corporate secrets through the use of dream-sharing technology."}]
        
        try:
            # For simplicity, we fetch trending movies. Context can be used to filter by genre if implemented.
            url = f"{self.base_url}/trending/movie/week"
            params = {"api_key": self.api_key}
            
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            results = []
            for movie in data.get("results", [])[:5]:
                results.append({
                    "title": movie.get("title"),
                    "rating": movie.get("vote_average"),
                    "overview": movie.get("overview"),
                    "poster_path": f"https://image.tmdb.org/t/p/w500{movie.get('poster_path')}" if movie.get('poster_path') else None
                })
            return results
        except Exception as e:
            print(f"Movie API error: {e}")
            return []
