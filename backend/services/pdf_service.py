from fpdf import FPDF
import io
from typing import Dict, Any

class PDFService:
    def generate_itinerary_pdf(self, trip_data: Dict[str, Any]) -> bytes:
        pdf = FPDF()
        pdf.add_page()
        
        # Title
        pdf.set_font("Helvetica", "B", 24)
        pdf.cell(0, 20, f"Navora AI: {trip_data.get('destination', 'Your Trip')}", ln=True, align="C")
        
        # Trip Overview
        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(0, 10, "Trip Overview", ln=True)
        pdf.set_font("Helvetica", "", 12)
        pdf.cell(0, 8, f"Days: {trip_data.get('days', trip_data.get('duration', 0))} Days", ln=True)
        pdf.cell(0, 8, f"Travelers: {trip_data.get('travelers')}", ln=True)
        pdf.cell(0, 8, f"Budget: ${trip_data.get('budget', 0)}", ln=True)
        pdf.ln(5)
        
        # Itinerary
        itinerary = trip_data.get("itinerary", {})
        if itinerary and "days" in itinerary:
            pdf.set_font("Helvetica", "B", 14)
            pdf.cell(0, 10, "Day-wise Itinerary", ln=True)
            
            for day in itinerary["days"]:
                pdf.set_font("Helvetica", "B", 12)
                pdf.cell(0, 8, f"Day {day.get('day')}: {day.get('theme', '')}", ln=True)
                pdf.set_font("Helvetica", "", 10)
                for activity in day.get("activities", []):
                    pdf.multi_cell(0, 6, f"- {activity}")
                pdf.ln(2)
        
        # Budget
        budget = trip_data.get("budget_breakdown", {})
        if budget:
            pdf.ln(5)
            pdf.set_font("Helvetica", "B", 14)
            pdf.cell(0, 10, "Budget Breakdown", ln=True)
            pdf.set_font("Helvetica", "", 12)
            for category, amount in budget.items():
                pdf.cell(0, 8, f"- {category.capitalize()}: ${amount}", ln=True)
        
        # Packing Checklist
        packing = trip_data.get("packing_checklist", [])
        if packing:
            pdf.ln(5)
            pdf.set_font("Helvetica", "B", 14)
            pdf.cell(0, 10, "Packing Checklist", ln=True)
            pdf.set_font("Helvetica", "", 10)
            for item in packing:
                pdf.cell(0, 6, f"[ ] {item}", ln=True)
        
        return pdf.output()
