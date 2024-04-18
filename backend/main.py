from pathlib import Path
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, get_jwt, jwt_required
from psycopg2.extras import RealDictCursor
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
    db = get_db()
    cursor = db.cursor(cursor_factory=RealDictCursor)  

    cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (data["username"], data["password"]))
    user = cursor.fetchone()

    if user is None:
        return jsonify({"error": "Username and password are required"}), 400
    else:
       
        user_dict = {
            "id": user["id"],
            "role": user["role"],
            "full_name": user["full_name"]
        }

        access_token = create_access_token(identity=user["id"])
        return jsonify({"access_token": access_token, "user": user_dict}), 200

@app.route("/patient/<user_id>")
@jwt_required()
def get_patient(user_id) -> dict:
    token_data = get_jwt()
    user_id = token_data["sub"]
    db = get_db()
    cursor = db.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT full_name , username, role, email, age FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    if user is None:
        return {"error": "User not found"}
    else:
        return {
            "id": user_id,
            "username": user["username"],
            "role": user["role"],
            "email": user["email"],
            "age": user["age"],
        }
   