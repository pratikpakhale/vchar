import os
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

from langchain_anthropic import ChatAnthropic

from utils.config import config

MODELS = {
  'haiku': "claude-3-haiku-20240307",
  'sonnet': "claude-3-sonnet-20240229",
  'opus': 'claude-3-opus-20240229'
}

if config['ai']['claude_model']:
  MODEL = config['ai']['claude_model']
else:
  MODEL = 'sonnet'

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

def AnthropicClaudeLLM():
  llm = ChatAnthropic(model=MODELS[MODEL], anthropic_api_key=ANTHROPIC_API_KEY)
  return llm