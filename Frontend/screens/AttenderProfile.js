import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, Alert } from 'react-native';
import axios from '../component/axiosConfig';
import {ChevronLeft} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const AttenderProfile = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [Attendantid, setAttendantid] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    username: '',
    Attendantid: '',
    address: '',
    contactNumber: '',
    age: '',
    password: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Username validation: Alphabet characters only
    if (!/^[a-zA-Z]+$/.test(username)) {
      newErrors.username = 'Please enter a valid username (alphabet characters only)';
      valid = false;
    }

    // Attendant ID validation: Numeric characters only
    if (!/^\d+$/.test(Attendantid)) {
      newErrors.Attendantid = 'Please enter a valid attendant ID (numeric characters only)';
      valid = false;
    }

    // Address validation: Any characters
    if (!address.trim()) {
      newErrors.address = 'Please enter a valid address';
      valid = false;
    }

    // Contact Number validation: Numeric characters only
    if (!/^\d+$/.test(contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid contact number (numeric characters only)';
      valid = false;
    }

    // Age validation: Numeric characters only
    if (!/^\d+$/.test(age)) {
      newErrors.age = 'Please enter a valid age (numeric characters only)';
      valid = false;
    }

    // Password validation: At least 6 characters
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const clearFormFields = () => {
    setUsername('');
    setAttendantid('');
    setAddress('');
    setContactNumber('');
    setAge('');
    setPassword('');
    setErrors({
      username: '',
      Attendantid: '',
      address: '',
      contactNumber: '',
      age: '',
      password: '',
    });
  };

  const handleLogin = () => {
    if (validateForm()) {
      axios.post('/attender/add', {
        attender_id: Attendantid,
        attender_name: username,
        attender_contact: contactNumber,
        age: age,
        address: address,
        password: password,
      })
      .then(response => {
        console.log('Success Response:', response.data);
        
        // Show alert
        Alert.alert(
          'Account Creation Successful', 
          'Attender account has been created successfully.',
          [
            {
              text: 'OK', 
              onPress: () => {
                // Clear form fields after successful creation
                clearFormFields();
                // Optionally navigate back or to another screen
                // navigation.goBack();
              }
            }
          ]
        );
      })
      .catch(error => {
        console.error('Full Error Object:', error);
        console.error('Error Response:', error.response);
        console.error('Error Request:', error.request);

        if (error.response) {
          Alert.alert(
            'Error', 
            error.response.data.details 
              ? error.response.data.details.join('\n') 
              : error.response.data.error
          );
        } else if (error.request) {
          Alert.alert('Error', 'No response received from server');
        } else {
          Alert.alert('Error', 'Error setting up the request');
        }
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.top}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
      <ChevronLeft size={45} color="black"/>
        
      </TouchableOpacity>
      <View style={styles.circle}/>
        <View style={styles.square}/>
        <View style={styles.circle1}/>
        <Text style={styles.label}>Attender Details</Text>
      </View>
      <Text style={styles.InputLabel}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#C28686"
        value={username}
        onChangeText={setUsername}
      />
      {errors.username !== '' && <Text style={styles.error}>{errors.username}</Text>}
      <Text style={styles.InputLabel}>Attender ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Attender Id"
        placeholderTextColor="#C28686"
        value={Attendantid}
        onChangeText={setAttendantid}
      />
      {errors.Attendantid !== '' && <Text style={styles.error}>{errors.Attendantid}</Text>}
      <Text style={styles.InputLabel}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Address"
        placeholderTextColor="#C28686"
        value={address}
        onChangeText={setAddress}
      />
      {errors.address !== '' && <Text style={styles.error}>{errors.address}</Text>}
      <Text style={styles.InputLabel}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#C28686"
        value={contactNumber}
        onChangeText={setContactNumber}
      />
      {errors.contactNumber !== '' && <Text style={styles.error}>{errors.contactNumber}</Text>}
      <Text style={styles.InputLabel}>Age</Text>
      <TextInput
        style={styles.input}
        placeholder="Age"
        placeholderTextColor="#C28686"
        value={age}
        onChangeText={setAge}
      />
      {errors.age !== '' && <Text style={styles.error}>{errors.age}</Text>}
      <Text style={styles.InputLabel}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#C28686"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      {errors.password !== '' && <Text style={styles.error}>{errors.password}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  circle: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    backgroundColor: 'rgba(244, 105, 105, 0.5)',
    borderRadius: 400, // Half the width/height to make it a circle
    zIndex: -2,
  },
  square:{
    position: 'absolute',
    width: 150, // Square width
    height: 150, // Square height
    backgroundColor: 'rgba(244, 105, 105, 0.5)', // 50% transparent color
    zIndex: -3,
    top: 680,
    right: 300,
    transform: [{ rotate: '22deg' }],
  },
  circle1: {
    position: 'absolute',
    top: 650,
    left: 250,
    width: 180,
    height: 180,
    backgroundColor: 'rgba(244, 105, 105, 0.5)',
    borderRadius: 100,
    zIndex: -1,
  },

  top: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backArrow: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  label: {
    fontSize: 25,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: 'black',
  },
  InputLabel: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C28686',
  },
  input: {
    height: 40,
    backgroundColor: 'white',
    color: 'black',
    borderColor: '#F46969',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 2,
  },
  button: {
    backgroundColor: '#F46969',
    
    borderRadius: 55,
    marginTop: 20,
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
  successMessage: {
    color: 'green',
    marginTop: 5,
  },
});

export default AttenderProfile;
