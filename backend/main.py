import os
from pathlib import Path

import bcrypt
import httpx
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (JWTManager, create_access_token,
                                get_jwt_identity, jwt_required)
from psycopg2.extras import RealDictCursor

from db.create_schema import create_schema_and_load_data
from db.db import close_db, get_db
from models.doctor import Doctor
from models.owner import Owner
from models.patient import Patient
from views.appointments import bp as appointments_bp
from views.clinic import bp as clinic_bp
from views.doctor import bp as doctors_bp
from views.owner import bp as owner_bp
from views.patient import bp as patient
from views.users import bp as users_bp

load_dotenv()
app = Flask(__name__)
app.config.from_prefixed_env()
FRONTEND_URL = app.config.get("FRONTEND_URL")
NEWS_API_KEY = os.getenv('NEWS_API_KEY')

cors = CORS(app, origins=FRONTEND_URL, methods=["GET", "POST", "DELETE"])
jwt = JWTManager(app)
app.teardown_appcontext(close_db)
app.register_blueprint(users_bp)
app.register_blueprint(appointments_bp)
app.register_blueprint(patient)
app.register_blueprint(doctors_bp)
app.register_blueprint(owner_bp)
app.register_blueprint(clinic_bp)


with app.app_context():
    create_schema_and_load_data()


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "Invalid request data"}), 400

    db = get_db() 
    cursor = db.cursor(cursor_factory=RealDictCursor)
  
    cursor.execute("SELECT id, role, password FROM users WHERE username = %s", (data["username"],))
    user = cursor.fetchone()

    if user and bcrypt.checkpw(data["password"].encode('utf-8'), user["password"].encode('utf-8')):
        access_token = create_access_token(identity=user["id"], additional_claims={"role": user["role"]})
        return {"access_token": access_token}, 200
    else:
        return {"error": "Invalid username or password"}, 401


@app.route('/get_user', methods=['GET'])
@jwt_required()
def get_user():
    try:
        current_user_id = get_jwt_identity()
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)

      
        cursor.execute("SELECT * FROM users WHERE id = %s", (current_user_id,))
        user_data = cursor.fetchone()
        

        if not user_data:
            return jsonify({'message': 'User not found'}), 404
        
        role = user_data['role']

        if role == 'patient':
            patient_info = Patient.get_patient(cursor, current_user_id)

            if patient_info:
                return jsonify(patient_info), 200
            
        elif role == 'doctor':
            doctor_info = Doctor.get_doctor(cursor, current_user_id)
            if doctor_info:
                return jsonify(doctor_info), 200
            
        elif role == 'owner':
            owner_info = Owner.get_owner(cursor, current_user_id)
            if owner_info:
                return jsonify(owner_info), 200
        else:
            return jsonify({'message': 'Invalid user role'}), 400

        return jsonify({'message': 'User details not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        db.close()


@app.route('/api/news', methods=['GET'])
def get_news():  
    url = 'https://newsapi.org/v2/top-headlines'
    params = {
        'country': 'us',
        'category': 'health',
        'apiKey': NEWS_API_KEY
    }
    response = httpx.get(url, params=params)
    news_data = response.json()
    return news_data



   