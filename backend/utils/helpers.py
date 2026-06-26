import json
from typing import Any, Dict, Optional

def clean_json_string(content: str) -> str:
    """Removes markdown backticks and extracts the raw JSON string."""
    content = content.strip()
    if "```json" in content:
        content = content.split("```json")[1].split("```")[0].strip()
    elif "```" in content:
        content = content.split("```")[1].split("```")[0].strip()
    return content

def safe_json_loads(content: str, fallback: Any = None) -> Any:
    """Safely loads a JSON string with a fallback value on failure."""
    try:
        cleaned = clean_json_string(content)
        return json.loads(cleaned)
    except Exception as e:
        print(f"JSON parsing error: {e}")
        return fallback
