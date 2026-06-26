import sys
sys.path.insert(0, '.')
from services.movie_service import MovieService

s = MovieService()
movies = s.get_recommendations()
print('Movies count:', len(movies))
print()
for m in movies:
    title = m.get('title', 'N/A')
    rating = m.get('rating', 'N/A')
    rd = m.get('release_date', 'N/A')
    overview = (m.get('overview') or '')[:80]
    print(f"TITLE:   {title}")
    print(f"RATING:  {rating}  |  RELEASE: {rd}")
    print(f"PREVIEW: {overview}")
    print()
