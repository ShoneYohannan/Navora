import sys
import os
from pydantic import BaseModel, Field

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from langchain_groq import ChatGroq
from utils.config import Config

class TestSchema(BaseModel):
    name: str
    age: int

def test():
    print("Testing ChatGroq with structured output...")
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=Config.GROQ_API_KEY,
        temperature=0.3
    )
    structured_llm = llm.with_structured_output(TestSchema)
    try:
        res = structured_llm.invoke("My name is John and I am 30 years old.")
        print("Success:", res)
    except Exception as e:
        print("Failed:", e)

if __name__ == "__main__":
    test()
