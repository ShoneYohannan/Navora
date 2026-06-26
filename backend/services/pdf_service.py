from fpdf import FPDF
from typing import Dict, Any
import unicodedata


def safe_text(text) -> str:
    """Convert text to ASCII-safe string for fpdf2 compatibility."""
    if text is None:
        return ""
    text = str(text)
    # Normalize unicode and replace unsupported chars
    normalized = unicodedata.normalize("NFKD", text)
    return normalized.encode("ascii", "ignore").decode("ascii")


class PDFService:
    def generate_itinerary_pdf(self, trip_data: Dict[str, Any]) -> bytes:
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()

        # ── Header / Title ──────────────────────────────────────────────
        pdf.set_fill_color(14, 165, 233)   # sky-500
        pdf.rect(0, 0, 210, 40, "F")

        pdf.set_font("Helvetica", "B", 22)
        pdf.set_text_color(255, 255, 255)
        pdf.set_y(8)
        pdf.cell(0, 12, "NAVORA AI  --  TRAVEL ITINERARY", new_x="LMARGIN", new_y="NEXT", align="C")

        destination = safe_text(trip_data.get("destination", "Your Trip"))
        pdf.set_font("Helvetica", "B", 16)
        pdf.cell(0, 10, destination.upper(), new_x="LMARGIN", new_y="NEXT", align="C")

        pdf.set_y(48)
        pdf.set_text_color(30, 41, 59)   # slate-800

        # ── Trip Overview ────────────────────────────────────────────────
        pdf.set_font("Helvetica", "B", 13)
        pdf.set_fill_color(241, 245, 249)  # slate-100
        pdf.cell(0, 9, " Trip Overview", new_x="LMARGIN", new_y="NEXT", fill=True)
        pdf.ln(2)

        pdf.set_font("Helvetica", "", 11)
        days = trip_data.get("days", trip_data.get("duration", 0))
        travelers = trip_data.get("travelers", 1)
        budget = trip_data.get("budget", 0)
        currency = safe_text(trip_data.get("currency", "USD"))
        safety = trip_data.get("safety_score", "N/A")
        quality = trip_data.get("travel_quality_score", "N/A")

        overview_items = [
            f"Duration:      {days} Days",
            f"Travelers:     {travelers}",
            f"Budget:        {currency} {budget}",
            f"Safety Score:  {safety}%",
            f"Quality Score: {quality}%",
        ]
        for item in overview_items:
            pdf.cell(0, 7, safe_text(item), new_x="LMARGIN", new_y="NEXT")
        pdf.ln(4)

        # ── Weather ──────────────────────────────────────────────────────
        weather = trip_data.get("weather_info")
        if weather:
            pdf.set_font("Helvetica", "B", 13)
            pdf.set_fill_color(241, 245, 249)
            pdf.cell(0, 9, " Weather at Destination", new_x="LMARGIN", new_y="NEXT", fill=True)
            pdf.ln(2)
            pdf.set_font("Helvetica", "", 11)
            temp = weather.get("temp", "N/A")
            desc = safe_text(weather.get("description", ""))
            pdf.cell(0, 7, f"Temperature: {temp} C", new_x="LMARGIN", new_y="NEXT")
            pdf.cell(0, 7, f"Conditions:  {desc}", new_x="LMARGIN", new_y="NEXT")
            pdf.ln(4)

        # ── Day-wise Itinerary ───────────────────────────────────────────
        itinerary = trip_data.get("itinerary", {})
        if itinerary and "days" in itinerary:
            pdf.set_font("Helvetica", "B", 13)
            pdf.set_fill_color(241, 245, 249)
            pdf.cell(0, 9, " Day-wise Itinerary", new_x="LMARGIN", new_y="NEXT", fill=True)
            pdf.ln(2)

            for day in itinerary["days"]:
                day_num = day.get("day", "?")
                theme = safe_text(day.get("theme", ""))
                weather_fc = safe_text(day.get("weather_forecast", ""))

                pdf.set_font("Helvetica", "B", 11)
                pdf.set_fill_color(224, 242, 254)  # sky-100
                header = f"  Day {day_num}: {theme}"
                if weather_fc:
                    header += f"  [{weather_fc}]"
                pdf.cell(0, 8, safe_text(header), new_x="LMARGIN", new_y="NEXT", fill=True)

                pdf.set_font("Helvetica", "", 10)
                for idx, activity in enumerate(day.get("activities", [])):
                    time_label = f"{9 + idx * 2}:00"
                    pdf.multi_cell(
                        0, 6,
                        f"    {time_label}  {safe_text(activity)}",
                        new_x="LMARGIN", new_y="NEXT"
                    )

                risk = safe_text(day.get("safety_risk_assessment", ""))
                if risk:
                    pdf.set_font("Helvetica", "I", 9)
                    pdf.cell(0, 6, f"    Safety: {risk}", new_x="LMARGIN", new_y="NEXT")

                pdf.ln(3)

        # ── Budget Breakdown ─────────────────────────────────────────────
        budget_data = trip_data.get("budget_breakdown", {})
        if budget_data:
            pdf.set_font("Helvetica", "B", 13)
            pdf.set_fill_color(241, 245, 249)
            pdf.cell(0, 9, " Budget Breakdown", new_x="LMARGIN", new_y="NEXT", fill=True)
            pdf.ln(2)
            pdf.set_font("Helvetica", "", 11)
            for category, amount in budget_data.items():
                cat_label = safe_text(category.replace("_", " ").capitalize())
                pdf.cell(0, 7, f"  {cat_label}: {currency} {amount}", new_x="LMARGIN", new_y="NEXT")
            pdf.ln(4)

        # ── Packing Checklist ────────────────────────────────────────────
        packing = trip_data.get("packing_checklist", [])
        if packing:
            pdf.set_font("Helvetica", "B", 13)
            pdf.set_fill_color(241, 245, 249)
            pdf.cell(0, 9, " Packing Checklist", new_x="LMARGIN", new_y="NEXT", fill=True)
            pdf.ln(2)
            pdf.set_font("Helvetica", "", 10)
            for item in packing:
                pdf.cell(0, 6, f"  [ ] {safe_text(item)}", new_x="LMARGIN", new_y="NEXT")
            pdf.ln(4)

        # ── Movie Recommendations ────────────────────────────────────────
        movies = trip_data.get("movie_recommendations", [])
        if movies:
            pdf.set_font("Helvetica", "B", 13)
            pdf.set_fill_color(241, 245, 249)
            pdf.cell(0, 9, " Now Playing - Movie Picks", new_x="LMARGIN", new_y="NEXT", fill=True)
            pdf.ln(2)
            pdf.set_font("Helvetica", "", 10)
            for movie in movies:
                title = safe_text(movie.get("title", ""))
                rating = movie.get("rating", "")
                overview = safe_text(movie.get("overview", ""))
                pdf.set_font("Helvetica", "B", 10)
                pdf.cell(0, 6, f"  {title}  (Rating: {rating}/10)", new_x="LMARGIN", new_y="NEXT")
                pdf.set_font("Helvetica", "", 9)
                pdf.multi_cell(0, 5, f"  {overview}", new_x="LMARGIN", new_y="NEXT")
                pdf.ln(2)

        # ── Travel Agent Notes ───────────────────────────────────────────
        notes = safe_text(trip_data.get("evaluator_feedback", ""))
        if notes:
            pdf.set_font("Helvetica", "B", 13)
            pdf.set_fill_color(241, 245, 249)
            pdf.cell(0, 9, " Travel Agent Notes", new_x="LMARGIN", new_y="NEXT", fill=True)
            pdf.ln(2)
            pdf.set_font("Helvetica", "I", 10)
            pdf.multi_cell(0, 6, f"  \"{notes}\"", new_x="LMARGIN", new_y="NEXT")

        # ── Footer ───────────────────────────────────────────────────────
        pdf.ln(8)
        pdf.set_font("Helvetica", "I", 8)
        pdf.set_text_color(148, 163, 184)  # slate-400
        pdf.cell(0, 6, "Generated by Navora AI Travel Planner", new_x="LMARGIN", new_y="NEXT", align="C")

        return bytes(pdf.output())
