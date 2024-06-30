from datetime import datetime

import bcrypt
from flask import Blueprint, jsonify, request
from psycopg2.extras import RealDictCursor

from db.db import get_db
from models.doctor import Doctor
from models.patient import Patient
from models.users import User

bp = Blueprint("users", __name__)

@bp.route('/check-username', methods=['GET'])
def check_username():
    """
    Check if a username exists in the database.
    """
    username = request.args.get('username')
    db = get_db()
    cursor = db.cursor()

    if User.check_username_exists(username, cursor):
        return jsonify({'exists': True}), 200
    else:
        return jsonify({'exists': False}), 200
    
@bp.route('/delete_user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    """
    Delete a user from the database by user ID.
    """
    try:
        db = get_db()
        cursor = db.cursor()
        result = User.delete_user(cursor, user_id)
        db.commit()
        return jsonify({"message": result}), 200
    except Exception as e:
        db.rollback()
        return jsonify({"error": f"An error occurred while deleting the user: {str(e)}"}), 500
    finally:
        cursor.close()

@bp.route('/edit_user_profile/<user_id>', methods=['POST'])
def edit_user_profile_route(user_id):
    """
    Update user profile details in the database.
    """
    db = get_db()
    cursor = db.cursor()

    updated_data = request.json
    try:
        user = User.get_user(cursor, user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        updated_fields = {}
        for field, value in updated_data.items():
            updated_data = User.edit_user_profile(cursor, user_id, field, value)
            
            if not updated_data:
                db.rollback()
                return jsonify({'error': f"Error updating user profile: {updated_data}"}), 500
            
            updated_fields[field] = value

        db.commit()
        return jsonify({'updated_fields': updated_fields}), 200

    except KeyError as e:
        return jsonify({'error': f'Missing key in request data: {str(e)}'}), 400

    except ValueError as e:
        return jsonify({'error': f'Invalid value: {str(e)}'}), 400

    except Exception as e:
        db.rollback()
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500
    
@bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user in the system.
    """
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    full_name = data.get('fullName')
    role = data.get('role', 'patient')
    phone = data.get('phone')
    birthday = data.get('birthday')

    # Calculate age from birthday
    def calculate_age(born):
        today = datetime.today()
        return today.year - born.year - ((today.month, today.day) < (born.month, born.day))
    
    try:
        age = calculate_age(datetime.strptime(birthday, '%Y-%m-%d'))
    except ValueError as e:
        return jsonify({'error': f'Invalid birthday format: {str(e)}'}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    db = get_db()
    cursor = db.cursor(cursor_factory=RealDictCursor)

    try:
        user = User(
            username=username,
            password=hashed_password,
            email=email,
            full_name=full_name,
            role=role,
            phone=phone,
            age=age,
            created_date=datetime.now(),
            updated_date=datetime.now()
        )

        user_id = user.add_user(cursor)

        if not user_id:
            db.rollback()
            return jsonify({'message': 'Failed to register user'}), 500

        if role == 'patient':
            package = data.get('package')
            patient = Patient(
                patient_id=user_id,
                package=package,
                username=username
            )

            if not patient.add_patient(cursor):
                db.rollback()
                return jsonify({'message': 'Failed to register patient'}), 500

        elif role == 'doctor':
            specialty = data.get('specialty')
            doctor = Doctor(
                doctor_id=user_id,
                specialty=specialty,
                username=username
            )

            if not doctor.add_doctor(cursor):
                db.rollback()
                return jsonify({'message': 'Failed to add doctor'}), 500

        db.commit()
        return jsonify({'message': 'Registration successful'}), 200
    
    except KeyError as e:
        return jsonify({'error': f'Missing key in request data: {str(e)}'}), 400
    
    except ValueError as e:
        return jsonify({'error': f'Invalid value: {str(e)}'}), 400
    
    except Exception as e:
        db.rollback()
        return jsonify({'error': f'Unexpected error occurred while inserting user: {str(e)}'}), 500
