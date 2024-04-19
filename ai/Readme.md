# Setup and Run

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

CUDACXX=/usr/local/cuda-12.3/bin/nvcc CMAKE_ARGS="-DLLAMA_CUDA=on -DCMAKE_CUDA_COMPILER=`which nvcc`" pip install llama-cpp-python --no-cache-dir --force-reinstall --upgrade  # install llamacpp with cuda

```

```
python3 app.py
```
