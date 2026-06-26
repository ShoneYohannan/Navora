import requests
import re
from typing import List, Dict, Any
from utils.config import Config

# ── Static fallback: confirmed 2025 movies in theaters ──────────────────────
CURRENT_MOVIES_FALLBACK = [
    {
        "title": "Mission: Impossible – The Final Reckoning",
        "rating": 8.2,
        "overview": "Ethan Hunt and the IMF team must stop a rogue AI weapon before it falls into enemy hands — in the most spectacular Mission yet.",
        "poster_path": None,
        "release_date": "2025-05-23",
    },
    {
        "title": "Thunderbolts*",
        "rating": 7.5,
        "overview": "Marvel's team of antiheroes — including Yelena Belova and Bucky Barnes — are forced to work together on a dangerous covert mission.",
        "poster_path": None,
        "release_date": "2025-04-30",
    },
    {
        "title": "How to Train Your Dragon",
        "rating": 7.9,
        "overview": "The beloved animated classic comes to life in this stunning live-action retelling of a young Viking who befriends a rare Night Fury dragon.",
        "poster_path": None,
        "release_date": "2025-06-13",
    },
    {
        "title": "Lilo & Stitch",
        "rating": 7.4,
        "overview": "A live-action Disney reimagining: a lonely Hawaiian girl adopts an unusual 'dog' who is really a dangerous alien fugitive.",
        "poster_path": None,
        "release_date": "2025-05-23",
    },
    {
        "title": "28 Years Later",
        "rating": 7.6,
        "overview": "Decades after the rage virus devastated Britain, a band of survivors must leave their island refuge and face an even deadlier threat on the mainland.",
        "poster_path": None,
        "release_date": "2025-06-20",
    },
    {
        "title": "Karate Kid: Legends",
        "rating": 7.1,
        "overview": "Li Fong moves from Beijing to New York and, after a family tragedy, must compete in a karate tournament under the tutelage of Mr. Han.",
        "poster_path": None,
        "release_date": "2025-05-30",
    },
    {
        "title": "Ballerina",
        "rating": 7.0,
        "overview": "An assassin trained in the John Wick universe seeks revenge against those who killed her family — a high-octane action thriller.",
        "poster_path": None,
        "release_date": "2025-06-06",
    },
]

# Known titles to skip from search results (search-engine noise)
_NOISE_WORDS = [
    "movies", "theater", "showtimes", "now playing", "cinema", "review",
    "top 10", "best", "fandango", "imdb", "rotten tomatoes", "trailer",
    "upcoming", "release", "schedule", "list", "2025 movie", "tickets",
    "buy", "watch", "streaming", "download", "where to", "learn why",
    "no information", "river oaks", "dine-in", "houston",
]


class MovieService:
    def __init__(self):
        self.tmdb_api_key = Config.TMDB_API_KEY
        self.serper_api_key = Config.SERPER_API_KEY
        self.tmdb_base_url = "https://api.themoviedb.org/3"
        self.serper_url = "https://google.serper.dev/search"

    # ── Primary: TMDB now_playing ────────────────────────────────────────────
    def _fetch_from_tmdb(self) -> List[Dict[str, Any]]:
        url = f"{self.tmdb_base_url}/movie/now_playing"
        params = {"api_key": self.tmdb_api_key, "language": "en-US", "page": 1}
        resp = requests.get(url, params=params, timeout=8)
        resp.raise_for_status()
        data = resp.json()

        results = []
        for movie in data.get("results", [])[:6]:
            poster = movie.get("poster_path")
            results.append({
                "title": movie.get("title", ""),
                "rating": round(movie.get("vote_average", 0), 1),
                "overview": movie.get("overview", ""),
                "poster_path": (
                    f"https://image.tmdb.org/t/p/w500{poster}" if poster else None
                ),
                "release_date": movie.get("release_date", ""),
            })
        return results

    # ── Secondary: Serper – targeted individual movie searches ──────────────
    def _fetch_from_serper(self) -> List[Dict[str, Any]]:
        """
        Search Serper for each known 2025 blockbuster to get live ratings/overviews
        from Google's knowledge graph, then return the enriched list.
        """
        # These are confirmed 2025 theatrical releases — use as search seeds
        seed_titles = [
            "Mission Impossible The Final Reckoning 2025 film",
            "Thunderbolts 2025 Marvel film",
            "How to Train Your Dragon 2025 film",
            "Lilo and Stitch 2025 film",
            "28 Years Later 2025 film",
            "Karate Kid Legends 2025 film",
        ]

        headers = {
            "X-API-KEY": self.serper_api_key,
            "Content-Type": "application/json",
        }

        enriched = []
        for query in seed_titles[:4]:   # limit to 4 to save Serper quota
            try:
                payload = {"q": query, "num": 3}
                resp = requests.post(
                    self.serper_url, headers=headers, json=payload, timeout=8
                )
                resp.raise_for_status()
                data = resp.json()

                kg = data.get("knowledgeGraph", {})
                title = kg.get("title", "")
                description = kg.get("description", "")
                image = kg.get("imageUrl")
                attrs = kg.get("attributes", {})

                # Extract rating — check attributes, description, and organic snippets
                rating = None
                candidates = [
                    attrs.get("Rating", ""),
                    attrs.get("IMDb", ""),
                    description,
                ]
                for text_src in candidates:
                    m = re.search(r"(\d+\.?\d*)\s*/\s*10", str(text_src))
                    if m:
                        rating = float(m.group(1))
                        break

                if not rating:
                    for item in data.get("organic", [])[:3]:
                        snip = item.get("snippet", "")
                        m2 = re.search(r"(\d+\.?\d*)\s*/\s*10", snip)
                        if m2:
                            rating = float(m2.group(1))
                            break

                # Strip the rating prefix from the overview if it's in there
                clean_desc = re.sub(r"^\d+\.?\d*/10\s*[–\-•·|]?\s*\d+%.*?[–\-•·|]\s*", "", description).strip()
                if not clean_desc:
                    clean_desc = description

                if title and len(title) > 2:
                    # Skip noise titles
                    if not any(n in title.lower() for n in _NOISE_WORDS[:6]):
                        enriched.append({
                            "title": title,
                            "rating": rating,
                            "overview": description or "Currently playing in theaters.",
                            "poster_path": image,
                            "release_date": release_date,
                        })

            except Exception as e:
                print(f"[MovieService] Serper enrichment error for '{query}': {e}")
                continue

        return enriched

    # ── Public API ───────────────────────────────────────────────────────────
    def get_recommendations(self, genre_context: str = "") -> List[Dict[str, Any]]:
        """
        Returns movies currently playing in theaters.
        Priority: TMDB (if key set) → Serper enrichment → static fallback.
        """
        # 1. Try TMDB
        if self.tmdb_api_key:
            try:
                results = self._fetch_from_tmdb()
                if results:
                    print(f"[MovieService] {len(results)} movies from TMDB now_playing.")
                    return results
            except Exception as e:
                print(f"[MovieService] TMDB error: {e}")

        # 2. Try Serper enrichment (uses your existing Serper key)
        if self.serper_api_key:
            try:
                results = self._fetch_from_serper()
                if len(results) >= 2:
                    # Merge with fallback to fill any gaps (use fallback items not already covered)
                    enriched_titles = {r["title"].lower() for r in results}
                    extras = [
                        m for m in CURRENT_MOVIES_FALLBACK
                        if m["title"].lower() not in enriched_titles
                    ]
                    merged = results + extras
                    print(f"[MovieService] {len(results)} enriched + {len(extras)} fallback = {len(merged)} total movies.")
                    return merged[:7]
                print("[MovieService] Serper enrichment got too few results – using full fallback.")
            except Exception as e:
                print(f"[MovieService] Serper error: {e}")

        # 3. Static fallback
        print("[MovieService] Using curated 2025 fallback movie list.")
        return CURRENT_MOVIES_FALLBACK
