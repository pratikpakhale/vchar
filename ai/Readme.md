# Setup and Run

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

CMAKE_ARGS="-DLLAMA_CUDA=on" pip install llama-cpp-python --no-cache-dir --force-reinstall --upgrade  # install llamacpp with cuda

```

```
python3 app.py
```
