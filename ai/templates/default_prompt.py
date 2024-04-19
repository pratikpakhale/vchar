from string import Template

default_prompt_template = Template("""System: Answer the user query based on the context provided. If context is provided, make sure to fully utilize it and provide the most relevant answer. If context is NOT provided, answer the query based on your knowledge as a LLM and understanding of the query. Answer as if you are a human and you know the context already.

User Query : $query

Context: $context
                                   
Strictly respond ONLY in JSON Format
$schema_instructions""")
