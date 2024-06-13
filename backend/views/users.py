from flask import Blueprint, jsonify, request
from models.doctor import Doctor
from db import get_db
import bcrypt
from models.users import User
from models.patient import Patient



bp = Blueprint("users", __name__)

@bp.route('/check-username', methods=['GET'])
def check_username():
    username = request.args.get('username')
    db = get_db()
    cursor = db.cursor()

    if User.check_username_exists(username , cursor):
        return jsonify({'exists': True}), 200
    else:
        return jsonify({'exists': False}), 200

    
from datetime import datetime

@bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    full_name = data.get('fullName')
    role = data.get('role', 'patient')
    phone = data.get('phone')
    birthday = data.get('birthday')
    
    print(role)
    # Calculate age from birthday
    def calculate_age(born):
        today = datetime.today()
        return today.year - born.year - ((today.month, today.day) < (born.month, born.day))
    
    age = calculate_age(datetime.strptime(birthday, '%Y-%m-%d'))
    

    db = get_db()
    cursor = db.cursor()

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    user = User(username=username,
                password=hashed_password,
                email=email,
                full_name=full_name,
                role=role,
                phone=phone,
                age=age)

    user_id = user.add_user(cursor)

    if user_id:
        if role == 'patient':
            package = data.get('package')
            patient = Patient(patient_id=user_id,
                              package=package,
                              username=username
                             )

            if patient.add_patient(cursor):
                db.commit()
                return jsonify({'message': 'Registration successful'}), 200
            else:
                db.rollback()
                return jsonify({'message': 'Failed to register patient'}), 500
        
        elif role == 'doctor':
            specialty = data.get('specialty')
            doctor = Doctor(doctor_id=user_id,
                            specialty=specialty,
                            username=username
                           )

            if doctor.add_doctor(cursor):
                db.commit()
                return jsonify({'message': 'Doctor added successfully'}), 200
            else:
                db.rollback()
                return jsonify({'message': 'Failed to add doctor'}), 500

    else:
        db.rollback()
        return jsonify({'message': 'Failed to register user'}), 500
    
@bp.route('/delete_user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        db = get_db()
        cursor = db.cursor()
        result = User.delete_user(cursor, user_id )
        db.commit()
        return jsonify({"message": result}), 200
    except Exception as e:
        db.rollback()
        return jsonify({"error": f"An error occurred while deleting the doctor: {str(e)}"}), 500
    finally:
        cursor.close()   



# @bp.route("/verify_password", methods=["POST"])
# def verify_password():
#     data = request.get_json()
#     current_password = data.get("currentPassword")
#     username = data.get("username")

#     db = get_db()
#     cursor = db.cursor()

#     # Retrieve the hashed password from the database
#     cursor.execute("SELECT hashed_password FROM users WHERE username = ?", (username,))
#     user_data = cursor.fetchone()

#     if user_data:
#         hashed_password = user_data[0]

#         # Check if the provided password matches the hashed password
#         if bcrypt.checkpw(current_password.encode('utf-8'), hashed_password.encode('utf-8')):
#             return jsonify({"message": "Password verification successful"}), 200
#         else:
#             return jsonify({"error": "Incorrect username or password"}), 401
#     else:
#         return jsonify({"error": "User not found"}), 404

# @bp.route("/change_password", methods=["POST"])
# def change_password():
#     data = request.get_json()
#     new_password = data.get("newPassword")
#     username = data.get("username")

#     db = get_db()
#     cursor = db.cursor()

#     # Hash the new password before storing it in the database
#     hashed_new_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

#     try:
#         # Update the password for the user in the database
#         cursor.execute("UPDATE users SET hashed_password = ? WHERE username = ?", (hashed_new_password, username))
#         db.commit()

#         return jsonify({"message": "Password changed successfully"}), 200
#     except Exception as e:
#         db.rollback()
#         return jsonify({"error": "Failed to change password", "details": str(e)}), 500
#     finally:
#         cursor.close()
#         db.close()