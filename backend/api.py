from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import sqlite3

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Database connection function
def connect_db(db_name):
    conn = sqlite3.connect(db_name, check_same_thread=False)
    conn.row_factory = sqlite3.Row  # Ensures rows behave like dictionaries
    return conn

@app.route("/api/grants", methods=["GET"])
@cross_origin()
def get_grants():
    search_term = request.args.get("search_term", "")
    region = request.args.get("region", None)
    state = request.args.get("state", None)
    eligibility = request.args.get("eligibility", None)
    limit = int(request.args.get("limit", 10))
    offset = int(request.args.get("offset", 0))

    # Queries for grants.db
    grants_query = """
        SELECT id, title AS funder_name, description, eligibility, 
               closing_date AS deadlines, submission_url AS current_url, 'federal' AS source
        FROM grants
        WHERE 1=1
    """
    grants_params = []

    # Queries for grants_data.db
    grants_data_query = """
        SELECT id, funder_name, description, eligibility, deadlines, website AS current_url, 'private' AS source
        FROM grants
        WHERE 1=1
    """
    grants_data_params = []

    # Add filters
    if search_term:
        grants_query += " AND (LOWER(title) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))"
        grants_data_query += " AND (LOWER(funder_name) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))"
        search_param = f"%{search_term}%"
        grants_params.extend([search_param, search_param])
        grants_data_params.extend([search_param, search_param])

    if region:
        grants_data_query += " AND LOWER(geographic_scope) LIKE LOWER(?)"
        grants_data_params.append(f"%{region.lower()}%")

    if state:
        grants_data_query += " AND LOWER(geographic_scope) LIKE LOWER(?)"
        grants_data_params.append(f"%{state.lower()}%")

    if eligibility:
        grants_query += " AND LOWER(eligibility) LIKE LOWER(?)"
        grants_data_query += " AND LOWER(eligibility) LIKE LOWER(?)"
        grants_params.append(f"%{eligibility.lower()}%")
        grants_data_params.append(f"%{eligibility.lower()}%")

    # Separate Queries for Total Results
    grants_query_no_limit = grants_query
    grants_data_query_no_limit = grants_data_query

    # Add Pagination
    grants_query += " LIMIT ? OFFSET ?"
    grants_data_query += " LIMIT ? OFFSET ?"
    grants_params.extend([limit, offset])
    grants_data_params.extend([limit, offset])

    # Connect and fetch data
    grants_conn = connect_db("grants.db")
    grants_data_conn = connect_db("grants_data.db")
    grants_cursor = grants_conn.cursor()
    grants_data_cursor = grants_data_conn.cursor()

    # Calculate Total Results
    grants_cursor.execute(grants_query_no_limit, grants_params[:-2])
    grants_data_cursor.execute(grants_data_query_no_limit, grants_data_params[:-2])
    total_results = len(grants_cursor.fetchall()) + len(grants_data_cursor.fetchall())

    # Fetch Paginated Results
    grants_cursor.execute(grants_query, grants_params)
    grants_data_cursor.execute(grants_data_query, grants_data_params)

    grants = [dict(row) for row in grants_cursor.fetchall()]
    grants_data = [dict(row) for row in grants_data_cursor.fetchall()]

    grants_conn.close()
    grants_data_conn.close()

    combined_results = grants + grants_data

    return jsonify({
        "grants": combined_results,
        "total_results": total_results
    })


@app.route("/api/grants/<int:grant_id>", methods=["GET"])
@cross_origin()
def get_grant(grant_id):
    """
    Fetch a single grant by its ID from either database.
    """
    # Search grants.db
    grants_query = "SELECT * FROM grants WHERE id = ?"
    grants_conn = connect_db("grants.db")
    grants_cursor = grants_conn.cursor()
    grants_cursor.execute(grants_query, (grant_id,))
    grant = grants_cursor.fetchone()
    grants_conn.close()

    if grant:
        return jsonify(dict(grant))

    # Search grants_data.db
    grants_data_query = "SELECT * FROM grants WHERE id = ?"
    grants_data_conn = connect_db("grants_data.db")
    grants_data_cursor = grants_data_conn.cursor()
    grants_data_cursor.execute(grants_data_query, (grant_id,))
    grant_data = grants_data_cursor.fetchone()
    grants_data_conn.close()

    if grant_data:
        return jsonify(dict(grant_data))

    return jsonify({"error": "Grant not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)
