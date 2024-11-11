import React, { useState } from 'react';
import { View, TextInput, Image, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import axios from '../component/axiosConfig'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');
 const ParentLogin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', { email, password });
      if (response.data.success) {
        AsyncStorage.setItem('email', email)
        navigation.navigate('PH');
      } else {
        setErrorMessage('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundCircle}/>
      <View style={styles.smallCircle} />
      <Text style={styles.Parents}>Hello, Parents</Text>
      <Text style={styles.Titles}>SIGN-IN</Text>
      <TextInput
        style={styles.input1}
        placeholder="Email"
        placeholderTextColor="grey"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input2}
        placeholder="Password"
        placeholderTextColor="grey"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Text style={styles.errorText}>{errorMessage}</Text>
      <TouchableOpacity onPress={handleLogin}>
      <Text style={styles.button}>Submit</Text>
      </TouchableOpacity>

      <Image 
          source={require('../asset/parentLogo.png')}
          style={styles.ParentLogo}
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
  Parents:{
    color: 'White',
    fontFamily: 'Inter_18pt-Regular',
    marginTop: 0,
    marginLeft: 110,
    fontSize: 50,
  },
  Titles:{
    color: 'black',
    marginTop: 70,
    marginBottom: 70,
    fontSize: 30,
    fontFamily: 'Inter_18pt-Regular'
  },
  backgroundCircle:{
    position: 'absolute',
    width: width*1.0,
    height: width*1.0,
    borderRadius: width * 0.75,
    backgroundColor: 'rgba(30, 42, 120, 0.1)', // Light blue color with opacity
    top: -width * 0.70,
    right: -width * 0.20,
    marginTop: 150,
    marginLeft: 20,
    backgroundColor: '#7BB8FF',
    zIndex: -1
  },
  smallCircle: {
    position: 'absolute',
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.75,
    backgroundColor: 'rgba(30, 42, 120, 0.1)', // Light blue color with opacity
    top: -width * 0.0,
    left: -width * 0.15,
    marginTop: 150,
    marginLeft: 20,
    backgroundColor: '#7BB8FF',
    zIndex: -1
  },
  input1: {
    height: 52,
    width: 287,
    borderColor: '#7BB8FF',
    borderWidth: 3,
    borderRadius: 25,
    paddingLeft: 10,
    marginBottom: 10,
    
    color: 'black',
  },
  input2: {
    height: 52,
    width: 287,
    borderColor: '#7BB8FF',
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
    backgroundColor: '#7BB8FF',
    padding: 20,
    borderRadius: 35,
  },
  ParentLogo:{
    marginBottom: -70,
    width: 420,
    zIndex: -1
  }
});

export default ParentLogin;
