from pathlib import Path
from flask import Flask
from db import get_db, close_db


app = Flask(__name__)
app.config.from_prefixed_env()
@app.teardown_appcontext
def close_db_connection(exception):
    close_db(exception)


@app.route('/')
def index():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM users')
    results = cursor.fetchall()  # Fetch all rows from the result set
    return str(results)