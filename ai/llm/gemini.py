import os
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

from utils.config import config

from langchain_google_genai import GoogleGenerativeAI

GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

if config['ai']['gemini_model']:
  MODEL = config['ai']['gemini_model']
else:
  MODEL = 'gemini-pro'

def GeminiLLM():
  llm = GoogleGenerativeAI(model=MODEL, google_api_key=GOOGLE_API_KEY)
  return llm