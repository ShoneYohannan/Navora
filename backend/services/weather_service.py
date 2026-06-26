import os
import requests
from typing import Dict, Any, Optional
from utils.config import Config


class WeatherService:
    def __init__(self):
        self.api_key = (Config.OPENWEATHER_API_KEY or os.getenv("OPENWEATHER_API_KEY") or "").strip()
        self.base_url = "https://api.openweathermap.org/data/2.5/weather"

    def get_weather(self, city: str) -> Optional[Dict[str, Any]]:
        if not self.api_key:
            return {"error": "API key not configured", "temp": 25, "description": "Sunny (Fallback)"}

        try:
            params = {
                "q": city,
                "appid": self.api_key,
                "units": "metric"
            }
            response = requests.get(self.base_url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()

            return {
                "temp": data["main"]["temp"],
                "feels_like": data["main"]["feels_like"],
                "description": data["weather"][0]["description"],
                "humidity": data["main"]["humidity"],
                "wind_speed": data["wind"]["speed"],
                "city": data["name"]
            }
        except requests.RequestException as e:
            print("Weather API request failed")
            return {"error": "Weather service unavailable. Using fallback data.", "temp": 25, "description": "Sunny (Fallback)"}
        except Exception as e:
            print("Weather processing error")
            return {"error": "Weather service unavailable. Using fallback data.", "temp": 25, "description": "Sunny (Fallback)"}
