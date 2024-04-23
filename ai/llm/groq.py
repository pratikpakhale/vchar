import os
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

from utils.config import config

from langchain_groq import ChatGroq

GROQ_API_KEY = os.getenv('GROQ_API_KEY')

if config['ai']['groq_model']:
  MODEL = config['ai']['groq_model']
else:
  MODEL = 'llama3-8b-8192'

def GroqLLM():
  llm = ChatGroq(model=MODEL, groq_api_key=GROQ_API_KEY, temperature=0)
  return llm