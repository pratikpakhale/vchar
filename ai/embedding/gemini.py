import os 
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from utils.config import config
MODEL = config['ai']['gemini_embedding_model']

GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')



def GeminiEmbedding():
  embeddings = GoogleGenerativeAIEmbeddings(google_api_key=GOOGLE_API_KEY,model=MODEL, task_type='retrieval_query')
  return embeddings