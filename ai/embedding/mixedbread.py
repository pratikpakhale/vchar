from langchain_community.embeddings import HuggingFaceBgeEmbeddings

from utils.config import config
MODEL_PATH = config['ai']['mixedbread_model']

model_kwargs = {'device': 'cuda'}
encode_kwargs = {"normalize_embeddings": True}  # set True to compute cosine similarity

def MixedBreadEmbedding():
  embeddings = HuggingFaceBgeEmbeddings(
            model_name=MODEL_PATH,
            model_kwargs=model_kwargs,
            encode_kwargs=encode_kwargs,
            query_instruction="Represent this sentence for searching relevant information:",
        )

  
  return embeddings