from flask import Blueprint, jsonify, request
from db import get_db
from models.patient import Patient
from psycopg2.extras import RealDictCursor

bp = Blueprint("patient", __name__)

@bp.route("/get_petient_by_id/<int:patient_id>", methods=['GET'])
def get_patient_by_id(patient_id):
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        patient = Patient.get_patient(cursor ,patient_id)

        return patient
    except Exception as e:
        print(e)
        return {"error": "something went wrong"}