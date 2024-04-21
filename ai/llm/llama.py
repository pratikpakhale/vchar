from langchain_community.llms import LlamaCpp

from utils.config import config
MODEL_PATH = config['ai']['llama_model']


# n_gpu_layers = -1 
n_gpu_layers = config['ai']['n_gpu_layers']
n_batch = 512  

def LlamaLLM(callback_manager=None):
  llm = LlamaCpp(
    model_path=MODEL_PATH,
    n_gpu_layers=n_gpu_layers,
    n_batch=n_batch,
    n_ctx=5000,
    # callback_manager=callback_manager,
    # verbose=True
  )
    
  return llm
