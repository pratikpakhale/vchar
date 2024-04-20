import json
import re

def extract_json(input_string):
    if isinstance(input_string, dict):
        return input_string

    try:
        return json.loads(input_string)
    except:
        json_matches = re.findall(r'{(?:[^{}\\]|\\.)*}', input_string)
        if json_matches:
            return json.loads(json_matches[0])

    
    return None