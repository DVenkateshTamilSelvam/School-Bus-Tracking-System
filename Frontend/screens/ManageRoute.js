import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import axios from '../component/axiosConfig';

const ITEMS_PER_PAGE = 10;
const windowWidth = Dimensions.get('window').width;

const COLUMN_WIDTHS = {
  id: 100,
  stop_name: 150,
  actions: 140,
};

const ManageRoute = ({ navigation }) => {
  const [routes, setRoutes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [editedStopName, setEditedStopName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/get_route_table');
      setRoutes(response.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
      Alert.alert('Error', 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (route) => {
    setSelectedRoute(route);
    setEditedStopName(route.stop_name);
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedRoute || !editedStopName.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await axios.put(`/update_route/${selectedRoute.route_id}`, {
        stop_name: editedStopName,
      });
      Alert.alert('Success', 'Route updated successfully');
      setModalVisible(false);
      fetchRoutes();
    } catch (error) {
      console.error('Error updating route:', error);
      Alert.alert('Error', 'Failed to update route');
    }
  };

  const AddNew = () => {
    navigation.navigate('RouteProfile');
  };

  const filteredRoutes = routes.filter((route) =>
    route.stop_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedRoutes = filteredRoutes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredRoutes.length / ITEMS_PER_PAGE);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Routes</Text>
        <TouchableOpacity style={styles.addButton} onPress={AddNew}>
          <Text style={styles.addButtonText}>+ Add Route</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search routes..."
          placeholderTextColor="black"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#F46969" style={styles.loader} />
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.headerText, { width: COLUMN_WIDTHS.id }]}>Route ID</Text>
                <Text style={[styles.headerText, { width: COLUMN_WIDTHS.stop_name }]}>Stop Name</Text>
                <Text style={[styles.headerText, { width: COLUMN_WIDTHS.actions }]}>Actions</Text>
              </View>

              <ScrollView>
                {paginatedRoutes.map((route) => (
                  <View key={route.route_id} style={styles.row}>
                    <Text style={[styles.cellText, { width: COLUMN_WIDTHS.id }]}>
                      {route.route_id}
                    </Text>
                    <Text style={[styles.cellText, { width: COLUMN_WIDTHS.stop_name }]}>
                      {route.stop_name}
                    </Text>
                    <View style={[styles.actions, { width: COLUMN_WIDTHS.actions }]}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => handleEdit(route)}
                      >
                        <Text style={styles.actionText}>Edit</Text>
                      </TouchableOpacity>
                      
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>

          <View style={styles.pagination}>
            <TouchableOpacity
              style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
              onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <Text style={styles.pageButtonText}>Previous</Text>
            </TouchableOpacity>

            <Text style={styles.pageText}>
              Page {currentPage} of {totalPages}
            </Text>

            <TouchableOpacity
              style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
              onPress={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <Text style={styles.pageButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Route</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Route ID:</Text>
              <Text style={styles.routeIdText}>{selectedRoute?.route_id}</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Stop Name:</Text>
              <TextInput
                style={styles.input}
                value={editedStopName}
                onChangeText={setEditedStopName}
                placeholder="Enter stop name"
                placeholderTextColor="black"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingVertical: 12,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  cellText: {
    padding: 12,
    textAlign: 'center',
    color: 'black'
  },
  actions: {
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  
  actionText: {
    color: 'white',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  pageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#F46969',
  },
  pageButtonDisabled: {
    backgroundColor: '#ddd',
  },
  pageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pageText: {
    fontWeight: 'bold',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    color: 'black',
    backgroundColor: '#f5f5f5',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
});

export default ManageRoute;
