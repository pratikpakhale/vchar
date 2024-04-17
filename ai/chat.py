from langchain_core.output_parsers import JsonOutputParser

from utils.schema import json_to_pydantic
from utils.preprocess import extract_json
from utils.suppress_log import suppress_stdout_stderr
from llm import AnthropicClaudeLLM, GeminiLLM, LlamaLLM

from templates.default_prompt import default_prompt_template

def generate(query, context, schema, language_model='llama'):
  try:
    with suppress_stdout_stderr():
      if language_model == 'claude':
        llm = AnthropicClaudeLLM()
      elif language_model == 'gemini':
        llm = GeminiLLM()
      else:
        llm = LlamaLLM()

    pydantic_object = json_to_pydantic(schema)
    
    parser = JsonOutputParser(pydantic_object=pydantic_object)

    schema_instructions = parser.get_format_instructions()

    prompt = default_prompt_template.safe_substitute(query=query, schema_instructions=schema_instructions, context=context)

    print("------------------------------------------------")
    print(prompt)
    print("------------------------------------------------")

    with suppress_stdout_stderr():
      response = llm.invoke(prompt)

    print("language model response",response)

    if language_model == 'gemini':
      response = response.content

    json = extract_json(response)

    return json

  except Exception as e:
    raise e
    return str(e)

