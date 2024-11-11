import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import axios from '../component/axiosConfig'; // Import Axios for API requests

const LoadingBar = ({ visible }) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="black" animating={visible} />
  </View>
);

const AttendantHomeScreen = ({ navigation, route }) => {
  const [isLiveLocationOn, setLiveLocationOn] = useState(false);
  const [location, setLocation] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const { attender_id } = route.params; // Assuming you also receive the user ID

  useEffect(() => {
    const startLocationTracking = async () => {
      try {
        setLoading(true); // Set loading to true when tracking starts
        await requestLocationPermission();
        const watchId = Geolocation.watchPosition(
          async (position) => {
            setLocation(position);
            setLoading(false); // Set loading to false when location is obtained
          },
          (error) => {
            console.error('Error getting location:', error);
            setLoading(false); // Set loading to false on error
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 } // Increased timeout
        );
        return watchId;
      } catch (error) {
        console.error('Permission denied:', error);
      }
    };

    let watchId;

    if (isLiveLocationOn) {
      startLocationTracking().then((id) => (watchId = id));

      // Cleanup: Clear the timer when the component unmounts or live location is turned off
      return () => {
        stopLocationTracking(watchId);
      };
    } else {
      stopLocationTracking(watchId);
    }

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
    if (isLiveLocationOn && location) {
      const intervalId = setInterval(() => {
        sendLocationToServer(location);
      }, 2000); // Adjust interval as needed
      return () => clearInterval(intervalId);
    }
  }, [isLiveLocationOn, location]);

  const sendLocationToServer = async (position) => {
    try {
      const { latitude, longitude } = position.coords;
      const timestamp = new Date().toISOString(); // Current timestamp
      const data = {
        attender_id,
        latitude,
        longitude,
        timestamp,
      };

      if (!location) {
        // Send the initial location data to the backend API for insertion
        await axios.post('/insert_gps_data', data);
      } else {
        // Send subsequent location updates to the backend API for updating
        await axios.post('/update_live_location', data);
      }

      console.log('Location data sent to server:', data);
    } catch (error) {
      console.error('Error sending location data to server:', error);
    }
  };

  const handleARS = () => {
    navigation.navigate('ARS');
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
});

export default AttendantHomeScreen;
