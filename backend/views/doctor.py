from flask import Blueprint, jsonify, request
from models.users import User
from db import get_db
from models.doctor import Doctor
from psycopg2.extras import RealDictCursor



bp = Blueprint("doctors", __name__)


@bp.route('/get_specialties')
def get_specialetys():
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("SELECT specialty FROM doctors")
        specialtys = cursor.fetchall()

        specialtys = [specialty[0] for specialty in specialtys] # ----------
        return jsonify({"specialtys": specialtys}) # TODO: return not dict.
    except Exception as e:
        print(e)
        return {"error": "Error getting specialtys"}

@bp.route('/get_doctors_by_Id/<doctor_id>')
def get_doctors_by_Id(doctor_id):
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        doctor = Doctor.get_doctor(cursor, doctor_id)
        if doctor:
            return jsonify(doctor), 200
        else:
            return jsonify({"error": "Doctor not found."}), 404
    except Exception as e:

        return jsonify({"error": "An error occurred while retrieving the doctor."}), 500


@bp.route('/edit_doctor_profile/<doctor_id>', methods=['POST'])
def edit_doctor_user_profile(doctor_id):
    try:
        value = request.json.get('value')
        field = request.json.get('field')
        db = get_db()
        cursor = db.cursor()
        
        if field in ['full_name', 'email', 'phone']:
            result = User.edit_doctor_user_profile(cursor, doctor_id, field, value)
            db.commit()  
            return jsonify(result), 200
        else:
            return jsonify({"error": "Invalid field."}), 400
    except Exception as e:

        return jsonify({"error": f"An error occurred while editing the doctor's profile: {e}"}), 500



@bp.route('/get_doctor_patients/<doctor_id>')
def get_doctor_patients(doctor_id):
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        patients = Doctor.get_doctor_patient(cursor, doctor_id)
        return jsonify(patients), 200
    except Exception as e:
        return jsonify({"error": "An error occurred while retrieving patients."}), 500

@bp.route('/get_doctor/by_name/<doctor_name>')
def get_doctor_by_name(doctor_name):
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        doctor = Doctor.get_doctor_by_name(cursor, doctor_name)
        return jsonify({"doctors": doctor}), 200
    except Exception as e:
        return jsonify({"error": "An error occurred while retrieving the doctor."}), 500

@bp.route('/get_doctor/by_specialty/<specialty>')
def get_doctor_by_specialty(specialty):
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        doctor = Doctor.get_doctor_by_specialty(cursor, specialty)
        return jsonify({"doctors": doctor}), 200
    except Exception as e:
        return jsonify({"error": "An error occurred while retrieving the doctor."}), 500    
    
@bp.route('/doctors') 
def get_doctors():
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        doctors = Doctor.get_doctors(cursor)
        return jsonify(doctors), 200
    except Exception as e:
        return jsonify({"error": "An error occurred while retrieving the doctors."}), 500   