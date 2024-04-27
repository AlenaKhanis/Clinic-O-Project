from flask import Blueprint, jsonify, request
from models.appointments import Appointment
from db import get_db
from psycopg2.extras import RealDictCursor
from datetime import datetime


bp = Blueprint("appointments", __name__)

#TODO:  add to appointment data sumery , written prescriptions ,  written diagnoses

@bp.route("/add_appointment", methods=["POST"])
def add_appointment():
    db = get_db()
    cursor = db.cursor()
    if request.method == "POST":
        try:
            data = request.get_json()
            doctor_id = data.get("doctor_id")
            date_str = data.get("date")
            time_str = data.get("time")
            status = "open" 

            time_format = "%H:%M"
            time = datetime.strptime(time_str, time_format)
            date_format = '%Y-%m-%d'
            date = datetime.strptime(date_str, date_format)
   
            appointment = Appointment(date=date,
                                      time=time,
                                      doctor_id=doctor_id,
                                      status=status)
        
            if appointment.add_open_appointment_for_doctor(cursor): 
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
    appointment_time_str = request.args.get('time')
    doctor_id = request.args.get('doctor_id')

    try:
        date_format = '%Y-%m-%d'
        time_format = '%H:%M:%S'

        appointment_date = datetime.strptime(appointment_date_str, date_format)
        appointment_time = datetime.strptime(appointment_time_str, time_format)


        db = get_db()
        cursor = db.cursor()

        exists = Appointment.check_appointment_exists(appointment_date,appointment_time, doctor_id, cursor)

        return jsonify({'exists': exists}), 200

    except ValueError as e:
        print(e)
        return jsonify({'error': str(e)}), 400


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


