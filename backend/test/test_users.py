import pytest
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from models.users import User  
from dotenv import load_dotenv

load_dotenv()

@pytest.fixture(scope="function")
def db_cursor():
    conn = psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )
    conn.autocommit = True
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    yield cursor
    cursor.close()
    conn.close()

def cleanup(db_cursor):
    db_cursor.execute("DELETE FROM users WHERE id = %s OR username = %s", (999, 'testuser'))
    db_cursor.execute("DELETE FROM doctors WHERE doctor_id = %s", (999,))
    db_cursor.execute("DELETE FROM patients WHERE patient_id = %s", (999,))

@pytest.fixture
def user():
    return User(
        username="testuser",
        password="testpass",
        email="test@example.com",
        full_name="Test User",
        role="patient",
        age=30,
        phone="1234567890",
        created_date=datetime.now(),
        updated_date=datetime.now()
    )

def test_check_username_exists(db_cursor):
    db_cursor.execute("INSERT INTO users (id, username, password, full_name,role) VALUES (%s, %s, %s, %s,%s)", (999, 'testuser', 'testpass', 'Test User' , 'patient'))

    try:
        exists = User.check_username_exists("testuser", db_cursor)
        assert exists == True
    
        not_exists = User.check_username_exists("nonexistentuser", db_cursor)
        assert not_exists == False
    finally:
        cleanup(db_cursor)

def test_add_user(db_cursor, user):
    try:
        user_id = user.add_user(db_cursor)
        print(f"Returned User ID: {user_id}") 
        
        assert user_id is not None
        
        db_cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        added_user = db_cursor.fetchone()
        
        assert added_user is not None
        assert added_user['username'] == 'testuser'
        assert added_user['full_name'] == 'Test User'
    finally:
        cleanup(db_cursor)




def test_get_user(db_cursor, user):
    try:
        user_id = user.add_user(db_cursor)        
        retrieved_user = User.get_user(db_cursor, user_id)
        assert retrieved_user is not None
        assert retrieved_user['username'] == 'testuser'
        assert retrieved_user['full_name'] == 'Test User'
    finally:
        cleanup(db_cursor)

def test_edit_user_profile(db_cursor,user):
    try:
        user_id = user.add_user(db_cursor)
        updated_user = User.edit_user_profile(db_cursor, user_id, 'email', 'test2@example.com')
        assert updated_user['email'] == 'test2@example.com'
        
        updated_user = User.edit_user_profile(db_cursor, user_id, 'full_name', 'Updated User')
        assert updated_user['full_name'] == 'Updated User'
    finally:
        cleanup(db_cursor)

def test_edit_user_profile_doctor(db_cursor , user):
    try:
        user_id = user.add_user(db_cursor)
        
        db_cursor.execute("INSERT INTO doctors (doctor_id, specialty) VALUES (%s, %s)", (user_id, 'General'))
        
        updated_doctor = User.edit_user_profile(db_cursor, user_id, 'specialty', 'Cardiology')
        assert updated_doctor['specialty'] == 'Cardiology'
    finally:
        cleanup(db_cursor)

def test_edit_user_profile_patient(db_cursor,user):
    try:
        user_id = user.add_user(db_cursor)
        
        db_cursor.execute("INSERT INTO patients (patient_id, package) VALUES (%s, %s)", (user_id, 'Silver'))
        
        updated_patient = User.edit_user_profile(db_cursor, user_id, 'package', 'Premium')
        assert updated_patient['package'] == 'Premium'
    finally:
        cleanup(db_cursor)

def test_delete_user(db_cursor,user):
    try:
        user_id = user.add_user(db_cursor)
        
        result = User.delete_user(db_cursor, user_id)
        assert result == "User deleted successfully"
        
        db_cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        deleted_user = db_cursor.fetchone()
        
        assert deleted_user is None
    finally:
        cleanup(db_cursor)
