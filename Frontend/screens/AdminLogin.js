import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Dimensions, TextInput } from 'react-native';
import axios from '../component/axiosConfig';


const { width } = Dimensions.get('window');

const AdminLogin = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleLogin = async () => {
    try {
      const response = await axios.post('/admin/login', { username, password });
      console.log(response.data);
      setErrorMessage('Match Found');
      navigation.replace('AdminHomeScreen');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setErrorMessage('Invalid credentials. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundCircle} />
      <Text style={styles.Admin}>Hello, Admin</Text>
      <Text style={styles.Titles}>SIGN-IN</Text>
      <TextInput
        style={styles.input1}
        placeholder="Username"
        placeholderTextColor="black" // Set placeholder text color
        value={username}
        onChangeText={setUsername}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    // eslint-disable-next-line no-dupe-keys
    backgroundColor: '#F46969',
    zIndex: -1,
  },
  Admin:{
    color: 'White',
    fontFamily: 'Inter_18pt-Regular',
    marginTop: -80,
    marginRight: 90,
    fontSize: 30,
  },
  Titles:{
    color: 'black',
    marginTop: 150,
    marginBottom: 30,
    fontSize: 30,
    fontFamily: 'Inter_18pt-Regular',
  },
  input1: {
    height: 52,
    width: 287,
    borderColor: 'red',
    borderWidth: 3,
    borderRadius: 25,
    paddingLeft: 10,
    marginBottom: 10,
    color: 'grey',
  },
  input2: {
    height: 52,
    width: 287,
    borderColor: 'red',
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
    backgroundColor: '#F46969',
    padding: 20,
    borderRadius: 35,
  },
});

export default AdminLogin;
