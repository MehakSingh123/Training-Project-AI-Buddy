import json
import os
from flask import Flask, jsonify, request, send_file, send_from_directory
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI

# Creates a Flask web application named app.
app = Flask(__name__)

# Sets an environment variable GOOGLE_API_KEY with a specified API key.
os.environ["GOOGLE_API_KEY"] = "WRITE_YOUR_OWN_API" 

# Defines a route for the home page (/) that sends the index.html file from the web directory.
@app.route('/')
def home():
    return send_file('web/index.html')

# Defines a route for the /api/generate endpoint that accepts POST requests.
@app.route("/api/generate", methods=["POST"])
def generate_api():
    if request.method == "POST":
        try:
            req_body = request.get_json()  # Get the JSON body of the request
            content = req_body.get("contents")  # Extract content from the JSON
            model_name = req_body.get("model")  # Extract model name from the JSON

            # Create a ChatGoogleGenerativeAI model instance
            model = ChatGoogleGenerativeAI(model=model_name)
            message = HumanMessage(content=content)  # Create a HumanMessage instance

            # Stream the model's response in chunks
            response = model.stream([message])

            def stream():
                for chunk in response:
                    yield f'data: {json.dumps({"text": chunk.content})}\n\n'  # Send each chunk as a JSON event stream

            return app.response_class(stream(), content_type='text/event-stream')  # Return the streaming response

        except Exception as e:
            return jsonify({"error": str(e)})  # Return a JSON response with the error message

# Defines a route to serve static files from the web directory for any given path.
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('web', path)  # Serve files from the 'web' directory

# If the script is run directly, it starts the Flask app in debug mode.
if __name__ == '__main__':
    app.run(debug=True)
