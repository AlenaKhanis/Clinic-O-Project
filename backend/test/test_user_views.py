
from datetime import datetime
from psycopg2.extras import RealDictCursor
import pytest
from flask import json

from db.db import get_db
from main import app

#Used to prepare the database state before running each test that requires a clean state.
#After each test, ensures that any changes made during the test are rolled back, reverting the database to its initial state.
@pytest.fixture
def setup_teardown_db():
    with app.app_context():
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("DELETE FROM appointments WHERE doctor_id = 999")
        cursor.execute("DELETE FROM doctors WHERE doctor_id = 999")
        cursor.execute("DELETE FROM users WHERE id = 999")
        cursor.execute("DELETE FROM appointments WHERE patient_id = 888")
        cursor.execute("DELETE FROM patients WHERE patient_id = 888")
        cursor.execute("DELETE FROM users WHERE id = 888")
        cursor.execute("DELETE FROM users WHERE username = 'test_user'")

        conn.commit()
        yield cursor
        conn.rollback()
        
#This fixture ensures that the database is cleaned up after all tests
@pytest.fixture(scope="module", autouse=True)
def cleanup_db():
    yield
    with app.app_context():
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("DELETE FROM appointments WHERE doctor_id = 999")
        cursor.execute("DELETE FROM doctors WHERE doctor_id = 999")
        cursor.execute("DELETE FROM users WHERE id = 999")
        cursor.execute("DELETE FROM appointments WHERE patient_id = 888")
        cursor.execute("DELETE FROM patients WHERE patient_id = 888")
        cursor.execute("DELETE FROM users WHERE id = 888")
        cursor.execute("DELETE FROM users WHERE username = 'test_user'")
        conn.commit()



def test_check_username_exists(setup_teardown_db):
    client = app.test_client()
    cursor = setup_teardown_db

    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                   (999, 'test_username', 'test_password', 'doctor', 'test_doctor_name'))

    response = client.get('/check-username?username=test_username')

    assert response.status_code == 200
    assert isinstance(response.json, dict)

    assert response.json['exists'] == True

def test_delete_user(setup_teardown_db):
    client = app.test_client()
    cursor = setup_teardown_db

    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                   (999, 'test_username', 'test_password', 'doctor', 'test_doctor_name'))

    response = client.delete('/delete_user/999')

    assert response.status_code == 200
    assert isinstance(response.json, dict)

    assert response.json['message'] == 'User deleted successfully'

def test_edit_user_profile_route(setup_teardown_db):
    client = app.test_client()
    cursor = setup_teardown_db
    
    # Insert a user to edit
    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                   (888, 'test_user', 'test_password', 'patient', 'Test User'))
    conn = get_db()
    conn.commit()
    
    # Data to update
    updated_data = {
        'full_name': 'Updated Test User',
        'email': 'updated_test_user@example.com',
        'phone': '9876543210'
    }

    response = client.post(f'/edit_user_profile/888', data=json.dumps(updated_data), content_type='application/json')
    
    # Check if the response is successful
    assert response.status_code == 200
    assert isinstance(response.json, dict)
    assert 'updated_fields' in response.json
    assert response.json['updated_fields'] == updated_data
    
    # Verify the user has been updated in the database
    cursor.execute("SELECT * FROM users WHERE id = %s", (888,))
    user = cursor.fetchone()
    
    assert user is not None
    assert user['full_name'] == updated_data['full_name']
    assert user['email'] == updated_data['email']
    assert user['phone'] == updated_data['phone']


def test_register_user(setup_teardown_db):
    client = app.test_client()

    data = {
        'username': 'test_user',
        'password': 'test_password',
        'email': 'test_user@example.com',
        'fullName': 'Test User',
        'role': 'patient',
        'phone': '1234567890',
        'birthday': '2000-01-01',
        'package': 'Gold'
    }
    
    response = client.post('/register', data=json.dumps(data), content_type='application/json')
    
    assert response.status_code == 200
    assert response.json['message'] == 'Registration successful'
    
    cursor = setup_teardown_db
    cursor.execute("SELECT * FROM users WHERE username = %s", (data['username'],))
    user = cursor.fetchone()
    print("User: ", user)
    
    assert user is not None
    assert user['username'] == data['username']
    assert user['email'] == data['email']
    assert user['full_name'] == data['fullName']
    assert user['role'] == data['role']
    assert user['phone'] == data['phone']
    
    cursor.execute("SELECT * FROM patients WHERE patient_id = %s", (user['id'],))
    patient = cursor.fetchone()
    
    assert patient is not None
    assert patient['package'] == data['package']

def test_register_user_doctor(setup_teardown_db):  
    client = app.test_client()

    data = {
        'username': 'test_user',
        'password': 'test_password',
        'email': 'test_user@example.com',
        'fullName': 'Test User',
        'role': 'doctor',
        'phone': '1234567890',
        'birthday': '2000-01-01',
        'specialty': 'some_specialty'
    }
    
    response = client.post('/register', data=json.dumps(data), content_type='application/json')
    
    assert response.status_code == 200
    assert response.json['message'] == 'Registration successful'
    
    cursor = setup_teardown_db
    cursor.execute("SELECT * FROM users WHERE username = %s", (data['username'],))
    user = cursor.fetchone()
    print("User: ", user)
    
    assert user is not None
    assert user['username'] == data['username']
    assert user['email'] == data['email']
    assert user['full_name'] == data['fullName']
    assert user['role'] == data['role']
    assert user['phone'] == data['phone']
    
    cursor.execute("SELECT * FROM doctors WHERE doctor_id = %s", (user['id'],))
    doctor = cursor.fetchone()
    
    assert doctor is not None
    assert doctor['specialty'] == data['specialty']

