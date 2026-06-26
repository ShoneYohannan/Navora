import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from langchain_groq import ChatGroq
from utils.config import Config

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=Config.GROQ_API_KEY,
    temperature=0.3
)

print("model_kwargs:", getattr(llm, "model_kwargs", None))
print("response_format:", getattr(llm, "response_format", None))
print("Dict representation:")
for k, v in llm.__dict__.items():
    if not k.startswith("_"):
        print(f"  {k}: {v}")
