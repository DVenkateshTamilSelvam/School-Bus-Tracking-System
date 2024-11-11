import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  User,
  Phone,
  Mail,
  Key,
  Book,
  Users,
  Bus,
  MapPin,
  Save,
  ArrowLeft,
} from 'lucide-react-native';
import axios from '../component/axiosConfig';

const EditStudentScreen = ({ route, navigation }) => {
  const { student_id } = route.params;
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [studentId, setStudentID] = useState('');
  const [Class, setClass] = useState('');
  const [ParentName, setParentName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [Email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Attendantid, setAttendantid] = useState('');
  const [BusID, setBusID] = useState('');
  const [RouteID, setRouteID] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchStudentDetails();
  }, [student_id]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/getstudent/${student_id}`);
      const studentData = response.data;
      
      setUsername(studentData.student_name || '');
      setStudentID(studentData.student_id?.toString() || '');
      setClass(studentData.class || '');
      setParentName(studentData.parent_name || '');
      setContactNumber(studentData.student_contact || '');
      setEmail(studentData.email || '');
      setPassword(studentData.password || '');
      setAttendantid(studentData.attender_id?.toString() || '');
      setBusID(studentData.bus_id?.toString() || '');
      setRouteID(studentData.route_id?.toString() || '');
    } catch (error) {
      console.error('Error fetching student data:', error);
      Alert.alert('Error', 'Failed to load student details');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!/^[a-zA-Z\s]+$/.test(username)) {
      newErrors.username = 'Please enter a valid name';
    }
    if (!/^[a-zA-Z0-9]+$/.test(Class)) {
      newErrors.Class = 'Please enter a valid class';
    }
    if (!/^[a-zA-Z\s]+$/.test(ParentName)) {
      newErrors.ParentName = 'Please enter a valid parent name';
    }
    if (!/^\d{10}$/.test(contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid 10-digit number';
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(Email)) {
      newErrors.Email = 'Please enter a valid email';
    }
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!/^\d+$/.test(Attendantid)) {
      newErrors.Attendantid = 'Please enter a valid attendant ID';
    }
    if (!/^\d+$/.test(BusID)) {
      newErrors.BusID = 'Please enter a valid bus ID';
    }
    if (!/^\d+$/.test(RouteID)) {
      newErrors.RouteID = 'Please enter a valid route ID';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        await axios.put(`/student/update/${student_id}`, {
          student_id: studentId,
          student_name: username,
          class: Class,
          parent_name: ParentName,
          contact_number: contactNumber,
          email: Email,
          password: password,
          attendantid: Attendantid,
          busid: BusID,
          routeid: RouteID
        });
        Alert.alert(
          'Success',
          'Student updated successfully',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } catch (error) {
        console.error('Error updating student:', error);
        Alert.alert('Error', 'Failed to update student');
      } finally {
        setLoading(false);
      }
    }
  };

  const InputField = ({ icon, label, value, onChangeText, error, secureTextEntry = false, keyboardType = 'default', editable = true }) => (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        {icon}
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      <TextInput
        style={[
          styles.input,
          !editable && styles.disabledInput,
          error && styles.inputError
        ]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        editable={editable}
        placeholderTextColor="#666"
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
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
        <Text style={styles.headerTitle}>Edit Student</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <InputField
            icon={<User size={20} color="#F46969" />}
            label="Student Name"
            value={username}
            onChangeText={setUsername}
            error={errors.username}
          />

          <InputField
            icon={<Book size={20} color="#F46969" />}
            label="Student ID"
            value={studentId}
            editable={false}
          />

          <InputField
            icon={<Book size={20} color="#F46969" />}
            label="Class"
            value={Class}
            onChangeText={setClass}
            error={errors.Class}
          />

          <InputField
            icon={<Users size={20} color="#F46969" />}
            label="Parent Name"
            value={ParentName}
            onChangeText={setParentName}
            error={errors.ParentName}
          />

          <InputField
            icon={<Phone size={20} color="#F46969" />}
            label="Contact Number"
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
            error={errors.contactNumber}
          />

          <InputField
            icon={<Mail size={20} color="#F46969" />}
            label="Email"
            value={Email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.Email}
          />

          <InputField
            icon={<Key size={20} color="#F46969" />}
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />

          <InputField
            icon={<Users size={20} color="#F46969" />}
            label="Attendant ID"
            value={Attendantid}
            onChangeText={setAttendantid}
            keyboardType="numeric"
            error={errors.Attendantid}
          />

          <InputField
            icon={<Bus size={20} color="#F46969" />}
            label="Bus ID"
            value={BusID}
            onChangeText={setBusID}
            keyboardType="numeric"
            error={errors.BusID}
          />

          <InputField
            icon={<MapPin size={20} color="#F46969" />}
            label="Route ID"
            value={RouteID}
            onChangeText={setRouteID}
            keyboardType="numeric"
            error={errors.RouteID}
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
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#666',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
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

export default EditStudentScreen;