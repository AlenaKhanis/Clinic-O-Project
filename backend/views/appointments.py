from flask import Blueprint, Response, jsonify, request
from models.appointments import Appointment
from db import get_db
from psycopg2.extras import RealDictCursor
from datetime import datetime


bp = Blueprint("appointments", __name__)

@bp.route("/add_appointment", methods=["POST"]) 
def add_appointment()-> Response:
    db = get_db()
    cursor = db.cursor()
    if request.method == "POST":
        try:
            data = request.get_json()
            doctor_id = data.get("doctor_id")
            datetime_str = data.get("datetime")
            status = "open" 

            datetime_object = datetime.fromisoformat(datetime_str)
   
            appointment = Appointment(date_time=datetime_object,  
                                      doctor_id=doctor_id,
                                      status=status)
        
            if appointment.add_open_appointment_for_doctor(cursor): 
                db.commit()
                return jsonify({'message': 'Added successful'}), 200
            else:
                db.rollback()
                return jsonify({'message': 'Failed to Add appointment'}), 500

        except Exception as e:
            print(e)
            return f"Failed to add appointment: {str(e)}", 500
    else:
        return "Method not allowed", 405

@bp.route("/check_appointment", methods=['GET'])
def check_appointment()-> Response:
    appointment_datetime_str = request.args.get('datetime')
    doctor_id = request.args.get('doctor_id')

    try:
        datetime_obj = datetime.fromisoformat(appointment_datetime_str)

        db = get_db()
        cursor = db.cursor()

        exists = Appointment.check_appointment_exists(datetime_obj, doctor_id, cursor)

        return jsonify({'exists': exists}), 200

    except ValueError as e:
        print(e)
        return jsonify({'error': str(e)}), 400



@bp.route("/get_appointments", methods=['GET'])
def get_appointments() -> dict[Appointment]:
    doctor_id = request.args.get("doctor_id")
    if doctor_id is None:
        return jsonify({"error": "doctor_id is missing"}), 400
    db = get_db()
    cursor = db.cursor(cursor_factory=RealDictCursor)
    appointments = Appointment.get_appointment_by_doctor_id(cursor, doctor_id)

    return jsonify(appointments), 200

@bp.route("/scedual_appointment/<appointment_id>/<patient_id>" , methods = ['POST'])
def scedual_appointment(appointment_id, patient_id) -> Response:
    db = get_db()
    cursor = db.cursor(cursor_factory=RealDictCursor)
   
    if (Appointment.scedual_appointment_for_patient(cursor, appointment_id, patient_id)):
        db.commit()
        return jsonify({'message': "Appointment scheduled successfully."}), 200
    else:
        db.rollback()
        return jsonify({'error': "Appointment is already scheduled."}), 400
    

@bp.route("/get_appointments_by_patient_id/<patient_id>", methods=['GET'])
def get_appointments_by_patient_id(patient_id) -> dict[Appointment]:
    db = get_db()
    cursor = db.cursor(cursor_factory=RealDictCursor)
    appointments = Appointment.get_appointments_by_patient_id(cursor, patient_id)

    return jsonify(appointments), 200

@bp.route("/cancel_appointment/<appointment_id>")
def cancel_appointment(appointment_id) -> Response:
    db = get_db()
    cursor = db.cursor()
    if (Appointment.cancel_appointment(cursor, appointment_id)):
        db.commit()
        return jsonify({'message': "Appointment cancelled successfully."}), 200
    else:
        db.rollback()
        return jsonify({'error': "Appointment is already cancelled."}), 400
    
@bp.route("/history_patient_appointments/<patient_id>")   
def get_history_patient_appointments(patient_id): 
    db = get_db()
    cursor = db.cursor(cursor_factory=RealDictCursor)
    appointments = Appointment.get_history_patient_appointment(cursor, patient_id)

    return jsonify(appointments), 200

@bp.route("/add_summary/<appointment_id>", methods=["POST"])
def add_summary(appointment_id):

    data = request.json 
    summary = data.get('summary')
    diagnosis = data.get('diagnosis')
    prescription = data.get('prescription')

    print("data",data)

    # Perform database operations or other backend processing
    db = get_db()  # Assuming you have a function to get the database connection
    cursor = db.cursor()
    Appointment.add_summary(cursor , summary , diagnosis , prescription, appointment_id)
    db.commit() 
    return jsonify({"message": "Form data received and processed successfully"}), 200

# @bp.route("/get_appointments_history/<doctor_id>")
# def get_appointments_history(doctor_id):
#     db = get_db()
#     cursor = db.cursor(cursor_factory=RealDictCursor)
#     print("doctor id: ",doctor_id)
#     appointments = Appointment.get_appointments_history(cursor, doctor_id)

#     return jsonify(appointments), 200