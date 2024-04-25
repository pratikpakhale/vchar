from flask import Flask, jsonify, request
from chat import generate
from retrieval import get_context
from utils.config import config
    
app = Flask(__name__)

@app.route('/generate_response', methods=['POST'])
def generate_response():
    data = request.json
    
    prompt=data['prompt'] 
    context = data['context'] 
    schema = data['schema']
    
    response = generate(query = prompt, context = context, schema=schema, )

    return jsonify(response)

@app.route('/get_context', methods=['POST'])
def get_context_docs():
    data = request.json
    context = data['context']
    query = data['query']

    context_filtered = []

    for ctx in context:
        try:
            text = ctx['text'] 
            url = ctx['url']
            title = ctx['title']
            description = ctx['description']
            favicon = ctx['favicon']
            context_filtered.append({'text': text, 'url': url,'title': title,'description': description, 'favicon': favicon })
        except:
            pass

    docs = get_context(query, context_filtered)
    return jsonify(docs)

if __name__ == '__main__':
    app.run(debug=True, port=config['ai']['port'], host="0.0.0.0")
