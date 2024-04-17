import json
from langchain_core.pydantic_v1 import  create_model, BaseModel


type_mapping = {
    'str': str,
    'int': int,
    'list': list,
    'dict': dict,
}

def json_to_pydantic(schema):
    schema = json.loads(schema)

    schema_generated = {}
    for key in schema:
        type_name = schema[key]['type']
        if type_name in type_mapping:
            t = type_mapping[type_name]
        else:
            raise ValueError("Unknown type: {}".format(type_name))
        schema_generated[key] = (t, schema[key]['value'])

    model = create_model('model',**schema_generated,__base__=BaseModel)
    return model