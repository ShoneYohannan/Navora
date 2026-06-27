# 🌍 Navora – AI Powered Travel Planner

<p align="center">
  <img src="assets/logo.png" width="180" alt="Navora Logo"/>
</p>

<p align="center">
AI-powered travel planning platform that creates personalized itineraries, discovers attractions, hotels, restaurants, and local experiences using multiple APIs and Large Language Models.
</p>

---

# 📖 Table of Contents

- About
- Features
- Tech Stack
- System Architecture
- Project Structure
- Installation
- Environment Variables
- Running the Project
- API Integrations
- Workflow
- Screenshots
- Future Enhancements
- Contributors
- License

---

# 📌 About

**Navora** is an AI-based travel planner developed as a college project.

The application helps users plan trips effortlessly by generating intelligent travel itineraries based on their destination, travel duration, interests, and budget.

Instead of manually searching across multiple websites, Navora gathers travel information from various APIs and uses AI to generate a personalized travel experience.

---

# ✨ Features

## 🧠 AI Trip Planning

- AI-generated travel itinerary
- Day-wise travel plans
- Activity recommendations
- Budget estimation
- Personalized suggestions

---

## 🏨 Hotel Recommendations

- Nearby hotels
- Ratings
- Price information
- Booking links (future enhancement)

---

## 🍽 Restaurant Suggestions

- Local restaurants
- Cuisine recommendations
- Highly rated places
- Nearby food options

---

## 📍 Tourist Attractions

- Famous landmarks
- Museums
- Parks
- Beaches
- Historical monuments
- Hidden gems

---

## 🎬 Movie Recommendations

Using TMDB API, Navora recommends

- Movies filmed in the destination
- Popular movies related to the location
- TV shows
- Movie posters
- Ratings

Example:

Destination:
```
Paris
```

Movies

- Ratatouille
- Midnight in Paris
- Before Sunset

---

## 🌤 Weather Information *(Future)*

- Current weather
- Temperature
- Rain forecast
- Best travel season

---

## 🗺 Interactive Maps *(Future)*

- Attractions
- Hotels
- Restaurants
- Route optimization

---

## 💰 Budget Planning

Generate travel plans according to

- Economy
- Standard
- Luxury

---

## 📱 Responsive UI

- Desktop
- Tablet
- Mobile

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios

---

## Backend

- FastAPI
- Python
- Uvicorn

---

## AI

- LangGraph
- LangChain
- OpenAI GPT
- Prompt Engineering

---

## Database

- MongoDB Atlas

---

## APIs

- Serper.dev API
- TMDB API
- Google Places API *(optional)*
- OpenStreetMap *(optional)*

---

# 🏗 System Architecture

```
                    User

                      │

                      ▼

              React Frontend

                      │

                      ▼

              FastAPI Backend

        ┌─────────┬──────────┐
        │         │          │
        ▼         ▼          ▼

     OpenAI    Serper     TMDB API

        │         │          │

        └─────────┴──────────┘

                ▼

         AI Generated Response

                ▼

          React User Interface
```

---

# 📂 Project Structure

```
Navora/

│

├── backend/

│   ├── agents/

│   ├── routes/

│   ├── services/

│   ├── models/

│   ├── prompts/

│   ├── main.py

│   └── requirements.txt

│

├── frontend/

│   ├── src/

│   │   ├── components/

│   │   ├── pages/

│   │   ├── hooks/

│   │   ├── services/

│   │   ├── assets/

│   │   └── App.jsx

│   │

│   ├── public/

│   └── package.json

│

├── README.md

└── .env
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/Navora.git

cd Navora
```

---

## Backend Setup

```bash
cd backend

python -m venv venv
```

Windows

```bash
venv\Scripts\activate
```

Linux

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside backend.

```env
OPENAI_API_KEY=your_key

SERPER_API_KEY=your_key

TMDB_API_KEY=your_key

MONGODB_URI=your_connection_string
```

---

# ▶ Running the Project

## Backend

```bash
uvicorn main:app --reload
```

Runs at

```
http://localhost:8000
```

---

## Frontend

```bash
npm run dev
```

Runs at

```
http://localhost:5173
```

---

# 🔌 API Integrations

## OpenAI

Used for

- AI itinerary generation
- Personalized recommendations
- Trip planning

---

## Serper API

Used for

- Local attractions
- Hotels
- Restaurants
- Travel information
- Nearby places

---

## TMDB API

Used for

- Movie recommendations
- Movie posters
- Ratings
- Popular films

---

## MongoDB

Stores

- User profiles
- Saved trips
- Previous itineraries

---

# 🔄 Workflow

```
User enters

Destination
↓

Travel Days
↓

Budget
↓

Interests

↓

Frontend sends request

↓

FastAPI Backend

↓

AI Agent

↓

Collects

• Attractions
• Hotels
• Restaurants
• Movies

↓

AI generates itinerary

↓

Response returned

↓

Frontend displays trip
```

---

# 📸 Screenshots

Add screenshots here

```
Home Page

Trip Planner

Generated Itinerary

Movie Recommendations

Hotel Recommendations
```

---

# 🚀 Future Enhancements

- Google Maps Integration
- Live Weather
- Flight Search
- Hotel Booking
- User Authentication
- Save Trips
- PDF Export
- Share Trips
- Voice Assistant
- Multi-language Support
- Offline Itinerary
- Expense Tracking

---

# 🤝 Contributors

| Name | Role |
|--------|------|
| Shone Yohannan | Backend Development & AI Integration |
| Lakshmi AK | Frontend Development |
| Asraya Ajay | Frontend Development |
| Abhinav Anil | Backend Development & Database Integration |

---

# 🎓 Academic Information

Project Title:

**Navora – AI Powered Travel Planner**

Developed as part of a college mini project.

---

# 📄 License

This project is intended for educational purposes.

Feel free to modify and extend it for learning.

---

# ⭐ Acknowledgements

- OpenAI
- TMDB
- Serper.dev
- FastAPI
- React
- MongoDB Atlas
- Tailwind CSS

---

<p align="center">
Made with ❤️ by Team Navora
</p>