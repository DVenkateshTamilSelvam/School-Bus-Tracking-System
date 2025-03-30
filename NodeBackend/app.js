const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database Connection Configuration
const pool = mysql.createPool({
    host: 'localhost',
    user: 'tamil',
    password: 'Tamil@19@Raam',
    database: 'bts',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Utility function to handle database queries
async function executeQuery(query, params = []) {
    try {
        const [rows] = await pool.execute(query, params);
        return rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

function convertToMySQLDatetime(timestamp) {
    try {
        // Create a Date object from the timestamp
        const date = new Date(timestamp);
        
        // Convert to MySQL DATETIME format (YYYY-MM-DD HH:MM:SS)
        return date.toISOString().slice(0, 19).replace('T', ' ');
    } catch (error) {
        console.error('Timestamp conversion error:', error);
        return new Date().toISOString().slice(0, 19).replace('T', ' ');
    }
}

// Admin Login Route
app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        const [admins] = await pool.execute(
            'SELECT * FROM admin WHERE username = ? AND password = ?', 
            [username, password]
        );

        if (admins.length > 0) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Attender Login Route
app.post('/attender/login', async (req, res) => {
    const { attender_id, password } = req.body;

    if (!attender_id || !password) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        const [attenders] = await pool.execute(
            'SELECT * FROM attenders WHERE attender_id = ? AND password = ?', 
            [attender_id, password]
        );

        if (attenders.length > 0) {
            res.status(200).json({ 
                status: 'success', 
                message: 'Login successful',
                attender_id: attenders[0].attender_id 
            });
        } else {
            res.status(401).json({ 
                status: 'failed', 
                message: 'Invalid credentials' 
            });
        }
    } catch (error) {
        console.error('Attender login error:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Server error' 
        });
    }
});

//Student Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        const [users] = await pool.execute(
            'SELECT * FROM students WHERE email = ? AND password = ?', 
            [email, password]
        );

        if (users.length > 0) {
            res.status(200).json({ success: true });
        } else {
            res.status(401).json({ success: false });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Attendant Table Route
app.get('/get_attendant_table', async (req, res) => {
    try {
        const [attendants] = await pool.execute('SELECT * FROM attenders');
        res.status(200).json(attendants);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/get_attendant_details/:attendantId', async (req, res) => {
    const { attendantId } = req.params;

    if (!attendantId) {
        return res.status(400).json({ error: 'Attendant ID is required' });
    }

    try {
        const [attendants] = await pool.execute(
            'SELECT * FROM attenders WHERE attender_id = ?', 
            [attendantId]
        );

        if (attendants.length === 0) {
            return res.status(404).json({ error: 'Attendant not found' });
        }

        // Remove sensitive information like password before sending
        const { password, ...attendantDetails } = attendants[0];
        res.status(200).json(attendantDetails);
    } catch (error) {
        console.error('Error fetching attendant details:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});


// Add Route
app.post('/route/add', async (req, res) => {
    const { route_id, stop_name } = req.body;

    if (!route_id || !stop_name) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        await pool.execute(
            'INSERT INTO routes (route_id, stop_name) VALUES (?, ?)', 
            [route_id, stop_name]
        );
        res.status(201).json({ message: 'Route added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add Student Route
app.post('/student/add', async (req, res) => {
    const { 
        student_name, student_id, class: class_name, parent_name, 
        contact_number, email, password, attendantid, busid, routeid 
    } = req.body;

    // Validate all required fields
    const requiredFields = [
        student_name, student_id, class_name, parent_name, 
        contact_number, email, password, attendantid, busid, routeid
    ];
    
    if (requiredFields.some(field => !field)) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        await pool.execute(
            `INSERT INTO students 
            (student_id, student_name, class, parent_name, student_contact, 
            email, password, attender_id, bus_id, route_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [student_id, student_name, class_name, parent_name, contact_number, 
             email, password, attendantid, busid, routeid]
        );
        res.status(201).json({ message: 'Student added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// Add Attender Route
app.post('/attender/add', async (req, res) => {
    console.log('Received attender add request');
    console.log('Full Request Body:', JSON.stringify(req.body, null, 2));

    const { 
        attender_id, 
        attender_name, 
        attender_contact, // Changed from contact_number
        age, 
        address, 
        password 
    } = req.body;

    // Detailed validation with specific error messages
    const errors = [];

    if (!attender_id) errors.push('Attender ID is required');
    if (!attender_name) errors.push('Attender Name is required');
    if (!attender_contact) errors.push('Attender Contact is required');
    if (!age) errors.push('Age is required');
    if (!address) errors.push('Address is required');
    if (!password) errors.push('Password is required');

    if (errors.length > 0) {
        return res.status(400).json({ 
            error: 'Invalid request', 
            details: errors,
            receivedData: req.body 
        });
    }

    try {
        await pool.execute(
            `INSERT INTO attenders 
            (attender_id, attender_name, attender_contact, age, address, password) 
            VALUES (?, ?, ?, ?, ?, ?)`, 
            [
                parseInt(attender_id), 
                attender_name, 
                attender_contact, 
                parseInt(age), 
                address, 
                password
            ]
        );

        res.status(201).json({ 
            message: 'Attender added successfully',
            attender_id: attender_id 
        });
    } catch (error) {
        console.error('Error adding attender:', error);
        res.status(500).json({ 
            error: 'Server error', 
            details: error.message 
        });
    }
});

// Update Live Location Route
app.post('/update_live_location', async (req, res) => {
    const { attender_id, latitude, longitude, timestamp } = req.body;

    // Validate inputs
    if (!attender_id || !latitude || !longitude) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        // Convert timestamp to MySQL DATETIME format
        const mysqlTimestamp = convertToMySQLDatetime(timestamp);

        // Check if live location exists for this attender
        const [existingLocations] = await pool.execute(
            'SELECT * FROM live_location WHERE attender_id = ?', 
            [attender_id]
        );

        if (existingLocations.length > 0) {
            // Update existing record
            await pool.execute(
                'UPDATE live_location SET latitude = ?, longitude = ?, timestamp = ? WHERE attender_id = ?', 
                [
                    parseFloat(latitude).toFixed(6), 
                    parseFloat(longitude).toFixed(6), 
                    mysqlTimestamp, 
                    attender_id
                ]
            );
        } else {
            // Insert new record
            await pool.execute(
                'INSERT INTO live_location (attender_id, latitude, longitude, timestamp) VALUES (?, ?, ?, ?)', 
                [
                    attender_id, 
                    parseFloat(latitude).toFixed(6), 
                    parseFloat(longitude).toFixed(6), 
                    mysqlTimestamp
                ]
            );
        }

        res.status(200).json({ message: 'Live location updated successfully' });
    } catch (error) {
        console.error('Live location update error:', error);
        res.status(500).json({ 
            error: 'Failed to update live location', 
            details: error.message 
        });
    }
});

// Send Notification Route
app.post('/send_notification', async (req, res) => {
    const { attender_id, message, timestamp, gps_data } = req.body;
    const { latitude, longitude } = gps_data || {};
  
    if (!attender_id || !message) {
        return res.status(400).json({ error: 'Invalid request' });
    }
  
    try {
      // Convert timestamp to MySQL DATETIME format
      const mysqlTimestamp = convertToMySQLDatetime(timestamp);

      await pool.execute(
        'INSERT INTO notifications (attender_id, message, timestamp, latitude, longitude) VALUES (?, ?, ?, ?, ?)', 
        [
          attender_id, 
          message, 
          mysqlTimestamp, 
          latitude ? parseFloat(latitude).toFixed(6) : null, 
          longitude ? parseFloat(longitude).toFixed(6) : null
        ]
      );
  
      res.status(201).json({ 
        success: true, 
        message: 'Notification stored with location successfully' 
      });
    } catch (error) {
      console.error('Notification storage error:', error);
      res.status(500).json({ 
        error: 'Failed to store notification', 
        details: error.message 
      });
    }
});


// Get Notifications Route
app.get('/get_notifications', async (req, res) => {
    try {
        const [notifications] = await pool.execute(
            'SELECT * FROM notifications WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR) ORDER BY timestamp DESC LIMIT 50'
        );
        
        if (notifications.length === 0) {
            return res.status(200).json({ 
                message: 'No notifications found in the last 24 hours',
                notifications: [] 
            });
        }

        res.status(200).json({ notifications });
    } catch (error) {
        console.error('Fetch notifications error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch notifications', 
            details: error.message 
        });
    }
});

// Parent Get Notifications Route
app.post('/parentget_notifications', async (req, res) => {
    const { attender_id } = req.body;

    if (!attender_id) {
        return res.status(400).json({ 
            error: 'Validation failed', 
            details: 'attender_id is required' 
        });
    }

    try {
        const [notifications] = await pool.execute(
            'SELECT * FROM notifications WHERE attender_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR) ORDER BY timestamp DESC LIMIT 50', 
            [attender_id]
        );

        if (notifications.length === 0) {
            return res.status(200).json({ 
                message: "No notifications found for the last 24 hours",
                notifications: [] 
            });
        }

        res.status(200).json({ notifications });
    } catch (error) {
        console.error('Parent notifications fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch parent notifications', 
            details: error.message 
        });
    }
});

// Location Data Route
app.post('/get_location_data', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        // First, find the student and their associated attender_id
        const [students] = await pool.execute(
            'SELECT attender_id FROM students WHERE email = ?', 
            [email]
        );

        if (students.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const attender_id = students[0].attender_id;

        // Then fetch the live location for that attender
        const [locations] = await pool.execute(
            'SELECT latitude, longitude FROM live_location WHERE attender_id = ?', 
            [attender_id]
        );

        if (locations.length === 0) {
            return res.status(404).json({ error: 'Location data not found' });
        }

        res.status(200).json({
            latitude: locations[0].latitude, 
            longitude: locations[0].longitude
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// Update Attender Route
app.put('/attender/update/:attenderId', async (req, res) => {
    const { attenderId } = req.params;
    const { 
        attender_name, 
        attender_contact, 
        age, 
        address, 
        password 
    } = req.body;

    // Validate input
    const errors = [];
    if (!attenderId) errors.push('Attender ID is required');
    if (!attender_name) errors.push('Attender Name is required');
    if (!attender_contact) errors.push('Attender Contact is required');
    if (!age) errors.push('Age is required');
    if (!address) errors.push('Address is required');
    if (!password) errors.push('Password is required');

    if (errors.length > 0) {
        return res.status(400).json({ 
            error: 'Invalid request', 
            details: errors 
        });
    }

    try {
        // Update attender in database
        const [result] = await pool.execute(
            `UPDATE attenders 
            SET attender_name = ?, 
                attender_contact = ?, 
                age = ?, 
                address = ?, 
                password = ? 
            WHERE attender_id = ?`, 
            [
                attender_name, 
                attender_contact, 
                parseInt(age), 
                address, 
                password, 
                attenderId
            ]
        );

        // Check if any row was actually updated
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Attender not found', 
                attenderId: attenderId 
            });
        }

        res.status(200).json({ 
            message: 'Attender updated successfully',
            attenderId: attenderId 
        });
    } catch (error) {
        console.error('Error updating attender:', error);
        res.status(500).json({ 
            error: 'Server error', 
            details: error.message 
        });
    }
});

// Delete Attender Route
app.delete('/attender/delete/:attenderId', async (req, res) => {
    const { attenderId } = req.params;

    if (!attenderId) {
        return res.status(400).json({ error: 'Attender ID is required' });
    }

    try {
        // First, check if the attender exists
        const [existingAttenders] = await pool.execute(
            'SELECT * FROM attenders WHERE attender_id = ?', 
            [attenderId]
        );

        if (existingAttenders.length === 0) {
            return res.status(404).json({ 
                error: 'Attender not found', 
                attenderId: attenderId 
            });
        }

        // Delete associated data first (if needed)
        // For example, delete live locations, notifications, etc.
        await pool.execute('DELETE FROM live_location WHERE attender_id = ?', [attenderId]);
        await pool.execute('DELETE FROM notifications WHERE attender_id = ?', [attenderId]);
        
        // Delete students associated with this attender
        await pool.execute('DELETE FROM students WHERE attender_id = ?', [attenderId]);

        // Then delete the attender
        const [result] = await pool.execute(
            'DELETE FROM attenders WHERE attender_id = ?', 
            [attenderId]
        );

        res.status(200).json({ 
            message: 'Attender deleted successfully',
            attenderId: attenderId,
            deletedRows: result.affectedRows 
        });
    } catch (error) {
        console.error('Error deleting attender:', error);
        res.status(500).json({ 
            error: 'Server error', 
            details: error.message 
        });
    }
});

// Get Student Table Route
app.get('/get_student_table', async (req, res) => {
    try {
        const [students] = await pool.execute(`
            SELECT 
                s.student_id, 
                s.student_name, 
                s.class, 
                s.parent_name, 
                s.student_contact AS parent_number, 
                s.email, 
                s.bus_id, 
                s.route_id
            FROM students s
        `);
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// Get Single Student Details Route
app.get('/getstudent/:student_id', async (req, res) => {
    const { student_id } = req.params;

    if (!student_id) {
        return res.status(400).json({ error: 'Student ID is required' });
    }

    try {
        const [students] = await pool.execute(
            `SELECT 
                student_id, 
                student_name, 
                class, 
                parent_name, 
                student_contact, 
                email, 
                password, 
                attender_id, 
                bus_id, 
                route_id 
            FROM students 
            WHERE student_id = ?`, 
            [student_id]
        );

        if (students.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.status(200).json(students[0]);
    } catch (error) {
        console.error('Error fetching student details:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// Update Student Route
app.put('/student/update/:student_id', async (req, res) => {
    const { student_id } = req.params;
    const { 
        student_name, 
        class: class_name, 
        parent_name, 
        contact_number, 
        email, 
        password, 
        attendantid, 
        busid, 
        routeid 
    } = req.body;

    // Validate input
    const errors = [];
    if (!student_name) errors.push('Student Name is required');
    if (!class_name) errors.push('Class is required');
    if (!parent_name) errors.push('Parent Name is required');
    if (!contact_number) errors.push('Contact Number is required');
    if (!email) errors.push('Email is required');
    if (!password) errors.push('Password is required');
    if (!attendantid) errors.push('Attendant ID is required');
    if (!busid) errors.push('Bus ID is required');
    if (!routeid) errors.push('Route ID is required');

    if (errors.length > 0) {
        return res.status(400).json({ 
            error: 'Invalid request', 
            details: errors 
        });
    }

    try {
        // Update student in database
        const [result] = await pool.execute(
            `UPDATE students 
            SET student_name = ?, 
                class = ?, 
                parent_name = ?, 
                student_contact = ?, 
                email = ?, 
                password = ?, 
                attender_id = ?, 
                bus_id = ?, 
                route_id = ? 
            WHERE student_id = ?`, 
            [
                student_name, 
                class_name, 
                parent_name, 
                contact_number, 
                email, 
                password, 
                attendantid, 
                busid, 
                routeid, 
                student_id
            ]
        );

        // Check if any row was actually updated
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Student not found', 
                student_id: student_id 
            });
        }

        res.status(200).json({ 
            message: 'Student updated successfully',
            student_id: student_id 
        });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ 
            error: 'Server error', 
            details: error.message 
        });
    }
});

// Delete Student Route
app.delete('/delete_student/:student_id', async (req, res) => {
    const { student_id } = req.params;

    if (!student_id) {
        return res.status(400).json({ error: 'Student ID is required' });
    }

    try {
        // First, check if the student exists
        const [existingStudents] = await pool.execute(
            'SELECT * FROM students WHERE student_id = ?', 
            [student_id]
        );

        if (existingStudents.length === 0) {
            return res.status(404).json({ 
                error: 'Student not found', 
                student_id: student_id 
            });
        }

        // Delete the student
        const [result] = await pool.execute(
            'DELETE FROM students WHERE student_id = ?', 
            [student_id]
        );

        res.status(200).json({ 
            message: 'Student deleted successfully',
            student_id: student_id,
            deletedRows: result.affectedRows 
        });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ 
            error: 'Server error', 
            details: error.message 
        });
    }
});

// Get Bus Table Route
app.get('/get_buses_table', async (req, res) => {
    try {
        const [buses] = await pool.execute(`
            SELECT 
                bus_id, 
                bus_number, 
                route_id
            FROM buses
        `);
        res.status(200).json(buses);
    } catch (error) {
        console.error('Error fetching buses:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// Get Single Bus Details Route
app.get('/get_bus/:bus_id', async (req, res) => {
    const { bus_id } = req.params;

    if (!bus_id) {
        return res.status(400).json({ error: 'Bus ID is required' });
    }

    try {
        const [buses] = await pool.execute(
            `SELECT 
                bus_id, 
                bus_number, 
                route_id
            FROM buses 
            WHERE bus_id = ?`, 
            [bus_id]
        );

        if (buses.length === 0) {
            return res.status(404).json({ error: 'Bus not found' });
        }

        res.status(200).json(buses[0]);
    } catch (error) {
        console.error('Error fetching bus details:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// Add Bus Route
app.post('/bus/add', async (req, res) => {
    const { bus_number, route_id } = req.body;

    // Validate input
    const errors = [];
    if (!bus_number) errors.push('Bus Number is required');
    if (!route_id) errors.push('Route ID is required');

    if (errors.length > 0) {
        return res.status(400).json({ 
            error: 'Invalid request', 
            details: errors 
        });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO buses (bus_number, route_id) VALUES (?, ?)', 
            [bus_number, route_id]
        );

        res.status(201).json({ 
            message: 'Bus added successfully',
            bus_id: result.insertId 
        });
    } catch (error) {
        console.error('Error adding bus:', error);
        res.status(500).json({ 
            error: 'Server error', 
            details: error.message 
        });
    }
});

// Update Bus Route
app.put('/bus/update/:bus_id', async (req, res) => {
    const { bus_id } = req.params;
    const { bus_number, route_id } = req.body;

    // Validate input
    const errors = [];
    if (!bus_number) errors.push('Bus Number is required');
    if (!route_id) errors.push('Route ID is required');

    if (errors.length > 0) {
        return res.status(400).json({ 
            error: 'Invalid request', 
            details: errors 
        });
    }

    try {
        // Update bus in database
        const [result] = await pool.execute(
            `UPDATE buses 
            SET bus_number = ?, 
                route_id = ? 
            WHERE bus_id = ?`, 
            [bus_number, route_id, bus_id]
        );

        // Check if any row was actually updated
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Bus not found', 
                bus_id: bus_id 
            });
        }

        res.status(200).json({ 
            message: 'Bus updated successfully',
            bus_id: bus_id 
        });
    } catch (error) {
        console.error('Error updating bus:', error);
        res.status(500).json({ 
            error: 'Server error', 
            details: error.message 
        });
    }
});


// Get Routes Table Route
app.get('/get_route_table', async (req, res) => {
    try {
        const [routes] = await pool.execute(`
            SELECT 
                route_id, 
                stop_name
            FROM routes
        `);
        res.status(200).json(routes);
    } catch (error) {
        console.error('Error fetching routes:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// Get Profile Data Route
app.post('/get_profile_data', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Fetch student details including attender_id
        const [students] = await pool.execute(
            `SELECT 
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
            WHERE email = ?`, 
            [email]
        );

        if (students.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.status(200).json(students[0]);
    } catch (error) {
        console.error('Error fetching profile data:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// Port Configuration
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});