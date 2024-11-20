from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow all origins to access the backend

@app.route("/api/grants", methods=["GET"])
def get_grants():
    data = [
        {"title": "Grant 1", "description": "Description for Grant 1"},
        {"title": "Grant 2", "description": "Description for Grant 2"},
        {"title": "Grant 3", "description": "Description for Grant 3"},
    ]
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
