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
  id: 80,
  bus_number: 110,
  route_id: 90,
  actions: 90,
};

const ManageBus = ({ navigation }) => {
  const [buses, setBuses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [editedBusNumber, setEditedBusNumber] = useState('');
  const [editedRouteId, setEditedRouteId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/get_buses_table');
      setBuses(response.data);
    } catch (error) {
      console.error('Error fetching buses:', error);
      Alert.alert('Error', 'Failed to fetch buses');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bus) => {
    setSelectedBus(bus);
    setEditedBusNumber(bus.bus_number);
    setEditedRouteId(bus.route_id);  // Set route ID
    setModalVisible(true);
  };
  

  const handleSaveEdit = async () => {
    if (!selectedBus || !editedBusNumber.trim() || !editedRouteId.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    try {
      await axios.put(`/update_bus/${selectedBus.bus_id}`, {
        bus_number: editedBusNumber,
        route_id: editedRouteId,
      });
      Alert.alert('Success', 'Bus updated successfully');
      setModalVisible(false);
      fetchBuses();
    } catch (error) {
      console.error('Error updating bus:', error);
      Alert.alert('Error', 'Failed to update bus');
    }
  };
  

  const AddNew = () => {
    navigation.navigate('BusProfile');
  };

  const filteredBuses = buses.filter((bus) =>
    bus.bus_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedBuses = filteredBuses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredBuses.length / ITEMS_PER_PAGE);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Buses</Text>
        <TouchableOpacity style={styles.addButton} onPress={AddNew}>
          <Text style={styles.addButtonText}>+ Add Bus</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search buses..."
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
                <Text style={[styles.headerText, { width: COLUMN_WIDTHS.id }]}>Bus ID</Text>
                <Text style={[styles.headerText, { width: COLUMN_WIDTHS.bus_number }]}>Bus Number</Text>
                <Text style={[styles.headerText, { width: COLUMN_WIDTHS.route_id }]}>Route ID</Text>
                <Text style={[styles.headerText, { width: COLUMN_WIDTHS.actions }]}>Actions</Text>
              </View>

              <ScrollView>
                {paginatedBuses.map((bus) => (
                  <View key={bus.bus_id} style={styles.row}>
                    <Text style={[styles.cellText, { width: COLUMN_WIDTHS.id }]}>{bus.bus_id}</Text>
                    <Text style={[styles.cellText, { width: COLUMN_WIDTHS.bus_number }]}>
                      {bus.bus_number}
                    </Text>
                    <Text style={[styles.cellText, { width: COLUMN_WIDTHS.route_id }]}>{bus.route_id}</Text>
                    <View style={[styles.actions, { width: COLUMN_WIDTHS.actions }]}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => handleEdit(bus)}
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
      <Text style={styles.modalTitle}>Edit Bus</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Bus ID:</Text>
        <Text style={styles.routeIdText}>{selectedBus?.bus_id}</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Bus Number:</Text>
        <TextInput
          style={styles.input}
          value={editedBusNumber}
          onChangeText={setEditedBusNumber}
          placeholder="Enter bus number"
          placeholderTextColor="black"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Route ID:</Text>
        <TextInput
          style={styles.input}
          value={editedRouteId}
          onChangeText={setEditedRouteId}
          placeholder="Enter route ID"
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
  // Similar styles as provided for ManageRoute
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
    paddingVertical: 10,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    paddingLeft: 8,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  cellText: {
    paddingLeft: 8,
    color: '#333',
  },
  actions: {
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  editButton: {
    backgroundColor: '#FFA500',
    marginRight: 4,
  },
 
  actionText: {
    color: 'white',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  pageButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F46969',
    marginHorizontal: 10,
  },
  pageButtonText: {
    color: 'white',
  },
  pageButtonDisabled: {
    backgroundColor: '#ddd',
  },
  pageText: {
    color: '#333',
  },
  loader: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: windowWidth - 60,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
  routeIdText: {
    color: '#333',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    color: 'black'
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#F46969',
  },
  modalButtonText: {
    color: 'white',
  },
});

export default ManageBus;
