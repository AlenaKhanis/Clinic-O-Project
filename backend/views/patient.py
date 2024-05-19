from flask import Blueprint, jsonify, request
from db import get_db
from models.patient import Patient
from psycopg2.extras import RealDictCursor

bp = Blueprint("patient", __name__)

@bp.route("/get_patient_by_id/<int:patient_id>", methods=['GET'])
def get_patient_by_id(patient_id):
    try:
        print("patient_id", patient_id)
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
