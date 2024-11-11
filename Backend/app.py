from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from mysql.connector import pooling

app = Flask(__name__)
CORS(app)

# Set up MySQL connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="bts"
)



cursor = db.cursor(dictionary=True)

@app.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.json

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Invalid request'}), 400

    cursor.execute("SELECT * FROM admin WHERE username=%s AND password=%s", (username, password))
    user = cursor.fetchone()

    if user:
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/get_attendant_table', methods=['GET'])
def get_attendant_table():
    cursor.execute("SELECT * FROM attenders")
    attendants = cursor.fetchall()

    return jsonify(attendants), 200

@app.route('/get_student_table', methods=['GET'])
def get_student_table():
    cursor.execute("SELECT * FROM students")
    students = cursor.fetchall()

    return jsonify(students), 200

@app.route('/route/add', methods=['POST'])
def add_route():
    data = request.json

    route_id = data.get('route_id')
    stop_name = data.get('stop_name')

    if not route_id or not stop_name:
        return jsonify({'error': 'Invalid request'}), 400

    cursor.execute("INSERT INTO routes (route_id, stop_name) VALUES (%s, %s)", (route_id, stop_name))
    db.commit()

    return jsonify({'message': 'Route added successfully'}), 201

@app.route('/update_route/<int:route_id>', methods=['PUT'])
def update_route(route_id):
    data = request.json
    stop_name = data.get('stop_name')

    if not stop_name:
        return jsonify({'error': 'Stop name is required'}), 400

    cursor.execute("UPDATE routes SET stop_name = %s WHERE route_id = %s", (stop_name, route_id))
    db.commit()

    return jsonify({'message': 'Route updated successfully'}), 200

@app.route('/update_bus/<int:bus_id>', methods=['PUT'])
def update_bus(bus_id):
    data = request.json
    bus_number = data.get('bus_number')
    route_id = data.get('route_id')

    if not bus_number:
        return jsonify({'error': 'Bus number is required'}), 400
    if not route_id:
        return jsonify({'error': 'Route ID is required'}), 400

    cursor.execute("UPDATE buses SET bus_number = %s, route_id = %s WHERE bus_id = %s", (bus_number, route_id, bus_id))
    db.commit()

    return jsonify({'message': 'Bus updated successfully'}), 200

@app.route('/student/add', methods=['POST'])
def add_student():
    data = request.json

    student_name = data.get('student_name')
    student_id = data.get('student_id')
    class_name = data.get('class')
    parent_name = data.get('parent_name')
    contact_number = data.get('contact_number')
    email = data.get('email')
    password = data.get('password')
    attendant_id = data.get('attendantid')
    bus_id = data.get('busid')
    route_id = data.get('routeid')

    if not student_name or not student_id or not class_name or not parent_name \
            or not contact_number or not email or not password or not attendant_id \
            or not bus_id or not route_id:
        return jsonify({'error': 'Invalid request'}), 400

    cursor.execute("INSERT INTO students (student_name, student_id, class, parent_name, "
                   "student_contact, email, password, attender_id, bus_id, route_id) "
                   "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                   (student_name, student_id, class_name, parent_name, contact_number,
                    email, password, attendant_id, bus_id, route_id))
    db.commit()

    return jsonify({'message': 'Student added successfully'}), 201

@app.route('/buses/add', methods=['POST'])
def add_bus():
    data = request.json

    bus_id = data.get('bus_id')
    bus_number = data.get('bus_number')
    route_id = data.get('route_id')

    if not bus_id or not bus_number or not route_id:
        return jsonify({'error': 'Invalid request'}), 400

    cursor.execute("INSERT INTO buses (bus_id, bus_number, route_id) VALUES (%s, %s, %s)", (bus_id, bus_number, route_id))
    db.commit()

    return jsonify({'message': 'Bus added successfully'}), 201

@app.route('/get_buses_table', methods=['GET'])
def get_buses_table():
    cursor.execute("SELECT * FROM buses")
    buses = cursor.fetchall()

    return jsonify(buses), 200

@app.route('/get_route_table', methods=['GET'])
def get_route_table():
    cursor.execute("SELECT * FROM routes")
    routes = cursor.fetchall()

    return jsonify(routes), 200

@app.route('/attender/login', methods=['POST'])
def attender_login():
    data = request.json

    attender_id = data.get('attender_id')
    password = data.get('password')

    if not attender_id or not password:
        return jsonify({'error': 'Invalid request'}), 400

    cursor.execute("SELECT * FROM attenders WHERE attender_id=%s AND password=%s", (attender_id, password))
    user = cursor.fetchone()

    if user:
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401
    
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Invalid request'}), 400

    # Use MySQL to validate credentials
    cursor.execute("SELECT * FROM students WHERE email=%s AND password=%s", (email, password))
    user = cursor.fetchone()

    if user:
        # Return success response
        return jsonify({'success': True}), 200
    else:
        # Return failure response
        return jsonify({'success': False}), 401

@app.route('/attender/add', methods=['POST'])
def add_attender():
    data = request.json

    attender_id = data.get('attender_id')
    attender_name = data.get('attender_name')
    age = data.get('age')
    attender_contact = data.get('contact_number')  # Corrected field name
    address = data.get('address')
    password = data.get('password')

    if not attender_id or not attender_name or not age or not attender_contact or not address or not password:
        return jsonify({'error': 'Invalid request'}), 400

    cursor.execute("INSERT INTO attenders (attender_id, attender_name, age, attender_contact, address, password) "
                   "VALUES (%s, %s, %s, %s, %s, %s)", (attender_id, attender_name, age, attender_contact, address, password))
    db.commit()

    return jsonify({'message': 'Attender added successfully'}), 201

@app.route('/attendance/register', methods=['POST'])
def register_attendance():
    data = request.json

    student_id = data.get('student_id')
    is_present = data.get('is_present')
    date = data.get('date')  # Assuming date is passed from frontend

    if not student_id or date is None:
        return jsonify({'error': 'Invalid request'}), 400

    cursor.execute("INSERT INTO attendance_register (student_id, is_present, date) VALUES (%s, %s, %s)",
                   (student_id, is_present, date))
    db.commit()

    return jsonify({'message': 'Attendance recorded successfully'}), 201

@app.route('/attender/delete/<attender_id>', methods=['DELETE'])
def delete_attendant(attender_id):
    try:
        cursor.execute("DELETE FROM attenders WHERE attender_id=%s", (attender_id,))
        db.commit()
        return jsonify({'message': 'Attendant deleted successfully'}), 200
    except mysql.connector.Error as e:
        db.rollback()
        return jsonify({'error': 'Database Error', 'details': str(e)}), 500
    except Exception as e:
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500
    
@app.route('/delete_student/<student_id>', methods=['DELETE'])
def delete_student(student_id):
    try:
        cursor.execute("DELETE FROM students WHERE student_id=%s", (student_id,))
        db.commit()
        return jsonify({'message': 'Student deleted successfully'}), 200
    except mysql.connector.Error as e:
        db.rollback()
        return jsonify({'error': 'Database Error', 'details': str(e)}), 500
    except Exception as e:
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500
    

@app.route('/save_attendance', methods=['POST'])
def save_attendance():
    try:
        attendance_data = request.json  # Get the JSON data from the request

        # Iterate through each attendance record in the data
        for record in attendance_data:
            student_id = record['studentId']
            is_present = record['isPresent']

            # Insert the attendance record into the database
            cursor.execute("INSERT INTO attendance_register (student_id, is_present) VALUES (%s, %s)",
                           (student_id, is_present))
        db.commit()

        return jsonify({"message": "Attendance saved successfully"}), 200
    except Exception as e:
        db.rollback()  # Rollback changes in case of an error
        return jsonify({"error": "Failed to save attendance", 'details': str(e)}), 500

@app.route('/insert_gps_data', methods=['POST'])
def insert_gps_data():
    try:
        data = request.json
        attender_id = data.get('attender_id')
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        timestamp = data.get('timestamp')

        if not attender_id or not latitude or not longitude or not timestamp:
            return jsonify({'error': 'Invalid request'}), 400

        cursor.execute("INSERT INTO gps_data (attender_id, latitude, longitude, timestamp) VALUES (%s, %s, %s, %s)",
                       (attender_id, latitude, longitude, timestamp))
        db.commit()

        return jsonify({'message': 'GPS data inserted successfully'}), 201
    except Exception as e:
        db.rollback()
        return jsonify({'error': 'Failed to insert GPS data', 'details': str(e)}), 500

@app.route('/update_live_location', methods=['POST'])
def update_live_location():
    try:
        data = request.json
        attender_id = data.get('attender_id')
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        timestamp = data.get('timestamp')

        if not attender_id or not latitude or not longitude or not timestamp:
            return jsonify({'error': 'Invalid request'}), 400

        cursor.execute("UPDATE live_location SET latitude=%s, longitude=%s, timestamp=%s WHERE attender_id=%s",
                       (latitude, longitude, timestamp, attender_id))
        db.commit()

        return jsonify({'message': 'Live location updated successfully'}), 200
    except Exception as e:
        db.rollback()
        return jsonify({'error': 'Failed to update live location', 'details': str(e)}), 500
    

@app.route('/get_location_data', methods=['POST'])
def get_location_data():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Invalid request'}), 400

    # Fetch the attender_id using the provided email
    cursor.execute("SELECT attender_id FROM students WHERE email=%s", (email,))
    attender = cursor.fetchone()

    if not attender:
        return jsonify({'error': 'Attender not found'}), 404

    attender_id = attender['attender_id']

    # Fetch the latitude and longitude using the attender_id
    cursor.execute("SELECT latitude, longitude FROM live_location WHERE attender_id=%s", (attender_id,))
    location = cursor.fetchone()

    if not location:
        return jsonify({'error': 'Location data not found for the attender'}), 404

    return jsonify(location), 200

@app.route('/get_profile_data', methods=['POST'])
def get_profile_data():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Invalid request'}), 400

    cursor.execute("SELECT * FROM students WHERE email=%s", (email,))
    profile_data = cursor.fetchone()

    if not profile_data:
        return jsonify({'error': 'Profile data not found'}), 404

    return jsonify(profile_data), 200

@app.route('/get_attendant_details/<attender_id>', methods=['GET'])
def get_attendant_details(attender_id):
    try:
        cursor.execute("SELECT * FROM attenders WHERE attender_id=%s", (attender_id,))
        attendant = cursor.fetchone()

        if attendant:
            return jsonify(attendant), 200
        else:
            return jsonify({'error': 'Attendant not found'}), 404
    except mysql.connector.Error as e:
        return jsonify({'error': 'Database Error', 'details': str(e)}), 500
    except Exception as e:
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500
    
@app.route('/getstudent/<student_id>', methods=['GET'])
def get_student_details(student_id):
    try:
        # Use the existing cursor from the global scope that's already configured
        cursor.execute("""
            SELECT 
                student_id,
                student_name,
                class,
                parent_name,
                student_contact,
                email,
                attender_id,
                bus_id,
                route_id
            FROM students 
            WHERE student_id = %s
        """, (student_id,))
        
        student = cursor.fetchone()
        
        if student:
            return jsonify(student), 200
        else:
            return jsonify({'error': 'Student not found'}), 404

    except mysql.connector.Error as db_error:
        app.logger.error(f"Database error while fetching student_id {student_id}: {db_error}")
        return jsonify({
            'error': 'Database error',
            'message': 'Unable to fetch student details'
        }), 500
    except Exception as e:
        app.logger.error(f"General error while fetching student_id {student_id}: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': 'An unexpected error occurred'
        }), 500
@app.route('/student/update/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    data = request.json
    
    # Get data from request
    student_name = data.get('student_name')
    student_contact = data.get('contact_number')  # Changed to match database column
    clas = data.get('class')
    parent_name = data.get('parent_name')
    email = data.get('email')
    password = data.get('password')
    attender_id = data.get('attendantid')
    bus_id = data.get('busid')
    route_id = data.get('routeid')

    # First check if student exists
    cursor.execute("SELECT * FROM students WHERE student_id = %s", (student_id,))
    student = cursor.fetchone()
    if not student:
        return jsonify({'error': 'Student Not Found'}), 404
    
    # Update query with correct column names and parameter order
    cursor.execute("""
        UPDATE students 
        SET student_name = %s,
            student_contact = %s,
            class = %s,
            parent_name = %s,
            email = %s,
            password = %s,
            attender_id = %s,
            bus_id = %s,
            route_id = %s
        WHERE student_id = %s
    """, (
        student_name,
        student_contact,
        clas,
        parent_name,
        email,
        password,
        attender_id,
        bus_id,
        route_id,
        student_id
    ))
    
    db.commit()
    return jsonify({'message': 'Updated successfully'}), 200

@app.route('/attender/update/<int:attendant_id>', methods=['PUT'])
def update_attendant(attendant_id):
    data = request.json
    attender_name = data.get('attender_name')
    address = data.get('address')
    contact_number = data.get('contact_number')
    age = data.get('age')
    password = data.get('password')

    # Check if the attendant exists
    cursor.execute("SELECT * FROM attenders WHERE attender_id = %s", (attendant_id,))
    attendant = cursor.fetchone()
    if not attendant:
        return jsonify({'error': 'Attendant not found'}), 404

    # Update attendant details
    cursor.execute(
        """
        UPDATE attenders
        SET attender_name=%s, address=%s, attender_contact=%s, age=%s, password=%s
        WHERE attender_id=%s  -- Use the correct column name without spaces
        """,
        (attender_name, address, contact_number, age, password, attendant_id)
    )
    
    # Commit the changes
    db.commit()

    return jsonify({'message': 'Attendant updated successfully'}), 200


if __name__ == '__main__':
    app.run(port=5001, debug=True)
