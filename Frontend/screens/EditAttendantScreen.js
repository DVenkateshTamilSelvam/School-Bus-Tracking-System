import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { User, Phone, MapPin, Key, Calendar, ArrowLeft, Save } from 'lucide-react-native';
import axios from '../component/axiosConfig';

const EditAttendantScreen = ({ route, navigation }) => {
  const { attendantId } = route.params;
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');

  // Refs for input fields to manage focus
  const addressInputRef = useRef(null);
  const contactInputRef = useRef(null);
  const ageInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    fetchAttendantDetails();
  }, [attendantId]);

  const fetchAttendantDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/get_attendant_details/${attendantId}`);
      const data = response.data;
      setUsername(data.attender_name);
      setContactNumber(data.attender_contact);
      setAge(data.age?.toString() || '');
      setAddress(data.address);
      setPassword(data.password);
    } catch (error) {
      console.error('Error fetching attender details:', error);
      Alert.alert('Error', 'Failed to load attendant details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    // Dismiss keyboard before update
    Keyboard.dismiss();

    // Validate inputs
    if (!username || !address || !contactNumber || !age || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      setLoading(true);
      await axios.put(`/attender/update/${attendantId}`, {
        attender_name: username,
        attender_contact: contactNumber,
        age: parseInt(age),
        address,
        password,
      });
      Alert.alert(
        'Success',
        'Attendant updated successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          }
        ]
      );
    } catch (error) {
      console.error('Error updating attender:', error);
      Alert.alert('Error', error.response?.data?.details || 'Failed to update attendant');
    } finally {
      setLoading(false);
    }
  };

  // Custom input component with improved keyboard handling
  const InputField = ({ 
    icon, 
    label, 
    value, 
    onChangeText, 
    secureTextEntry = false, 
    keyboardType = 'default',
    ref,
    onSubmitEditing,
    returnKeyType = 'next'
  }) => (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        {icon}
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      <TextInput
        ref={ref}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholderTextColor="#666"
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={false}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#F46969" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Attendant</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <InputField
            icon={<User size={20} color="#F46969" />}
            label="Username"
            value={username}
            onChangeText={setUsername}
            onSubmitEditing={() => addressInputRef.current.focus()}
            ref={null}
          />

          <InputField
            icon={<MapPin size={20} color="#F46969" />}
            label="Address"
            value={address}
            onChangeText={setAddress}
            ref={addressInputRef}
            onSubmitEditing={() => contactInputRef.current.focus()}
          />

          <InputField
            icon={<Phone size={20} color="#F46969" />}
            label="Contact Number"
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
            ref={contactInputRef}
            onSubmitEditing={() => ageInputRef.current.focus()}
          />

          <InputField
            icon={<Calendar size={20} color="#F46969" />}
            label="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            ref={ageInputRef}
            onSubmitEditing={() => passwordInputRef.current.focus()}
          />

          <InputField
            icon={<Key size={20} color="#F46969" />}
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            ref={passwordInputRef}
            returnKeyType="done"
            onSubmitEditing={handleUpdate}
          />

          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Save size={20} color="#fff" />
            <Text style={styles.updateButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    elevation: 2,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F46969',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
    elevation: 2,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditAttendantScreen;