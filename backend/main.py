from pathlib import Path
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, get_jwt, get_jwt_identity, jwt_required
from psycopg2.extras import RealDictCursor
from db import get_db, close_db
from flask_cors import CORS

# from models.users import User
from models.patient import Patient
from models.doctor import Doctor
# from models.owner import Owner

# from views.users import bp as users_bp
# from views.owner import bp as products_bp
# from views.patient import bp as carts_bp
# from views.doctor import bp as doctors_bp



app = Flask(__name__)
app.config.from_prefixed_env()
FRONTEND_URL = app.config.get("FRONTEND_URL")
cors = CORS(app, origins=FRONTEND_URL, methods=["GET", "POST", "DELETE"])
print(FRONTEND_URL)
jwt = JWTManager(app)
app.teardown_appcontext(close_db)
# app.register_blueprint(users_bp)
# app.register_blueprint(products_bp)
# app.register_blueprint(carts_bp)





@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    db = get_db()
    cursor = db.cursor(cursor_factory=RealDictCursor)  

    cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (data["username"], data["password"]))
    user = cursor.fetchone()
    
    if user:
        access_token = create_access_token(identity=user["id"])
        return {"access_token": access_token} 
    else:
       return {"error": "Invalid username or password"}

@app.route('/get_user', methods=['GET'])
@jwt_required()
def get_user():
    db = get_db()
    cursor = db.cursor(cursor_factory=RealDictCursor)
    current_user_id = get_jwt_identity()

    user_data = Doctor.get_doctor(cursor, current_user_id)
    if user_data:

        return jsonify(user_data), 200
    else:
        user_data = Patient.get_patient(cursor, current_user_id)
        if user_data:
            return jsonify(user_data), 200
        else:
            return jsonify({'message': 'User not found'}), 404


   