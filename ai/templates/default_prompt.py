from string import Template

default_prompt_template = Template("""System: Answer the user query based on (or not) on the context provided, depends on the availibility of context. If context is provided, make sure to fully utilize it and provide the most relevant answer. If context is not provided, answer the query based on your knowledge and understanding of the query. Answer as if you are a human and you know the context already.

User Query : $query

Strictly respond only in JSON format not in md and in the following format instructions -
$schema_instructions

Context: $context""")
