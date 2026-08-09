import requests
import re
import time
from typing import List, Dict, Any
from datetime import datetime
from utils.config import Config


class MovieService:
    def __init__(self):
        self.tmdb_api_key = Config.TMDB_API_KEY
        self.serper_api_key = Config.SERPER_API_KEY
        self.tmdb_base_url = "https://api.themoviedb.org/3"
        self.serper_url = "https://google.serper.dev/search"
        self._cache: List[Dict[str, Any]] = []
        self._cache_timestamp: float = 0
        self._cache_ttl: float = 4 * 3600  # 4 hours cache TTL

    def _fetch_from_tmdb(self, region: str = "IN") -> List[Dict[str, Any]]:
        if not self.tmdb_api_key:
            return []

        url = f"{self.tmdb_base_url}/movie/now_playing"
        params = {
            "api_key": self.tmdb_api_key,
            "language": "en-US",
            "region": region,
            "page": 1,
        }

        try:
            resp = requests.get(url, params=params, timeout=8)
            resp.raise_for_status()
            data = resp.json()
        except Exception as e:
            print(f"[MovieService] TMDB fetch error: {e}")
            return []

        dates = data.get("dates", {})
        min_date = dates.get("minimum", "")
        max_date = dates.get("maximum", "")

        raw_results = data.get("results", [])

        # Fetch page 2 if page 1 has fewer results
        if data.get("total_pages", 1) > 1 and len(raw_results) < 10:
            try:
                params["page"] = 2
                r2 = requests.get(url, params=params, timeout=5)
                if r2.status_code == 200:
                    raw_results.extend(r2.json().get("results", []))
            except Exception:
                pass

        results = []
        seen_ids = set()

        for movie in raw_results:
            movie_id = movie.get("id")
            if movie_id in seen_ids:
                continue
            seen_ids.add(movie_id)

            rel_date = movie.get("release_date", "")

            # Strict Data-Driven Regional Filtering:
            # 1. Require a valid release date string.
            # 2. Verify release_date falls within TMDB's current theatrical window bounds for India (minimum to maximum dates).
            if not rel_date:
                continue

            if min_date and max_date:
                if not (min_date <= rel_date <= max_date):
                    continue
            else:
                today_str = datetime.utcnow().strftime("%Y-%m-%d")
                if rel_date > today_str:
                    continue

            poster = movie.get("poster_path")
            poster_url = f"https://image.tmdb.org/t/p/w500{poster}" if poster else None

            results.append({
                "id": movie_id,
                "title": movie.get("title", ""),
                "rating": round(movie.get("vote_average", 0), 1),
                "overview": movie.get("overview", "") or "Currently playing in theaters in India.",
                "poster_path": poster_url,
                "release_date": rel_date,
                "popularity": movie.get("popularity", 0),
            })

        # Sort by popularity descending to present top current theatrical releases first
        results.sort(key=lambda x: x.get("popularity", 0), reverse=True)
        return results

    def _fetch_from_serper_dynamic(self) -> List[Dict[str, Any]]:
        """Dynamic Google Search fallback via Serper for current India cinema releases without hardcoded lists."""
        if not self.serper_api_key:
            return []

        headers = {
            "X-API-KEY": self.serper_api_key,
            "Content-Type": "application/json",
        }
        current_year = datetime.now().year
        payload = {
            "q": f"movies currently playing in theaters in India {current_year} showtimes",
            "gl": "in",
            "hl": "en",
            "num": 10,
        }

        try:
            resp = requests.post(self.serper_url, headers=headers, json=payload, timeout=6)
            resp.raise_for_status()
            data = resp.json()

            results = []
            kg = data.get("knowledgeGraph", {})
            if kg and kg.get("title"):
                results.append({
                    "title": kg.get("title"),
                    "rating": 7.5,
                    "overview": kg.get("description", "Currently playing in theaters in India."),
                    "poster_path": kg.get("imageUrl"),
                    "release_date": f"{current_year}-01-01",
                })

            for item in data.get("organic", [])[:6]:
                title = item.get("title", "")
                snippet = item.get("snippet", "")
                clean_title = re.sub(r"\s*-\s*.*$", "", title).strip()
                if clean_title and len(clean_title) < 60:
                    results.append({
                        "title": clean_title,
                        "rating": 7.0,
                        "overview": snippet[:150] if snippet else "Currently playing in theaters in India.",
                        "poster_path": None,
                        "release_date": f"{current_year}-01-01",
                    })
            return results
        except Exception as e:
            print(f"[MovieService] Serper dynamic fallback error: {e}")
            return []

    def get_recommendations(
        self, genre_context: str = "", region: str = "IN", force_refresh: bool = False
    ) -> List[Dict[str, Any]]:
        """
        Returns movies currently playing in theaters in India.
        Data-driven: TMDB (region=IN with dates bounds) -> Serper dynamic search.
        Includes automated cache expiration (4-hour TTL).
        """
        now = time.time()
        if not force_refresh and self._cache and (now - self._cache_timestamp < self._cache_ttl):
            return self._cache

        movies = self._fetch_from_tmdb(region=region)
        if not movies:
            movies = self._fetch_from_serper_dynamic()

        if movies:
            self._cache = movies
            self._cache_timestamp = now

        return movies or []

