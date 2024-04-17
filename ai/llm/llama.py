from langchain_community.llms import LlamaCpp
from utils.config import config

n_gpu_layers = -1 
n_batch = 512  

MODEL_PATH = config['ai']['llama_model_path']

print(MODEL_PATH)

def LlamaLLM(callback_manager=None):
  llm = LlamaCpp(
    model_path=MODEL_PATH,
    n_gpu_layers=n_gpu_layers,
    n_batch=n_batch,
    # callback_manager=callback_manager,
    # verbose=True,
    temperature=0.75,
    top_p=1,
  )
    
  return llm
