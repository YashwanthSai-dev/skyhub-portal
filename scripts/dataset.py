
import sqlite3
import csv
import os
import json
from pathlib import Path

# Ensure the data directory exists
data_dir = Path("public/data")
data_dir.mkdir(parents=True, exist_ok=True)

# Create or connect to the SQLite database
conn = sqlite3.connect('public/data/dataset.db')
cursor = conn.cursor()

# Create users table
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
''')

# Create flights table
cursor.execute('''
CREATE TABLE IF NOT EXISTS flights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_number TEXT NOT NULL,
    airline TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_time TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    booking_reference TEXT NOT NULL,
    passenger_name TEXT NOT NULL,
    passenger_email TEXT NOT NULL,
    status TEXT DEFAULT 'SCHEDULED',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
''')

# Sample user data
sample_users = [
    ('Admin User', 'admin@skyhub.com', 'admin123', 'admin'),
    ('John Doe', 'john@example.com', 'password123', 'user'),
    ('Jane Smith', 'jane@example.com', 'password123', 'user')
]

# Insert sample users
cursor.execute("DELETE FROM users")
cursor.executemany(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    sample_users
)

# Sample flight data - Make sure flight numbers are in consistent format
sample_flights = [
    ('SH101', 'SkyHub Airways', 'New York', 'London', '2023-06-15T08:00:00', '2023-06-15T20:00:00', 'ABC123', 'John Doe', 'john@example.com', 'SCHEDULED'),
    ('SH202', 'SkyHub Airways', 'Paris', 'Tokyo', '2023-06-16T09:30:00', '2023-06-17T11:00:00', 'DEF456', 'Jane Smith', 'jane@example.com', 'SCHEDULED'),
    ('SH303', 'SkyHub Airways', 'London', 'New York', '2023-06-17T14:00:00', '2023-06-17T22:30:00', 'GHI789', 'Bob Johnson', 'bob@example.com', 'BOARDING'),
    ('SH404', 'SkyHub Airways', 'Tokyo', 'Paris', '2023-06-18T10:15:00', '2023-06-19T06:45:00', 'JKL012', 'Alice Brown', 'alice@example.com', 'DEPARTED'),
    ('SH505', 'SkyHub Airways', 'Sydney', 'Singapore', '2023-06-19T23:00:00', '2023-06-20T05:30:00', 'MNO345', 'Charlie Wilson', 'charlie@example.com', 'SCHEDULED')
]

# Insert sample flights
cursor.execute("DELETE FROM flights")
cursor.executemany(
    "INSERT INTO flights (flight_number, airline, origin, destination, departure_time, arrival_time, booking_reference, passenger_name, passenger_email, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    sample_flights
)

# Generate CSV from the flights table for use with the website
csv_path = data_dir / 'flights.csv'
cursor.execute("SELECT * FROM flights")
flights = cursor.fetchall()

with open(csv_path, 'w', newline='') as csv_file:
    csv_writer = csv.writer(csv_file)
    # Write headers
    csv_writer.writerow([
        'id', 'flightNumber', 'airline', 'origin', 'destination', 
        'departureTime', 'arrivalTime', 'bookingReference', 
        'passengerName', 'passengerEmail', 'status'
    ])
    # Write data
    for flight in flights:
        csv_writer.writerow(flight)

print(f"Created flights.csv with {len(flights)} records")

# Export user data to JSON for initial localStorage setup
users_path = data_dir / 'users.json'
cursor.execute("SELECT name, email, password, role FROM users")
users = cursor.fetchall()

user_list = []
for user in users:
    user_list.append({
        'name': user[0],
        'email': user[1],
        'password': user[2],
        'role': user[3]
    })

with open(users_path, 'w') as json_file:
    json.dump(user_list, json_file, indent=2)

print(f"Created users.json with {len(users)} records")

# Commit changes and close connection
conn.commit()
print("Database successfully created at public/data/dataset.db")
conn.close()
