import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import axios from '../component/axiosConfig';
import { Table, Row, Rows } from 'react-native-table-component';

const ITEMS_PER_PAGE = 10;
const windowWidth = Dimensions.get('window').width;

// Define fixed column widths
const COLUMN_WIDTHS = {
  id: 80,        // Student ID
  name: 150,     // Student Name
  class: 80,     // Class
  parent: 150,   // Parent Name
  contact: 120,  // Contact Number
  email: 200,    // Email
  busId: 80,     // Bus ID
  route: 80,     // Route ID
  actions: 140   // Actions
};

const ManageStudentScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const tableHead = [
    { title: 'Student ID', width: COLUMN_WIDTHS.id },
    { title: 'Student Name', width: COLUMN_WIDTHS.name },
    { title: 'Class', width: COLUMN_WIDTHS.class },
    { title: 'Parent Name', width: COLUMN_WIDTHS.parent },
    { title: 'Contact', width: COLUMN_WIDTHS.contact },
    { title: 'Email', width: COLUMN_WIDTHS.email },
    { title: 'Bus ID', width: COLUMN_WIDTHS.busId },
    { title: 'Route', width: COLUMN_WIDTHS.route },
    { title: 'Actions', width: COLUMN_WIDTHS.actions }
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/get_student_table');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student_id) => {
    navigation.navigate('EditStudentScreen', { student_id });
  };

  const handleDelete = async (studentId) => {
    try {
      setLoading(true);
      await axios.delete(`/delete_student/${studentId}`);
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const filteredStudents = students.filter(student =>
    Object.values(student).some(value =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

  // Create table rows with fixed widths
  const tableData = paginatedStudents.map(student => [
    { value: student.student_id, width: COLUMN_WIDTHS.id },
    { value: student.student_name, width: COLUMN_WIDTHS.name },
    { value: student.class, width: COLUMN_WIDTHS.class },
    { value: student.parent_name, width: COLUMN_WIDTHS.parent },
    { value: student.parent_number?.toString() || '-', width: COLUMN_WIDTHS.contact },
    { value: student.email, width: COLUMN_WIDTHS.email },
    { value: student.bus_id || '-', width: COLUMN_WIDTHS.busId },
    { value: student.route_id || '-', width: COLUMN_WIDTHS.route },
    {
      value: (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEdit(student.student_id)}
          >
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(student.student_id)}
          >
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ),
      width: COLUMN_WIDTHS.actions
    }
  ]);

  const renderTableCell = (data, index) => (
    <View key={index} style={[styles.cell, { width: data.width }]}>
      {typeof data.value === 'object' ? data.value : (
        <Text style={styles.cellText} numberOfLines={1}>{data.value}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Students</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigation.navigate('StudentProfile')}
        >
          <Text style={styles.addButtonText}>+ Add Student</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search students..."
          placeholderTextColor={"black"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#F46969" style={styles.loader} />
      ) : (
        <>
          {/* Table */}
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={styles.tableContainer}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                {tableHead.map((header, index) => (
                  <View key={index} style={[styles.headerCell, { width: header.width }]}>
                    <Text style={styles.headerText}>{header.title}</Text>
                  </View>
                ))}
              </View>

              {/* Table Body */}
              <ScrollView>
                {tableData.map((rowData, rowIndex) => (
                  <View key={rowIndex} style={styles.row}>
                    {rowData.map((cellData, cellIndex) => renderTableCell(cellData, cellIndex))}
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>

          {/* Pagination */}
          <View style={styles.pagination}>
            <TouchableOpacity
              style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
              onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <Text style={styles.pageButtonText}>Previous</Text>
            </TouchableOpacity>
            
            <Text style={styles.pageText}>
              Page {currentPage} of {totalPages}
            </Text>
            
            <TouchableOpacity
              style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
              onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <Text style={styles.pageButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#F46969',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f5f5f5',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F46969',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerCell: {
    padding: 12,
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'white',
  },
  cell: {
    padding: 12,
    justifyContent: 'center',
  },
  cellText: {
    color: '#333',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  pageButton: {
    backgroundColor: '#F46969',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  pageButtonDisabled: {
    backgroundColor: '#ddd',
  },
  pageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pageText: {
    color: '#666',
  },
  loader: {
    flex: 1,
  },
});

export default ManageStudentScreen;