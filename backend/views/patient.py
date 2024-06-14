from flask import Blueprint, jsonify, request
from db import get_db
from models.patient import Patient
from psycopg2.extras import RealDictCursor
from models.users import User

bp = Blueprint("patient", __name__)

@bp.route("/get_patient_by_id/<patient_id>", methods=['GET'])
def get_patient_by_id(patient_id):
    try:

        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        patient = Patient.get_patient(cursor, patient_id)

        if patient:
            return jsonify(patient), 200
        else:
            return jsonify({"error": "Patient not found."}), 404
    except Exception as e:
        print(f"Error in get_patient_by_id: {e}")
        return jsonify({"error": "An error occurred while retrieving the patient."}), 500

@bp.route('/get_patient_doctors/<patient_id>')
def get_patient_doctors(patient_id):
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        patients = Patient.get_patient_doctors(cursor, patient_id)
        return jsonify(patients), 200
    except Exception as e:
        return jsonify({"error": "An error occurred while retrieving patients."}), 500

@bp.route('/get_patients')
def get_all_patients():
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        patients = Patient.get_all_patients(cursor)
        return jsonify(patients), 200
    except Exception as e:
        print(f"Error in get_all_patients: {e}")
        return jsonify({"error": "An error occurred while retrieving patients."}), 500 
    
@bp.route('/edit_patient_profile/<patient_id>', methods=['POST'])
def edit_patient_profile(patient_id):
    db = get_db()
    cursor = db.cursor()

    updated_data = request.json
    doctor = Patient.get_patient(cursor, patient_id)

    if doctor:
        try:
            updated_fields = {}  
            for field, value in updated_data.items():
                User.edit_user_profile(cursor, patient_id, field, value)
                updated_fields[field] = value 
            db.commit()
            return jsonify({'updated_fields': updated_fields})
        except Exception as e:
            db.rollback()  
            return jsonify({'error': f"Error updating doctor profile: {e}"}), 500
    else:
        return jsonify({'error': 'Doctor not found'}), 404    