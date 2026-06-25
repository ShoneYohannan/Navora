import os
import requests
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

class WeatherService:
    def __init__(self):
        self.api_key = os.getenv("OPENWEATHER_API_KEY")
        self.openweather_url = "https://api.openweathermap.org/data/2.5/weather"
        self.geocoding_url = "https://geocoding-api.open-meteo.com/v1/search"
        self.forecast_url = "https://api.open-meteo.com/v1/forecast"

    def get_weather(self, city: str) -> Optional[Dict[str, Any]]:
        # 1. Try Open-Meteo first (completely free, open, and requires no API key)
        try:
            geo_params = {
                "name": city,
                "count": 1,
                "language": "en",
                "format": "json"
            }
            geo_response = requests.get(self.geocoding_url, params=geo_params, timeout=5)
            geo_response.raise_for_status()
            geo_data = geo_response.json()
            
            if geo_data.get("results"):
                location = geo_data["results"][0]
                lat = location["latitude"]
                lon = location["longitude"]
                resolved_name = location["name"]
                
                # Fetch current weather details from Open-Meteo forecast endpoint
                weather_params = {
                    "latitude": lat,
                    "longitude": lon,
                    "current": "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
                    "timezone": "auto"
                }
                weather_response = requests.get(self.forecast_url, params=weather_params, timeout=5)
                weather_response.raise_for_status()
                weather_data = weather_response.json()
                
                current = weather_data.get("current", {})
                
                # Map WMO weather interpretation codes to readable descriptions
                weather_codes = {
                    0: "Clear sky",
                    1: "Mainly clear",
                    2: "Partly cloudy",
                    3: "Overcast",
                    45: "Foggy",
                    48: "Depositing rime fog",
                    51: "Light drizzle",
                    53: "Moderate drizzle",
                    55: "Dense drizzle",
                    61: "Slight rain",
                    63: "Moderate rain",
                    65: "Heavy rain",
                    71: "Slight snow fall",
                    73: "Moderate snow fall",
                    75: "Heavy snow fall",
                    80: "Slight rain showers",
                    81: "Moderate rain showers",
                    82: "Violent rain showers",
                    95: "Thunderstorm",
                    96: "Thunderstorm with hail"
                }
                
                return {
                    "temp": round(current.get("temperature_2m", 25.0)),
                    "feels_like": round(current.get("apparent_temperature", 25.0)),
                    "description": weather_codes.get(current.get("weather_code"), "Partly cloudy"),
                    "humidity": current.get("relative_humidity_2m", 60),
                    "wind_speed": current.get("wind_speed_10m", 5.0),
                    "city": resolved_name
                }
        except Exception as e:
            print(f"Open-Meteo API query failed, checking fallback: {e}")

        # 2. Fallback to OpenWeatherMap if an API key is configured
        if self.api_key:
            try:
                params = {
                    "q": city,
                    "appid": self.api_key,
                    "units": "metric"
                }
                response = requests.get(self.openweather_url, params=params, timeout=5)
                response.raise_for_status()
                data = response.json()
                
                return {
                    "temp": round(data["main"]["temp"]),
                    "feels_like": round(data["main"]["feels_like"]),
                    "description": data["weather"][0]["description"].capitalize(),
                    "humidity": data["main"]["humidity"],
                    "wind_speed": data["wind"]["speed"],
                    "city": data["name"]
                }
            except Exception as e:
                print(f"OpenWeather API fallback query failed: {e}")

        # 3. Final static backup values
        print(f"Using default static weather fallback data for {city}.")
        return {
            "temp": 26,
            "feels_like": 28,
            "description": "Sunny & Mild",
            "humidity": 65,
            "wind_speed": 4.5,
            "city": city.capitalize()
        }
