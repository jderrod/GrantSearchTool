import sqlite3
import pandas as pd
import os

# Define paths
csv_path = os.path.join("data", "BMGFGrants.csv")  # Path to your CSV file
db_path = "bmgf_grants.db"  # SQLite database file

# Load the CSV into a DataFrame, skipping the first metadata row
print("Loading the CSV file...")
try:
    data = pd.read_csv(csv_path, skiprows=1, delimiter=',', skip_blank_lines=True)

    # Check the detected columns
    print("Columns detected:", data.columns)

    # Rename columns to ensure consistency
    data.columns = [
        "grant_id", "grantee", "purpose", "division", "date_committed",
        "duration_months", "amount_committed", "grantee_website",
        "grantee_city", "grantee_state", "grantee_country",
        "region_served", "topic"
    ]

    # Preview the data for verification
    print(data.head())

except Exception as e:
    print(f"Error loading CSV: {e}")
    raise

# Ensure correct column names
data.columns = [
    "grant_id", "grantee", "purpose", "division", "date_committed",
    "duration_months", "amount_committed", "grantee_website",
    "grantee_city", "grantee_state", "grantee_country",
    "region_served", "topic"
]

# Connect to SQLite database
print("Connecting to the SQLite database...")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Drop the existing grants table if it exists
print("Dropping the existing grants table (if any)...")
cursor.execute("DROP TABLE IF EXISTS grants")
conn.commit()

# Create the grants table
print("Creating the grants table...")
create_table_query = """
CREATE TABLE grants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    grant_id TEXT,
    grantee TEXT,
    purpose TEXT,
    division TEXT,
    date_committed DATE,
    duration_months INTEGER,
    amount_committed REAL,
    grantee_website TEXT,
    grantee_city TEXT,
    grantee_state TEXT,
    grantee_country TEXT,
    region_served TEXT,
    topic TEXT
);
"""
cursor.execute(create_table_query)
conn.commit()

# Insert data into the database
print("Inserting data into the database...")
insert_query = """
INSERT INTO grants (
    grant_id, grantee, purpose, division, date_committed,
    duration_months, amount_committed, grantee_website,
    grantee_city, grantee_state, grantee_country,
    region_served, topic
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
"""

for i, (_, row) in enumerate(data.iterrows(), start=1):
    row_tuple = (
        row["grant_id"], row["grantee"], row["purpose"], row["division"], 
        row["date_committed"], row["duration_months"], row["amount_committed"], 
        row["grantee_website"], row["grantee_city"], row["grantee_state"], 
        row["grantee_country"], row["region_served"], row["topic"]
    )
    cursor.execute(insert_query, row_tuple)
    if i % 100 == 0:  # Log progress every 100 rows
        print(f"{i} rows inserted...")

conn.commit()
print("Data successfully inserted into the database!")

# Close the database connection
conn.close()
print("Database connection closed.")
