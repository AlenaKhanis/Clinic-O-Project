from pathlib import Path
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager
from db import get_db, close_db
from flask_cors import CORS


app = Flask(__name__)
app.config.from_prefixed_env()
FRONTEND_URL = app.config.get("FRONTEND_URL")
cors = CORS(app, origins=FRONTEND_URL, methods=["GET", "POST", "DELETE"])
print(FRONTEND_URL)
jwt = JWTManager(app)
app.teardown_appcontext(close_db)


@app.route('/login', methods=['POST'])
def login():

    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
    user = cursor.fetchone()

    if user:
        # If authentication succeeds, return a success response with an access token
        # Here you might generate and return a JWT token as an access token
        return jsonify({'access_token': 'your_access_token_here'}), 200
    else:
        # If authentication fails, return an error response
        return jsonify({'error': 'Invalid username or password'}), 401



   