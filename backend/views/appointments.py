from flask import Blueprint, Response, jsonify, request
from models.appointments import Appointment
from db import get_db
from psycopg2.extras import RealDictCursor
from datetime import datetime

bp = Blueprint("appointments", __name__)

@bp.route("/add_appointment", methods=["POST"])
def add_appointment() -> Response:
    """
    Endpoint to add a new appointment.
    Expects JSON data with 'doctor_id' and 'datetime'.
    """
    db = get_db()
    cursor = db.cursor()
    try:
        data = request.get_json()
        doctor_id = data.get("doctor_id")
        datetime_str = data.get("datetime")
        
        datetime_object = datetime.fromisoformat(datetime_str)

        appointment = Appointment(date_time=datetime_object,
                                  doctor_id=doctor_id,
                                  status="open")

        appointment.add_open_appointment_for_doctor(cursor)
        db.commit()
        return jsonify({'message': 'Appointment added successfully'}), 200

    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route("/check_appointment", methods=['GET'])
def check_appointment() -> Response:
    """
    Endpoint to check if an appointment exists for a given datetime and doctor_id.
    Expects query parameters 'datetime' (ISO format) and 'doctor_id'.
    """
    appointment_datetime_str = request.args.get('datetime')
    doctor_id = request.args.get('doctor_id')

    try:
        datetime_obj = datetime.fromisoformat(appointment_datetime_str)

        db = get_db()
        cursor = db.cursor()

        exists = Appointment.check_appointment_exists(datetime_obj, doctor_id, cursor)

        return jsonify({'exists': exists}), 200

    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@bp.route("/get_appointments/<doctor_id>", methods=['GET'])
def get_appointments(doctor_id) -> Response:
    """
    Endpoint to retrieve appointments for a specific doctor.
    """
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        
        appointments = Appointment.get_appointment_by_doctor_id(cursor, doctor_id)

        return jsonify(appointments), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/schedule_appointment/<appointment_id>/<patient_id>', methods=['POST'])
def schedule_appointment(appointment_id, patient_id) -> Response:
    """
    Endpoint to schedule an appointment for a patient.
    Expects 'appointment_id' and 'patient_id' as URL parameters.
    """
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)

        if Appointment.schedule_appointment_for_patient(cursor, appointment_id, patient_id):
            db.commit()
            return jsonify({'message': "Appointment scheduled successfully."}), 200
        else:
            return jsonify({'error': "Appointment is already scheduled."}), 400
        
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route("/get_appointments_by_patient_id/<patient_id>", methods=['GET'])
def get_appointments_by_patient_id(patient_id) -> Response:
    """
    Endpoint to retrieve appointments for a specific patient.
    """
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        appointments = Appointment.get_appointments_by_patient_id(cursor, patient_id)
        return jsonify(appointments), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/cancel_appointment/<appointment_id>', methods=['POST'])
def cancel_appointment(appointment_id) -> Response:
    """
    Endpoint to cancel an appointment by its ID.
    Expects 'appointment_id' as a URL parameter.
    """
    db = get_db()
    cursor = db.cursor()
    if (Appointment.cancel_appointment_by_patient(cursor, appointment_id)):
        db.commit()
        return jsonify({'message': "Appointment cancelled successfully."}), 200
    else:
        db.rollback()
        return jsonify({'error': "Appointment is already cancelled."}), 400
    
@bp.route("/history_patient_appointments/<patient_id>")
def get_history_patient_appointments(patient_id):
    """
    Endpoint to retrieve historical appointments for a patient.
    """
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
      
        appointments = Appointment.get_history_patient_appointment(cursor, patient_id)

        return jsonify(appointments), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route("/add_summary/<appointment_id>/<patient_id>", methods=["POST"])
def add_summary(appointment_id, patient_id):
    """
    Endpoint to add a summary (diagnosis, prescription) to an appointment by doctor.
    Expects JSON data with 'summary', 'diagnosis', and 'prescription'.
    """
    try:
        data = request.json
        summary = data.get('summary')
        diagnosis = data.get('diagnosis')
        prescription = data.get('prescription')
        
        db = get_db()  # Assuming get_db() function returns a database connection
        cursor = db.cursor()

        # Call the class method to update the appointment and patient
        success = Appointment.add_summary(cursor, summary, diagnosis, prescription, appointment_id, patient_id)
        
        if success:
            db.commit()
            return jsonify({"message": "Form data received and processed successfully"}), 200
        else:
            db.rollback()
            return jsonify({'error': 'Failed to update appointment and patient records'}), 500

    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route("/get_appointments_history/<doctor_id>")
def get_appointments_history(doctor_id):
    """
    Endpoint to retrieve appointment history for a doctor.
    """
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        appointments = Appointment.get_appointments_history(cursor, doctor_id)
        
        return jsonify(appointments), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route("/get_appointment_by_id/<appointment_id>")
def get_appointment_by_id(appointment_id):
    """
    Endpoint to retrieve an appointment by its ID.
    """
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        appointment = Appointment.get_appointment_by_id(cursor, appointment_id)
        return jsonify(appointment), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route("/get_all_appt")    
def get_all_appt():
    """
    Endpoint to retrieve all appointments.
    """
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        appointments = Appointment.get_all_appt(cursor)
        return jsonify(appointments), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
