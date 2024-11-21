from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import sqlite3

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Database connection function
def connect_db():
    conn = sqlite3.connect("grants_data.db", check_same_thread=False)
    conn.row_factory = sqlite3.Row  # Ensures rows behave like dictionaries
    return conn

@app.route("/api/grants", methods=["GET"])
@cross_origin()
def get_grants():
    search_term = request.args.get("search_term", "")
    region = request.args.get("region", None)
    limit = int(request.args.get("limit", 10))
    offset = int(request.args.get("offset", 0))

    query = """
        SELECT 
            funder_name, 
            website, 
            description, 
            geographic_scope, 
            eligibility, 
            deadlines, 
            grantmaker_type, 
            grants_history_link, 
            last_updated, 
            application_guidelines, 
            application_website 
        FROM grants
        WHERE 1=1
    """
    count_query = """
        SELECT COUNT(*) FROM grants
        WHERE 1=1
    """
    params = []
    count_params = []

    if search_term:
        query += " AND (LOWER(funder_name) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))"
        count_query += " AND (LOWER(funder_name) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))"
        params.extend([f"%{search_term}%", f"%{search_term}%"])
        count_params.extend([f"%{search_term}%", f"%{search_term}%"])

    if region:
        query += " AND LOWER(geographic_scope) = LOWER(?)"
        count_query += " AND LOWER(geographic_scope) = LOWER(?)"
        params.append(region)
        count_params.append(region)

    query += " LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    conn = connect_db()
    cursor = conn.cursor()

    # Fetch grants
    cursor.execute(query, params)
    rows = cursor.fetchall()

    # Fetch total results
    cursor.execute(count_query, count_params)
    total_results = cursor.fetchone()[0]

    grants = [dict(row) for row in rows]
    conn.close()

    return jsonify({
        "grants": grants,
        "total_results": total_results
    })


@app.route("/api/grants/<int:grant_id>", methods=["GET"])
@cross_origin()
def get_grant(grant_id):
    """
    Fetch a single grant by its ID.
    """
    query = """
        SELECT * FROM grants WHERE id = ?
    """
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(query, (grant_id,))
    row = cursor.fetchone()
    conn.close()

    if row:
        return jsonify(dict(row))
    else:
        return jsonify({"error": "Grant not found"}), 404


if __name__ == "__main__":
    app.run(debug=True)
