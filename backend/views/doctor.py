from flask import Blueprint, Response, jsonify, request
from models.users import User
from db import get_db
from models.doctor import Doctor
from psycopg2.extras import RealDictCursor

bp = Blueprint("doctors", __name__)


@bp.route('/get_specialties')
def get_specialties() -> Response:
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("SELECT specialty FROM doctors")
        specialtys = cursor.fetchall()

        specialtys = [specialty[0] for specialty in specialtys] 
        return jsonify({"specialtys": specialtys}) 
    except Exception as e:
        return jsonify({"error": f"Error getting specialties: {str(e)}"}), 500

@bp.route('/get_doctors_by_Id/<doctor_id>')
def get_doctor_by_id(doctor_id: int) -> Response:
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


@bp.route('/get_doctor_patients/<int:doctor_id>')
def get_doctor_patients(doctor_id: int) -> Response:
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        patients = Doctor.get_doctor_patients(cursor, doctor_id)
        return jsonify(patients), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred while retrieving patients for doctor: {str(e)}"}), 500

@bp.route('/get_doctor/by_name/<string:doctor_name>')
def get_doctor_by_name(doctor_name: str) -> Response:
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        doctors = Doctor.get_doctor_by_name(cursor, doctor_name)
        return jsonify({"doctors": doctors}), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred while retrieving doctors by name: {str(e)}"}), 500
    

@bp.route('/get_doctor/by_specialty/<string:specialty>')
def get_doctor_by_specialty(specialty: str) -> Response:
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        doctors = Doctor.get_doctor_by_specialty(cursor, specialty)
        return jsonify({"doctors": doctors}), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred while retrieving doctors by specialty: {str(e)}"}), 500
    
@bp.route('/doctors')
def get_doctors() -> Response:
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        doctors = Doctor.get_doctors(cursor)
        return jsonify(doctors), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred while retrieving doctors: {str(e)}"}), 500 

