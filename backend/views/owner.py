from flask import Blueprint, jsonify, request
from db import get_db
from psycopg2.extras import RealDictCursor

bp = Blueprint("owner", __name__)

@bp.route("/admin/<int:owner_id>", methods=["GET"])
def get_owner(owner_id):
    """
    Retrieves owner details by their ID from the database.
    """
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT u.username, u.email, u.age, u.full_name, u.phone, o.owner_id
            FROM users u
            INNER JOIN owner o ON u.id = o.owner_id
            WHERE u.id = %s;
        """, (owner_id,))

        owner = cursor.fetchone()

        if owner:
            return jsonify(owner), 200
        else:
            return jsonify({"error": "Owner not found"}), 404

    except Exception as e:
        return jsonify({"error": f"An error occurred while retrieving owner details: {str(e)}"}), 500
    finally:
        cursor.close()
        db.close()
