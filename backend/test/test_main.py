from unittest.mock import MagicMock, patch

import bcrypt
import pytest
from flask_jwt_extended import create_access_token

from main import app, jwt


@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

@pytest.fixture
def mock_db():
    with patch('main.get_db') as mock_get_db:
        mock_db_instance = MagicMock()
        mock_cursor = mock_db_instance.cursor.return_value
        mock_get_db.return_value = mock_db_instance
        yield mock_cursor

def test_login_valid(client, mock_db):
    hashed_password = bcrypt.hashpw('1234'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    mock_db.fetchone.return_value = {'id': 1, 'role': 'patient', 'password': hashed_password}
    
    response = client.post('/login', json={"username": "user", "password": "1234"})
    
    assert response.status_code == 200
    assert "access_token" in response.json

def test_login_invalid(client, mock_db):
    mock_db.fetchone.return_value = None

    response = client.post('/login', json={"username": "invaliduser", "password": "invalidpassword"})
    
    assert response.status_code == 401
    assert "error" in response.json and response.json["error"] == "Invalid username or password"

@patch('flask_jwt_extended.get_jwt_identity')
def test_get_user_authenticated(mock_get_jwt_identity, mock_db, client):
    mock_get_jwt_identity.return_value = 1
    mock_db.fetchone.return_value = {'id': 1, 'username': 'testuser', 'role': 'patient'}

    with app.test_request_context():
        access_token = create_access_token(identity=1, additional_claims={"role": "patient"})

    headers = {"Authorization": f"Bearer {access_token}"}
    response = client.get('/get_user', headers=headers)
    
    assert response.status_code == 200
    assert 'username' in response.json and response.json['username'] == 'testuser'
    assert 'role' in response.json and response.json['role'] == 'patient'

def test_get_user_unauthenticated(client):
    response = client.get('/get_user')
    
    assert response.status_code == 401
    assert 'msg' in response.json and response.json['msg'] == 'Missing Authorization Header'
