from flask import Blueprint, jsonify, request
from models.appointments import Appointment
from db import get_db
from psycopg2.extras import RealDictCursor


bp = Blueprint("appointments", __name__)


from datetime import datetime

@bp.route("/add_appointment", methods=["POST"])
def add_appointment():
    db = get_db()
    cursor = db.cursor()
    if request.method == "POST":
        try:
            data = request.get_json()
            doctor_id = data.get("doctor_id")
            date_time_str = data.get("date")  
            status = "scedual" 

            date_time_format = '%Y-%m-%dT%H:%M:%S'
            date_time = datetime.strptime(date_time_str, date_time_format)
   
            appointment = Appointment(date_time=date_time,
                                      doctor_id=doctor_id,
                                      status=status)

            print(appointment)

        
            if appointment.add_open_appointment_for_doctor(cursor): 
                print("added appointment")
                db.commit()
                return jsonify({'message': 'Added successful'}), 200
            else:
                print("faile")
                db.rollback()
                return jsonify({'message': 'Failed to Add appointment'}), 500

        except Exception as e:
            print(e)
            return f"Failed to add appointment: {str(e)}", 500
    else:
        return "Method not allowed", 405
    
@bp.route("/check_appointment", methods=['GET'])
def check_appointment():
    appointment_date_str = request.args.get('date')
    date_time_format = '%Y-%m-%dT%H:%M:%S'
    date_time = datetime.strptime(appointment_date_str, date_time_format)

    doctor_id = request.args.get('doctor_id')
    print("Appointment",date_time)
    print("doctor id",doctor_id)
    db = get_db()
    cursor = db.cursor()

    exists = Appointment.check_appointment_exists(date_time,doctor_id, cursor)
    print(exists)
    return jsonify({'exists': exists}), 200


@bp.route("/get_appointments", methods=['GET'])
def get_appointments():
    doctor_id = request.args.get("doctor_id")

    print("doctor id:", doctor_id)

    if doctor_id is None:
        return jsonify({"error": "doctor_id parameter is required"}), 400

    db = get_db()
    cursor = db.cursor(cursor_factory=RealDictCursor)
    appointments = Appointment.get_appointment_by_doctor_id(cursor, doctor_id)

    return jsonify(appointments), 200


