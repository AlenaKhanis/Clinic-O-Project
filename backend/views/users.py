from flask import Blueprint, jsonify, request
from models.doctor import Doctor
from db import get_db
import bcrypt
from models.users import User
from models.patient import Patient



bp = Blueprint("users", __name__)

@bp.route('/check-username', methods=['GET'])
def check_username():
    username = request.args.get('username')
    db = get_db()
    cursor = db.cursor()

    if User.check_username_exists(username , cursor):
        return jsonify({'exists': True}), 200
    else:
        return jsonify({'exists': False}), 200

    

@bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    full_name = data.get('fullName')
    role = data.get('role', 'patient') 

    db = get_db()
    cursor = db.cursor()

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    user = User(username=username,
                password=hashed_password,
                email=email,
                full_name=full_name,
                role=role)

    user_id = user.add_user(cursor)

    if user_id:
        if role == 'patient':
            package = data.get('package')
            patient = Patient(patient_id=user_id,
                              package=package,
                              username=username
                             )

            if patient.add_patient(cursor):
                db.commit()
                return jsonify({'message': 'Registration successful'}), 200
            else:
                db.rollback()
                return jsonify({'message': 'Failed to register patient'}), 500
        
        elif role == 'doctor':
            specialty = data.get('specialty')
            doctor = Doctor(doctor_id=user_id,
                            specialty=specialty,
                            username=username
                           )

            if doctor.add_doctor(cursor):
                db.commit()
                return jsonify({'message': 'Doctor added successfully'}), 200
            else:
                db.rollback()
                return jsonify({'message': 'Failed to add doctor'}), 500

    else:
        db.rollback()
        return jsonify({'message': 'Failed to register user'}), 500



