import React, { useState } from 'react';
import { View, TextInput, Image, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import axios from '../component/axiosConfig';
import { AnnotationContextImpl } from 'twilio/lib/rest/insights/v1/call/annotation';

const { width, height } = Dimensions.get('window');

const AttenderLogin = ({ navigation }) => {
  const [attender_id, setAttender_id] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleLogin = async () => {
    try {
      const response = await axios.post('/attender/login', { attender_id, password });
      if (response.data.status === 'success') {
        console.log('Login successful:', response.data);
        navigation.replace('AHS', {attender_id});
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error('Full error:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      setErrorMessage('Login failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundCircle} />
      <View style={styles.smallCircle} />
      <Text style={styles.Attendant}>Hello, Attendant</Text>
      <Text style={styles.Titles}>SIGN-IN</Text>
      <TextInput
        style={styles.input1}
        placeholder="Attender ID"
        placeholderTextColor="black" // Set placeholder text color
        value={attender_id}
        onChangeText={setAttender_id}
      />
      <TextInput
        style={styles.input2}
        placeholder="Password"
        placeholderTextColor="black" // Set placeholder text color
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Text style={styles.errorText}>{errorMessage}</Text>
      <TouchableOpacity onPress={handleLogin}>
      <Text style={styles.button}>Submit</Text>
      </TouchableOpacity>

    
      <Image 
          source={require('../asset/attender_logo.png')}
          style={styles.attenderLogo}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Attendant:{
    color: 'White',
    fontFamily: 'Inter_18pt-Regular',
    marginTop: 200,
    marginRight: 100,
    fontSize: 30,
  },
  Titles:{
    color: 'black',
    marginTop: 120,
    marginBottom: 30,
    fontSize: 30,
    fontFamily: 'Inter_18pt-Regular'
  },
  backgroundCircle: {
    position: 'absolute',
    width: width * 1.0,
    height: width * 1.0,
    borderRadius: width * 0.75,
    backgroundColor: 'rgba(30, 42, 120, 0.1)', // Light blue color with opacity
    top: -width * 0.75,
    left: -width * 0.25,
    marginTop: 150,
    marginLeft: 20,
    backgroundColor: '#DC8241',
    zIndex: -1
  },
  smallCircle: {
    position: 'absolute',
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.75,
    backgroundColor: 'rgba(30, 42, 120, 0.1)', // Light blue color with opacity
    top: -width * 0.0,
    right: -width * 0.1,
    marginTop: 150,
    marginLeft: 20,
    backgroundColor: '#DC8241',
    zIndex: -1
  },
  input1: {
    height: 52,
    width: 287,
    borderColor: '#DC8241',
    borderWidth: 3,
    borderRadius: 25,
    paddingLeft: 10,
    marginBottom: 10,
    
    color: 'grey',
  },
  input2: {
    height: 52,
    width: 287,
    borderColor: '#DC8241',
    borderWidth: 3,
    borderRadius: 25,
    paddingLeft: 10,
    marginBottom: 10,
    marginTop: 40,
    color: 'grey',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    color: 'white',
    fontFamily: 'Inter_18pt-Regular',
    fontSize: 20,
    backgroundColor: '#DC8241',
    padding: 20,
    borderRadius: 35,
  },
  attenderLogo:{
    marginVertical: 100,
    marginRight: 200,
  }
});

export default AttenderLogin;
