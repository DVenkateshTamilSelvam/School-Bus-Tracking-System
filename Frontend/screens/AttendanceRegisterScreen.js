import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from '../component/axiosConfig';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const AttendanceRegisterScreen = ({ attendantId }) => {
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);
    
  const fetchStudents = () => {
    axios.get(`/get_student_table`)
      .then(response => {
        setStudents(response.data);
        const initialAttendanceRecords = response.data.map(student => ({
          student_id: student.student_id,
          isPresent: 0,
        }));
        setAttendanceRecords(initialAttendanceRecords);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });
  };

  const updateAttendanceRecord = (studentId, isPresent) => {
    const updatedAttendanceRecords = attendanceRecords.map(record => {
      if (record.student_id === studentId) {
        return { ...record, isPresent };
      }
      return record;
    });
    setAttendanceRecords(updatedAttendanceRecords);
  };

  const markAttendance = (studentId, isPresent) => {
    updateAttendanceRecord(studentId, isPresent ? 1 : 0);
  };

  const saveAttendance = () => {
    const attendanceData = students.map(student => {
      const record = attendanceRecords.find(
        record => record.student_id === student.student_id
      );
      return {
        studentId: student.student_id,
        isPresent: record ? (record.isPresent === 1 ? 'present' : 'absent') : 'absent',
      };
    });

    console.log('Attendance Data:', attendanceData);

    axios
      .post('/save_attendance', attendanceData)
      .then(response => {
        console.log('Attendance saved successfully:', response.data);
        setShowSuccessMessage(true);
        setIsSaveDisabled(true);
        setTimeout(() => {
          setIsSaveDisabled(false);
        }, 2 * 60 * 60 * 1000);

        // Filter present students
        const presentStudents = students.filter(student =>
          attendanceRecords.some(record =>
            record.student_id === student.student_id && record.isPresent === 1
          )
        );

        // Update status of present students to "reached"
        updateStatusToReached(presentStudents);
      })
      .catch(error => {
        console.error('Error saving attendance:', error);
      });
  };

  const updateStatusToReached = (presentStudents) => {
    // Implement logic to update status to "reached" in the database
    console.log('Updating status to "reached" for present students:', presentStudents);
    // Make API call or perform necessary actions here
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.date}>Date: {new Date().toDateString()}</Text>
      <View style={styles.headerContainer}>
        <Text style={styles.headerItem}>Name</Text>
        <Text style={styles.headerItem}>Phone Number</Text>
        <Text style={styles.headerItem}>Parent Name</Text>
        <Text style={styles.headerItem}>Present or Absent</Text>
      </View>
      {students.map(student => (
        <View key={student.student_id} style={styles.studentRow}>
          <Text style={styles.studentItem}>{student.student_name}</Text>
          <Text style={styles.studentItem}>{student.student_contact}</Text>
          <Text style={styles.studentItem}>{student.parent_name}</Text>
          <View style={styles.checkboxContainer}>
            <BouncyCheckbox
              isChecked={
                attendanceRecords.some(
                  record => record.student_id === student.student_id && record.isPresent === 1
                )
              }
              fillColor="#F46969"
              onPress={newValue => markAttendance(student.student_id, newValue)}
              style={styles.checkbox}
            />
          </View>
        </View>
      ))}
      <TouchableOpacity onPress={saveAttendance} disabled={isSaveDisabled} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Attendance</Text>
      </TouchableOpacity>
      {showSuccessMessage && (
        <View>
          <Text style={styles.successMessage}>Attendance saved successfully!</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerItem: {
    flex: 1,
    color: '#F46969',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  studentItem: {
    flex: 1,
    color: 'black',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#F46969',
    borderRadius: 55,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  saveButtonText: {
    color: 'white',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 10,
  },
  successMessage: {
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default AttendanceRegisterScreen;
