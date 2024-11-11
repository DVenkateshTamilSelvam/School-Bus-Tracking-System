import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import axios from '../component/axiosConfig';

const BusProfile = ({ navigation }) => {
  const [Busid, setBusid] = useState('');
  const [BusNumber, setBusNumber] = useState('');
  const [RouteID, setRouteID] = useState('');
  const [errors, setErrors] = useState({
    Busid: '',
    BusNumber: '',
    RouteID: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Bus ID validation: Numeric characters only
    if (!/^\d+$/.test(Busid)) {
      newErrors.Busid = 'Please enter a valid Bus ID (numeric characters only)';
      valid = false;
    }

    // Bus Number validation: Any characters
    if (!BusNumber.trim()) {
      newErrors.BusNumber = 'Please enter a valid Bus Number';
      valid = false;
    }

    // Route ID validation: Numeric characters only
    if (!/^\d+$/.test(RouteID)) {
      newErrors.RouteID = 'Please enter a valid Route ID (numeric characters only)';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      axios.post('/buses/add', {
        bus_id: Busid,
        bus_number: BusNumber, 
        route_id: RouteID,
      })
      .then(response => {
        console.log(response.data);  
        setSuccessMessage('Bus added successfully');
      })
      .catch(error => {
        console.error('Error adding Bus:', error);
        setError('Error adding Bus');
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
          <Image source={require('../asset/backarrow.png')} style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.label}>Bus Details</Text>
      </View>
      
      <Text style={styles.InputLabel}>Bus ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Bus Id"
        placeholderTextColor="black"
        value={Busid}
        onChangeText={setBusid}
      />
      {errors.Busid !== '' && <Text style={styles.error}>{errors.Busid}</Text>}
      
      <Text style={styles.InputLabel}>Bus Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Bus Number"
        placeholderTextColor="black"
        value={BusNumber}
        onChangeText={setBusNumber}
      />
      {errors.BusNumber !== '' && <Text style={styles.error}>{errors.BusNumber}</Text>}
      
      <Text style={styles.InputLabel}>Route ID</Text>
      <TextInput
        style={styles.input}
        placeholder="RouteID"
        placeholderTextColor="black"
        value={RouteID}
        onChangeText={setRouteID}
      />
      {errors.RouteID !== '' && <Text style={styles.error}>{errors.RouteID}</Text>}
     
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
    borderRadius: 15,
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

export default BusProfile;
