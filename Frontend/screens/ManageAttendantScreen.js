import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Animated,
  ActivityIndicator
} from 'react-native';
import { Search, UserPlus, Edit2, Trash2, Phone, MapPin, Key, User } from 'lucide-react-native';
import axios from '../component/axiosConfig';

const ManageAttendantScreen = ({ navigation }) => {
  const [attendants, setAttendants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [scaleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchAttendants();
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 10,
      friction: 2,
      useNativeDriver: true
    }).start();
  }, []);

  const fetchAttendants = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/get_attendant_table');
      setAttendants(response.data);
    } catch (error) {
      console.error('Error fetching attendants:', error);
      Alert.alert('Error', 'Failed to load attendants');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (attendantId) => {
    navigation.navigate('EditAttendantScreen', { attendantId });
  };

  const handleDelete = (attender_id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this attendant?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`/attender/delete/${attender_id}`);
              fetchAttendants();
            } catch (error) {
              console.error('Error deleting attendant:', error);
              Alert.alert('Error', 'Failed to delete attendant');
            }
          },
        },
      ]
    );
  };

  const filteredAttendants = attendants.filter(attendant =>
    Object.values(attendant).some(value =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const AttendantCard = ({ attendant }) => (
    <Animated.View
      style={[
        styles.card,
        {
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.nameContainer}>
          <User size={24} color="#F46969" />
          <Text style={styles.nameText}>{attendant.attender_name}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEdit(attendant.attender_id)}
          >
            <Edit2 size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(attendant.attender_id)}
          >
            <Trash2 size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Phone size={16} color="#666" />
          <Text style={styles.infoText}>
            {attendant.attender_contact || 'No contact'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MapPin size={16} color="#666" />
          <Text style={styles.infoText}>
            {attendant.address || 'No address'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Key size={16} color="#666" />
          <Text style={styles.infoText}>
            {attendant.password ? '••••••••' : 'No password'}
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Attendants</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AttenderProfile')}
        >
          <UserPlus size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add New</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search attendants..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#F46969" style={styles.loader} />
      ) : (
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardsContainer}>
            {filteredAttendants.map((attendant) => (
              <AttendantCard key={attendant.attender_id} attendant={attendant} />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F46969',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  cardContent: {
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ManageAttendantScreen;