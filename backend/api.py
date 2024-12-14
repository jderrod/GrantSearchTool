from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import sqlite3
import os

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
    source = request.args.get("source", None)

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
        keywords = search_term.split()
        keyword_conditions = []
        keyword_conditions_data = []
    
        for keyword in keywords:
            grants_condition = "(LOWER(title) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))"
            grants_data_condition = "(LOWER(funder_name) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))"
            
            search_param = f"%{keyword}%"
            grants_params.extend([search_param, search_param])
            grants_data_params.extend([search_param, search_param])
            
            keyword_conditions.append(grants_condition)
            keyword_conditions_data.append(grants_data_condition)
        
        grants_query += " AND " + " AND ".join(keyword_conditions)
        grants_data_query += " AND " + " AND ".join(keyword_conditions_data)

    if region:
        grants_data_query += " AND LOWER(geographic_scope) LIKE LOWER(?)"
        grants_data_params.append(f"%{region.lower()}%")

    if source:
        grants_query += " AND source = ?"
        grants_data_query += " AND source = ?"
        grants_params.append(source)
        grants_data_params.append(source)

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

@app.route("/api/grants/<string:source>/<int:grant_id>", methods=["GET"])
@cross_origin()
def get_grant(source, grant_id):
    """
    Fetch a single grant by its ID from the specified database.
    
    Args:
        source (str): The source database ('federal' or 'private')
        grant_id (int): The ID of the grant to retrieve
        
    Returns:
        JSON response containing the grant data or error message
    """
    try:
        if source == "federal":
            db_name = "grants.db"
            query = """
                SELECT *, 'federal' as source
                FROM grants 
                WHERE id = ?
            """
        elif source == "private":
            db_name = "grants_data.db"
            query = """
                SELECT *, 'private' as source
                FROM grants 
                WHERE id = ?
            """
        else:
            return jsonify({"error": "Invalid source. Must be 'federal' or 'private'"}), 400

        conn = connect_db(db_name)
        cursor = conn.cursor()
        cursor.execute(query, (grant_id,))
        grant = cursor.fetchone()
        conn.close()

        if grant:
            return jsonify(dict(grant))
        else:
            return jsonify({"error": f"Grant not found in {source} database"}), 404

    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

if __name__ == "__main__":
    # Get port from environment variable (Render provides this)
    port = int(os.environ.get("PORT", 5000))
    # Run on all interfaces with the provided port
    app.run(host="0.0.0.0", port=port, debug=False)