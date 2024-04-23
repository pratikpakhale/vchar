from langchain_community.vectorstores import FAISS
from langchain_text_splitters import CharacterTextSplitter
from langchain.schema import Document

from embedding import GeminiEmbedding, MixedBreadEmbedding

from utils.config import config
from utils.suppress_log import suppress_stdout_stderr

EMBEDDING_MODEL = config['ai']['embedding_model']

def get_context(query, data):
  documents = [Document(page_content=ctx['text'],metadata={
            'url': ctx['url'],
            'title': ctx['title'],
            'description': ctx['description'],
            'favicon': ctx['favicon'],
        }) for ctx in data]
  with suppress_stdout_stderr():
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=250)
  docs = text_splitter.split_documents(documents)

  if EMBEDDING_MODEL == 'gemini':
    embeddings = GeminiEmbedding()
  else:
    embeddings = MixedBreadEmbedding()
  
  db = FAISS.from_documents(docs, embeddings)
  retriever = db.as_retriever()

  context_docs = retriever.invoke(query)

  return [{
            'text': d.page_content,
            'url': d.metadata['url'],
            'title': d.metadata['title'],
            'description': d.metadata['description'],
            'favicon': d.metadata['favicon'],

        } for d in context_docs]