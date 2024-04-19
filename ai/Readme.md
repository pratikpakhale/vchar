# Setup and Run

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

CMAKE_ARGS="-DLLAMA_CUDA=on" pip install llama-cpp-python --no-cache-dir --force-reinstall --upgrade  # install llamacpp with cuda

```

Mixedbread Embedding Model - [HuggingFace](https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1). Save this model in ai/embedding/models/

Llama3 8B Instruct Language Model - [NousResearch/Meta-Llama-3-8B-Instruct](https://huggingface.co/NousResearch/Meta-Llama-3-8B-Instruct/blob/8b0a6849330505a2f855b934ae3ce8c3e8c7ed42/Meta-Llama-3-8B-Instruct-Q5_K_M.gguf). Save this model in ai/llm/models

Make sure you have necessary models specified in `config.json` in the respective folders and environment variables set in `.env` file. Then,

```
python3 app.py
```
