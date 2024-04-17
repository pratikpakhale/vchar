from flask import Flask, jsonify, request
from chat import generate
from utils.config import config

app = Flask(__name__)

@app.route('/generate_response', methods=['POST'])
def generate_response():
    data = request.json
    
    prompt=data['prompt'] 
    context = data['context'] 
    schema = data['schema'] 

    # example_schema = {
    #     'contributions': {
    #         'type': 'str',
    #         'value': 'what are contributions of elon musk ?'
    #     },
    # }
    
    response = generate(query = prompt, context = context, schema=schema)

    # print(response)
    return jsonify(response)
if __name__ == '__main__':
    app.run(debug=True, port=config['ai']['port'])
