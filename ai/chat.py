from langchain_core.output_parsers import JsonOutputParser

from utils.schema import json_to_pydantic
from utils.preprocess import extract_json
from utils.suppress_log import suppress_stdout_stderr
from llm import AnthropicClaudeLLM, GeminiLLM, LlamaLLM, GroqLLM

from templates.default_prompt import default_prompt_template

from utils.config import config
LANGUAGE_MODEL = config['ai']['language_model']

def generate(query, context, schema):
  try:
    
    if LANGUAGE_MODEL == 'claude':
      llm = AnthropicClaudeLLM()
    elif LANGUAGE_MODEL == 'gemini':
      llm = GeminiLLM()
    elif LANGUAGE_MODEL == 'groq':
      llm = GroqLLM()
    else:
      llm = LlamaLLM()

    pydantic_object = json_to_pydantic(schema)
    
    parser = JsonOutputParser(pydantic_object=pydantic_object)

    schema_instructions = parser.get_format_instructions()

    prompt = default_prompt_template.safe_substitute(query=query, schema_instructions=schema_instructions, context=context)

    # print("------------------------------------------------")
    # print(prompt)
    # print("------------------------------------------------")

    with suppress_stdout_stderr():
      response = llm.invoke(prompt)

    # print("Language Model Response: \n\n",response)

    try:
      if response.content:
        response = response.content
    except:
      pass
    
    json = extract_json(response)

    # print("JSON Response: \n\n",json)

    return json

  except Exception as e:
    raise e
    return str(e)

