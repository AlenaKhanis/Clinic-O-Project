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
        # Convert the fetched data to a list of strings
        specialtys = [specialty[0] for specialty in specialtys]
        # Return JSON response
        return jsonify({"specialtys": specialtys})
    except Exception as e:
        print(e)
        return {"error": "Error getting specialtys"}

@bp.route('/get_doctors_by_specialty/<specialty>')
def get_doctors_by_specialty(specialty):
    db = get_db()
    cursor = db.cursor(cursor_factory=RealDictCursor)
    doctors = Doctor.get_doctors_by_specialty(cursor, specialty)
    return jsonify({"doctors": doctors})

@bp.route('/get_doctors_by_Id/<doctor_id>')
def get_doctors_by_Id(doctor_id):
    db = get_db()
    cursor = db.cursor(cursor_factory=RealDictCursor)
    doctor = Doctor.get_doctor(cursor, doctor_id)
    return jsonify(doctor)

