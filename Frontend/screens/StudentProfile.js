import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import axios from '../component/axiosConfig';
import { ChevronLeft } from 'lucide-react-native';

const StudentProfile = ({ navigation }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage('');
    }, 3000); // Set the duration in milliseconds, e.g., 3000 for 3 seconds

    return () => clearTimeout(timer); // Cleanup function to clear the timeout on component unmount
  }, [successMessage]); 

  const [username, setUsername] = useState('');
  const [StudentID, setStudentID] = useState('');
  const [Class, setClass] = useState('');
  const [ParentName, setParentName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [Email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Attendantid, setAttendantid] = useState('');
  const [BusID, setBusID] = useState('');
  const [RouteID, setRouteID] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({
    username: '',
    StudentID: '',
    Class: '',
    ParentName: '',
    contactNumber: '',
    Email: '',
    password: '',
    Attendantid: '',
    BusID: '',
    RouteID: '',
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Username validation: Alphabet characters only
    if (!/^[a-zA-Z]+$/.test(username)) {
      newErrors.username = 'Please enter a valid username (alphabet characters only)';
      valid = false;
    }

    // Student ID validation: Numeric characters only
    if (!/^\d+$/.test(StudentID)) {
      newErrors.StudentID = 'Please enter a valid student ID (numeric characters only)';
      valid = false;
    }

    // Class validation: Alphanumeric characters only
    if (!/^[a-zA-Z0-9]+$/.test(Class)) {
      newErrors.Class = 'Please enter a valid class (alphanumeric characters only)';
      valid = false;
    }

    // Parent Name validation: Alphabet characters only
    if (!/^[a-zA-Z]+$/.test(ParentName)) {
      newErrors.ParentName = 'Please enter a valid parent name (alphabet characters only)';
      valid = false;
    }

    // Contact Number validation: Numeric characters only
    if (!/^\d+$/.test(contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid contact number (numeric characters only)';
      valid = false;
    }

    // Email validation: Standard email format
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(Email)) {
      newErrors.Email = 'Please enter a valid email address';
      valid = false;
    }

    // Password validation: At least 6 characters
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      valid = false;
    }

    // Attendant ID validation: Numeric characters only
    if (!/^\d+$/.test(Attendantid)) {
      newErrors.Attendantid = 'Please enter a valid attendant ID (numeric characters only)';
      valid = false;
    }

    // Bus ID validation: Numeric characters only
    if (!/^\d+$/.test(BusID)) {
      newErrors.BusID = 'Please enter a valid bus ID (numeric characters only)';
      valid = false;
    }

    // Route ID validation: Numeric characters only
    if (!/^\d+$/.test(RouteID)) {
      newErrors.RouteID = 'Please enter a valid route ID (numeric characters only)';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      // Axios request to Flask API endpoint
      axios.post('/student/add', {
        student_id: StudentID,
        student_name: username,
        class: Class,
        parent_name: ParentName,
        contact_number: contactNumber,
        email: Email,
        password: password,
        attendantid: Attendantid,
        busid: BusID,
        routeid: RouteID
      })
      .then(response => {
        console.log(response.data);  // Log the response from the server
        setSuccessMessage('Student added successfully');
        setStudentID('');
        setUsername('');
        setClass('');
        setParentName('');
        setContactNumber('');
        setEmail('');
        setPassword('');
        setAttendantid('');
        setBusID('');
        setRouteID('');
      })
      .catch(error => {
        console.error('Error adding student:', error);
      });
    }
  };

  const handleBack = () => {
    navigation.goBack(); // Use goBack to navigate back to the previous screen
  };

  return (
    
    <ScrollView style={styles.container}>
      
      <View style={styles.top}>
      
        <TouchableOpacity onPress={handleBack}>
        <ChevronLeft size={45} color={"black"}/>
        </TouchableOpacity>
        <Text style={styles.label}>Student Details</Text>
        
      </View>
      <Text style={styles.InputLabel}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="black"
        value={username}
        onChangeText={setUsername}
      />
      {errors.username !== '' && <Text style={styles.error}>{errors.username}</Text>}
      <Text style={styles.InputLabel}>Student ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Student Id"
        placeholderTextColor="black"
        value={StudentID}
        onChangeText={setStudentID}
      />
      {errors.StudentID !== '' && <Text style={styles.error}>{errors.StudentID}</Text>}
      <Text style={styles.InputLabel}>Class</Text>
      <TextInput
        style={styles.input}
        placeholder="Class"
        placeholderTextColor="black"
        value={Class}
        onChangeText={setClass}
      />
      {errors.Class !== '' && <Text style={styles.error}>{errors.Class}</Text>}
      <Text style={styles.InputLabel}>Parent Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Parent Name"
        placeholderTextColor="black"
        value={ParentName}
        onChangeText={setParentName}
      />
      {errors.ParentName !== '' && <Text style={styles.error}>{errors.ParentName}</Text>}
      <Text style={styles.InputLabel}>Contact Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        placeholderTextColor="black"
        value={contactNumber}
        onChangeText={setContactNumber}
      />
      {errors.contactNumber !== '' && <Text style={styles.error}>{errors.contactNumber}</Text>}
      <Text style={styles.InputLabel}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="black"
        value={Email}
        onChangeText={setEmail}
      />
      {errors.Email !== '' && <Text style={styles.error}>{errors.Email}</Text>}
      <Text style={styles.InputLabel}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="black"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      {errors.password !== '' && <Text style={styles.error}>{errors.password}</Text>}
      <Text style={styles.InputLabel}>Bus Id</Text>
      <TextInput
        style={styles.input}
        placeholder="Bus ID"
        placeholderTextColor="black"
        value={BusID}
        onChangeText={setBusID}
      />
      {errors.BusID !== '' && <Text style={styles.error}>{errors.BusID}</Text>}
      <Text style={styles.InputLabel}>Attendant ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Attendant ID"
        placeholderTextColor="black"
        value={Attendantid}
        onChangeText={setAttendantid}
      />
      {errors.Attendantid !== '' && <Text style={styles.error}>{errors.Attendantid}</Text>}
      <Text style={styles.InputLabel}>Route ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Route ID"
        placeholderTextColor="black"
        value={RouteID}
        onChangeText={setRouteID}
      />
      {errors.RouteID !== '' && <Text style={styles.error}>{errors.RouteID}</Text>}
      {successMessage !== '' && <Text style={styles.successMessage}>{successMessage}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <Image source={require('../asset/stdschl.png')} style={styles.icon} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  
  label: {
    fontSize: 25,
    
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: 'black',
  },
  icon:{
    zIndex: -20,
    top: -10,
    right: 20,
    position: 'absolute',
    transform: [{rotate: '2deg'}]
  },
  InputLabel: {
    marginTop: 10,
    fontSize: 16,
    color: '#F46969',
    fontWeight: 'bold',
    
  },
  input: {
    height: 40,
    backgroundColor: 'white',
    color: 'black',
    borderColor: '#F46969',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderWidth: 1,
    color: '#C28686',
  },
  button: {
    backgroundColor: '#F46969',
    padding: 10,
    borderRadius: 55,
    marginTop: 20,
    marginBottom: 60,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
  successMessage:{
     color: 'green',
  },
});

export default StudentProfile;
