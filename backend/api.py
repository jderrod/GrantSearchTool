from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
# Database connection function
def connect_db():
    conn = sqlite3.connect("bmgf_grants.db", check_same_thread=False)
    conn.row_factory = sqlite3.Row  # Ensures rows behave like dictionaries
    return conn


@app.route("/api/grants", methods=["GET"])
def get_grants():
    conn = connect_db()
    cursor = conn.cursor()

    # Get query parameters
    search_term = request.args.get("search_term", "").strip()
    limit = int(request.args.get("limit", 10))
    offset = int(request.args.get("offset", 0))

    # Base query for results
    query = "SELECT * FROM grants WHERE 1=1"
    count_query = "SELECT COUNT(*) FROM grants WHERE 1=1"
    params = []

    # Add search term filter
    if search_term:
        query += " AND (grantee LIKE ? OR purpose LIKE ?)"
        count_query += " AND (grantee LIKE ? OR purpose LIKE ?)"
        params.extend([f"%{search_term}%", f"%{search_term}%"])

    # Add LIMIT and OFFSET to the query
    query += " LIMIT ? OFFSET ?"
    params_with_pagination = params + [limit, offset]  # Add limit and offset only to the query

    # Execute the count query
    print("Count Query:", count_query)
    print("Parameters for Count Query:", params)
    cursor.execute(count_query, params)
    total_results = cursor.fetchone()[0]

    # Execute the main query with pagination
    print("Query:", query)
    print("Parameters for Query:", params_with_pagination)
    cursor.execute(query, params_with_pagination)
    rows = cursor.fetchall()

    # Convert rows to dictionaries
    grants = [dict(row) for row in rows]

    # Close database connection
    conn.close()

    return jsonify({
        "grants": grants,
        "total_results": total_results
    })




if __name__ == "__main__":
    app.run(debug=True)
