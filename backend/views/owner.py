from flask import Blueprint, jsonify, request
from db import get_db
from psycopg2.extras import RealDictCursor

bp = Blueprint("owner", __name__)

@bp.route("/admin/<owner_id>", methods=["GET"])
def get_owner(owner_id):
    db = get_db()
    cursor = db.cursor(cursor_factory=RealDictCursor)
    cursor.execute("""
    SELECT u.username , u.email , u.age , u.full_name , u.phone ,
    o.owner_id 
    FROM users u
    INNER JOIN owner o ON u.id = o.owner_id
    WHERE u.id = %s;
    """, (owner_id,))

    owner = cursor.fetchone()
    return jsonify(owner), 200

