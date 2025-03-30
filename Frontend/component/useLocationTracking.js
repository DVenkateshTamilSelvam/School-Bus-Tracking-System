import { useState, useEffect } from 'react';
import Geolocation from 'react-native-geolocation-service';
import axios from './axiosConfig';

const useLocationTracking = (attender_id) => {
  const [location, setLocation] = useState(null);
  const [isFirstLocationSend, setIsFirstLocationSend] = useState(true);

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

      if (isFirstLocationSend) {
        // First-time location insertion
        await axios.post('/update_live_location', data);
        setIsFirstLocationSend(false);
        console.log('Initial location data inserted');
      } else {
        // Subsequent location updates
        await axios.post('/update_live_location', data);
        console.log('Location data updated');
      }
    } catch (error) {
      console.error('Error sending location data to server:', error);
    }
  };

  useEffect(() => {
    let watchId;
    
    const startLocationTracking = () => {
      watchId = Geolocation.watchPosition(
        async (position) => {
          setLocation(position);
          await sendLocationToServer(position);
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        { 
          enableHighAccuracy: true, 
          interval: 2000,  // 2-second interval
          fastestInterval: 1000,  // Fastest possible update
          distanceFilter: 10  // Update if moved more than 10 meters
        }
      );
    };

    startLocationTracking();

    // Cleanup function
    return () => {
      if (watchId) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, [attender_id]);

  return location;
};

export default useLocationTracking;
