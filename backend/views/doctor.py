from flask import Blueprint, jsonify
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

@bp.route('/get_doctors_by_specialty/<specialty>')
def get_doctors_by_specialty(specialty):
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        doctors = Doctor.get_doctors_by_specialty(cursor, specialty)
        return jsonify({"doctors": doctors}), 200 # TODO: return not dict.
    except Exception as e:
        return jsonify({"error": "An error occurred while retrieving doctors."}), 500

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

