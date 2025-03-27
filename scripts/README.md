
# Database Scripts

This directory contains scripts for managing the application's database.

## dataset.py

This script creates and populates an SQLite database with sample data for the SkyHub application.

### Usage

Run the script from the project root:

```
python scripts/dataset.py
```

This will:
1. Create a new SQLite database at `public/data/dataset.db`
2. Create tables for users and flights
3. Populate the tables with sample data
4. Generate a CSV file at `public/data/flights.csv` for use with the application
5. Generate a JSON file at `public/data/users.json` with user data

### Requirements

- Python 3.6+
- SQLite3 (included with Python)

### Database Schema

#### Users Table
- id: INTEGER PRIMARY KEY
- name: TEXT
- email: TEXT (unique)
- password: TEXT
- role: TEXT
- created_at: TEXT (timestamp)

#### Flights Table
- id: INTEGER PRIMARY KEY
- flight_number: TEXT
- airline: TEXT
- origin: TEXT
- destination: TEXT
- departure_time: TEXT
- arrival_time: TEXT
- booking_reference: TEXT
- passenger_name: TEXT
- passenger_email: TEXT
- status: TEXT
- created_at: TEXT (timestamp)
