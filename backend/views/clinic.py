from flask import Blueprint, Response, jsonify, request
from models.clinic import Clinic
from db import get_db
from psycopg2 import Error
from psycopg2.extras import RealDictCursor

bp = Blueprint("clinic", __name__)

@bp.route("/clinic_details", methods=["GET"])
def clinic_details() -> Response:
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT * FROM clinic;")
        clinic_data = cursor.fetchone()

        if clinic_data:
            return jsonify(clinic_data), 200
        else:
            return jsonify({"error": "Clinic details not found"}), 404
    
    except Error as e:
        return jsonify({"error": f"Database error occurred: {str(e)}"}), 500
    
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@bp.route("/update_clinic", methods=["POST"])
def update_clinic() -> Response:
    try:
        data = request.json
        value = data.get('value')
        field = data.get('field')

        if not value or not field:
            return jsonify({"error": "Both 'value' and 'field' must be provided in JSON data"}), 400

        db = get_db()
        cursor = db.cursor()

        if field in ['clinic_name', 'clinic_address', 'clinic_phone']:
            Clinic.update_clinic_details(cursor, {field: value})
            db.commit()
            return jsonify({"message": "Clinic details updated successfully"}), 200
        else:
            return jsonify({"error": f"Field '{field}' is not allowed for update"}), 400
    
    except Error as e:
        db.rollback()
        return jsonify({"error": f"Database error occurred: {str(e)}"}), 500
    
    except Exception as e:
        db.rollback()
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
