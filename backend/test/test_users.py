import psycopg2
import pytest
from unittest.mock import MagicMock
from models.users import User

@pytest.fixture
def mock_cursor():
    cursor = MagicMock()
    cursor.fetchone.return_value = [2]  
    return cursor

def test_add_user_success(mock_cursor):
    user = User(username="testuser", password="testpassword", email="test@example.com",
                full_name="Test User", role="patient", age=30, phone="1234567890",
                created_date="2024-01-01", updated_date="2024-01-01")
    user_id = user.add_user(mock_cursor)
    assert user_id == 2
    mock_cursor.execute.assert_called_once_with("""
                INSERT INTO users (username, password, email, full_name, role, age, phone, created_date, updated_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
                """,
                ("testuser", "testpassword", "test@example.com", "Test User", "patient",
                 30, "1234567890", "2024-01-01", "2024-01-01")
            )
    mock_cursor.fetchone.assert_called_once()
    

def test_edit_user_profile_specialty(mock_cursor):
    mock_cursor.fetchone.return_value = {'doctor_id': 1, 'specialty': 'Cardiology'}
    data = User.edit_user_profile(mock_cursor, 1, 'specialty', 'Cardiology')
    assert data == {'doctor_id': 1, 'specialty': 'Cardiology'}
    mock_cursor.execute.assert_any_call("""
                    UPDATE doctors
                    SET specialty = %s
                    WHERE doctor_id = %s;
                    """, ('Cardiology', 1))
    mock_cursor.execute.assert_any_call("""
                    SELECT DISTINCT d.*, u.username, u.full_name, u.age, u.email, u.phone 
                    FROM doctors d
                    INNER JOIN users u ON u.id = d.doctor_id
                    WHERE d.doctor_id = %s;
                    """, (1,))


def test_edit_user_profile_package(mock_cursor):
    mock_cursor.fetchone.return_value = {'patient_id': 1, 'package': 'Premium'}
    data = User.edit_user_profile(mock_cursor, 1, 'package', 'Premium')
    assert data == {'patient_id': 1, 'package': 'Premium'}
    
    mock_cursor.execute.assert_any_call("""
                    UPDATE patients
                    SET package = %s
                    WHERE patient_id = %s;
                    """, ('Premium', 1))
    mock_cursor.execute.assert_any_call("""
                    SELECT DISTINCT p.*, u.username, u.full_name, u.age, u.email, u.phone 
                    FROM patients p
                    INNER JOIN users u ON u.id = p.patient_id
                    WHERE p.patient_id = %s;
                    """, (1,))


def test_edit_user_profile_general(mock_cursor):
    mock_cursor.fetchone.return_value = {'id': 1, 'username': 'john_doe'}
    data = User.edit_user_profile(mock_cursor, 1, 'username', 'john_doe')
    
    
    assert data == {'id': 1, 'username': 'john_doe'}
    mock_cursor.execute.assert_any_call("""
                    UPDATE users
                    SET username = %s,
                        updated_date = CURRENT_TIMESTAMP
                    WHERE id = %s;
                    """, ('john_doe', 1))
    mock_cursor.execute.assert_any_call("SELECT * FROM users WHERE id = %s", (1,))

def test_delete_user_success(mock_cursor):
    message = User.delete_user(mock_cursor, 1)
    
    assert message == "User deleted successfully"
    mock_cursor.execute.assert_called_once_with("DELETE FROM users WHERE id = %s", (1,))

def test_add_user_success_empty_cursor(mock_cursor):
    mock_cursor.fetchone.return_value = None
    
    user = User(username="testuser", password="testpassword", email="test@example.com",
                full_name="Test User", role="patient", age=30, phone="1234567890",
                created_date="2024-01-01", updated_date="2024-01-01")
    
    user_id = user.add_user(mock_cursor)
    assert user_id is None
    mock_cursor.execute.assert_called_once_with("""
                INSERT INTO users (username, password, email, full_name, role, age, phone, created_date, updated_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
                """,
                ("testuser", "testpassword", "test@example.com", "Test User", "patient",
                 30, "1234567890", "2024-01-01", "2024-01-01")
            )
    mock_cursor.fetchone.assert_called_once()

