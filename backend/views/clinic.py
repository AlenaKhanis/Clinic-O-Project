from flask import Blueprint, Response, jsonify, request
from models.clinic import Clinic
from models.appointments import Appointment
from db import get_db
from psycopg2.extras import RealDictCursor
from datetime import datetime


bp = Blueprint("clinic", __name__)

@bp.route("/clinic_details", methods=["GEt"])
def clinic_details() -> Response:
    db = get_db()
    cursor = db.cursor(cursor_factory=RealDictCursor)
    cursor.execute("""
        SELECT * FROM clinic;
        """)
    clinic_data = cursor.fetchone()
    return jsonify(clinic_data), 200


@bp.route("/update_clinic", methods=["POST"])
def update_clinic() -> Response:
    try:
        value = request.json.get('value')
        field = request.json.get('field')

        db = get_db()
        cursor = db.cursor()
        if field in ['clinic_name', 'clinic_address', 'clinic_phone']:
            Clinic().update_clinic_details(cursor, {field : value})
            db.commit()
            return jsonify({"message": "Clinic details updated successfully"}), 200
        else:
            return jsonify({"message": f"Field {field} is not allowed"}), 400
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500