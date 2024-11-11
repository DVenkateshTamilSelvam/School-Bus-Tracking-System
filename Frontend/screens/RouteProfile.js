import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import axios from '../component/axiosConfig';
import { ChevronLeft } from 'lucide-react-native';

const RouteProfile = ({ navigation }) => {
  const [RouteID, setRouteID] = useState('');
  const [stop_name, setstop_name] = useState('');
  const [errors, setErrors] = useState({
    RouteID: '',
    stop_name: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Route ID validation: Numeric characters only
    if (!/^\d+$/.test(RouteID)) {
      newErrors.RouteID = 'Please enter a valid Route ID (numeric characters only)';
      valid = false;
    }

    // Stop Name validation: Any characters
    if (!stop_name.trim()) {
      newErrors.stop_name = 'Please enter a valid Stop Name';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      axios.post('/route/add', {
        route_id: RouteID,
        stop_name: stop_name,
      })
      .then(response => {
        console.log(response.data);  
        setSuccessMessage('Routes added successfully');
        setRouteID ('');
        setstop_name('');
      })
      .catch(error => {
        console.error('Error adding Routes:', error);
        setErrors('Error adding Routes');
      });
    }
  }; 

  const handleBack = () => {
    navigation.goBack(); 
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.top}>
        <TouchableOpacity onPress={handleBack}>
        <ChevronLeft size={45} color={"black"}/>
        </TouchableOpacity>
        <Text style={styles.label}>Route Details</Text>
      </View>
      
      <Text style={styles.InputLabel}>Route ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Route Id"
        placeholderTextColor="black"
        value={RouteID}
        onChangeText={setRouteID}
      />
      {errors.RouteID !== '' && <Text style={styles.error}>{errors.RouteID}</Text>}
      
      <Text style={styles.InputLabel}> Stop Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Stop Name"
        placeholderTextColor="black"
        value={stop_name}
        onChangeText={setstop_name}
      />
      {errors.stop_name !== '' && <Text style={styles.error}>{errors.stop_name}</Text>}
     
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      
      {successMessage !== '' && <Text style={styles.successMessage}>{successMessage}</Text>}
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
    color: 'black',
  },
  input: {
    height: 40,
    backgroundColor: 'white',
    color: 'black',
    borderColor: '#F46969',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 55,
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#F46969',
    padding: 10,
    borderRadius: 5,
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

export default RouteProfile;
