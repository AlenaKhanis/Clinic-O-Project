from flask import Blueprint, jsonify, request, Response
from db import get_db
from models.patient import Patient
from psycopg2.extras import RealDictCursor

bp = Blueprint("patient", __name__)

@bp.route("/get_patient_by_id/<int:patient_id>", methods=['GET'])
def get_patient_by_id(patient_id: int) -> Response:
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        
        patient = Patient.get_patient(cursor, patient_id)
        
        if patient:
            return jsonify(patient), 200
        else:
            return jsonify({"error": f"Patient with ID {patient_id} not found."}), 404
    
    except Exception as e:
        return jsonify({"error": f"An error occurred while retrieving the patient: {str(e)}"}), 500

@bp.route('/get_patient_doctors/<int:patient_id>', methods=['GET'])
def get_patient_doctors(patient_id: int) -> Response:
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        
        doctors = Patient.get_patient_doctors(cursor, patient_id)
        
        if doctors:
            return jsonify(doctors), 200
        else:
            return jsonify({"error": f"No doctors found for patient with ID {patient_id}."}), 404
    
    except Exception as e:
        return jsonify({"error": f"An error occurred while retrieving doctors for patient: {str(e)}"}), 500

@bp.route('/get_patients', methods=['GET'])
def get_all_patients() -> Response:
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        
        patients = Patient.get_all_patients(cursor)
        
        if patients:
            return jsonify(patients), 200
        else:
            return jsonify({"error": "No patients found."}), 404
    
    except Exception as e:
        return jsonify({"error": f"An error occurred while retrieving patients: {str(e)}"}), 500
