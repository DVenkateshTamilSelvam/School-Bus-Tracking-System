import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Modal, TextInput } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import axios from '../component/axiosConfig'; // Import Axios for API requests
import { MapPin } from 'lucide-react-native'; // For location icon

const LoadingBar = ({ visible }) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="black" animating={visible} />
  </View>
);

const AttendantHomeScreen = ({ navigation, route }) => {
  const [isLiveLocationOn, setLiveLocationOn] = useState(false);
  const [location, setLocation] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const { attender_id } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [notificationSent, setNotificationSent] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setInputText('');
  };

  const handleSend = async () => {
    try {
      if (!inputText) {
        Alert.alert('Error', 'Please enter a message');
        return;
      }
  
      const timestamp = new Date().toISOString();
      const notificationData = {
        attender_id,
        message: inputText,
        timestamp,
        gps_data: location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        } : null,
      };
  
      // Send notification with location
      await axios.post('/send_notification', notificationData);
  
      // Optional: Show success message
      Alert.alert('Success', 'Notification sent successfully');
      
      // Reset input and close modal
      setInputText('');
      closeModal();
    } catch (error) {
      console.error('Notification sending error:', error);
      Alert.alert('Error', 'Failed to send notification');
    }
  };


  useEffect(() => {
    let watchId;
    const startLocationTracking = async () => {
      try {
        await requestLocationPermission();
        watchId = Geolocation.watchPosition(
          async (position) => {
            setLocation(position);

            // Send location to server more efficiently
            await sendLocationToServer(position);
          },
          (error) => {
            console.error('Location tracking error:', error);
          },
          {
            enableHighAccuracy: true, 
            distanceFilter: 10, // Update only if moved 10 meters
            interval: 30000, // Check every 30 seconds
            fastestInterval: 10000 // Fastest update interval
          }
        );
      } catch (error) {
        console.error('Location tracking setup error:', error);
      }
    };

    if (isLiveLocationOn) {
      startLocationTracking();
    }

    // Cleanup function
    return () => {
      if (watchId) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, [isLiveLocationOn]);

  const toggleLiveLocation = () => {
    setLiveLocationOn(!isLiveLocationOn);
  };

  const requestLocationPermission = async () => {
    try {
      const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (result !== RESULTS.GRANTED) {
        const permissionResult = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (permissionResult !== RESULTS.GRANTED) {
          throw new Error('Location permission denied');
        }
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      throw error;
    }
  };

  const stopLocationTracking = (watchId) => {
    if (watchId) {
      Geolocation.clearWatch(watchId);
    }
  };

  useEffect(() => {
    // Fetch notifications on component mount
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/get_notifications');
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications(); // Call on mount
  }, [notificationSent]); // Fetch new data when notification is sent

  useEffect(() => {
    if (isLiveLocationOn && location) {
      const intervalId = setInterval(() => {
        sendLocationToServer(location);
      }, 2000); // Adjust interval as needed
      return () => clearInterval(intervalId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLiveLocationOn, location]);

  const sendLocationToServer = async (position) => {
    try {
      const { latitude, longitude } = position.coords;
      const timestamp = new Date().toISOString();
      const data = {
        attender_id,
        latitude,
        longitude,
        timestamp,
      };
  
      const response = await axios.post('/update_live_location', data);
      console.log('Location data sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending location data:', error.response?.data || error.message);
      // Optionally show an error toast or alert
    }
  };

  const handleARS = () => {
    navigation.navigate('ARS');
  };

  const navigateToLocation = (latitude, longitude) => {
    // Navigate to MapScreen and pass coordinates
    navigation.navigate('Map', { latitude, longitude });
  };
  const renderNotificationItem = ({ item }) => {
    return (
      <View style={styles.notificationItem}>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTimestamp}>{item.timestamp}</Text>
        {item.latitude && item.longitude && (
          <TouchableOpacity onPress={() => navigateToLocation(item.latitude, item.longitude)}>
            <MapPin size={20} color="black" />
            <Text style={styles.notificationLocation}>View on Map</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {attender_id}!</Text>
      <Text style={styles.label}>Start Your Live Location</Text>
      <TouchableOpacity style={styles.button} onPress={toggleLiveLocation}>
        <Text style={styles.buttonText}>{isLiveLocationOn ? 'OFF' : 'ON'}</Text>
      </TouchableOpacity>

      <LoadingBar visible={isLoading} />

      {location && (
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>
            Latitude: {location.coords.latitude.toFixed(6)}
          </Text>
          <Text style={styles.locationText}>
            Longitude: {location.coords.longitude.toFixed(6)}
          </Text>
        </View>
      )}

      <Text style={styles.label}>Take today's Attendance</Text>
      {/* Add your logic for attendance here */}
      <TouchableOpacity style={styles.button} onPress={handleARS}>
        <Text style={styles.buttonText}>Attendance</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.greenbutton} onPress={openModal}>
        <Text style={styles.buttonText}>Send Notification</Text>
      </TouchableOpacity>

      {notificationSent && <Text style={styles.successMessage}>Notification sent successfully!</Text>}
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your message"
              value={inputText}
              onChangeText={setInputText}
              placeholderTextColor={'black'}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'rgba(220, 130, 65, 0.1)',
  },
  welcome:{
    color: 'black',
    textTransform: 'uppercase',
    fontSize: 30,
  },
  label: {
    fontSize: 15,
    marginBottom: 10,
    marginTop: 10,
    color: 'black',
    textTransform: 'uppercase',
  },
  button: {
    backgroundColor: '#F46969',
    paddingHorizontal: 35,
    paddingVertical: 18,
    borderRadius: 55,
    marginTop: 10,
    marginBottom: 30,
  },
  greenbutton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 35,
    paddingVertical: 18,
    borderRadius: 55,
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  locationInfo: {
    marginTop: 20,
    alignItems: 'center',
    position: 'relative',
  },
  locationText: {
    fontSize: 16,
    color: 'black',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'black',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    color: 'black',
    borderRadius: 5,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: '#555',
  },

  successMessage:{
  fontSize: 16,
  color: 'green',
  marginTop: 10,
},
notificationItem: {
  padding: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
  marginBottom: 10,
},
notificationMessage: {
  fontSize: 16,
  color: 'black',
},
notificationTimestamp: {
  fontSize: 12,
  color: 'gray',
},
notificationLocation: {
  fontSize: 14,
  color: 'blue',
  textDecorationLine: 'underline',
},
});

export default AttendantHomeScreen;
