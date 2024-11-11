import React, { useState, useEffect } from 'react';
import { View, Button, Linking, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../component/axiosConfig';

const Parenthome = () => {
    const [email, setEmail] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [attendantData, setAttendantData] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const storedEmail = await AsyncStorage.getItem('email');
          if (storedEmail) {
            setEmail(storedEmail);
  
            // Send email to backend to fetch location data
            const response = await axios.post('/get_location_data', { email: storedEmail });
            const data = await response.data;
  
            if (data && data.latitude && data.longitude) {
              setLatitude(data.latitude);
              setLongitude(data.longitude);
            }
          }
        } catch (error) {
          console.error('Error fetching location data:', error);
        }
      };
  
      fetchData();
    }, []);
  
    const openGoogleMaps = () => {
      if (latitude && longitude) {
        const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        Linking.openURL(url);
      } else {
        console.log('Latitude and longitude data not available');
      }
    };
  
    const getProfileData = async (email) => {
      try {
        const response = await axios.post('/get_profile_data', { email });
        return response.data;
      } catch (error) {
        console.error('Error fetching profile data:', error);
        return null;
      }
    };
  
    const getAttendantDetails = async (attenderId) => {
      try {
        const response = await axios.get(`/get_attendant_details/${attenderId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching attendant details:', error);
        return null;
      }
    };
  
    const handleProfile = async () => {
      try {
        const profile = await getProfileData(email);
        setProfileData(profile);
        setShowProfile(true);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
  
    const handleAttendantDetails = async (attenderId) => {
      try {
        const attendant = await getAttendantDetails(attenderId);
        setAttendantData(attendant);
        setShowProfile(true);
      } catch (error) {
        console.error('Error fetching attendant details:', error);
      }
    };
  
    const handleNotifications = () => {
      // Implement logic for handling Notifications
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>
          Welcome {email ? email : 'School Bus Tracking App'}
        </Text>
        <Button title="Open Google Maps" onPress={openGoogleMaps} />

        {showProfile && attendantData && (
          <View style={styles.profileDropdown}>
            <Text style={styles.profileText}>Attendant Details:</Text>
            <Text style={styles.profileText}>ID: {attendantData?.attender_id}</Text>
            <Text style={styles.profileText}>Name: {attendantData?.attender_name}</Text>
            <Text style={styles.profileText}>Age: {attendantData?.age}</Text>
            <Text style={styles.profileText}>Contact Number: {attendantData?.attender_contact}</Text>
            <Text style={styles.profileText}>Address: {attendantData?.address}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleProfile} style={styles.button}>
            <Text style={styles.buttonText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleAttendantDetails(profileData?.attender_id)} style={styles.button}>
            <Text style={styles.buttonText}>Attendant Detail</Text>
          </TouchableOpacity>
          <Button
            title="Notification"
            onPress={handleNotifications}
            style={styles.button}
          />
        </View>
        {showProfile && profileData && (
          <View style={styles.profileDropdown}>
            <Text style={styles.profileText}>Profile Details:</Text>
            <Text style={styles.profileText}>ID: {profileData?.student_id}</Text>
            <Text style={styles.profileText}>Name: {profileData?.student_name}</Text>
            <Text style={styles.profileText}>Email: {profileData?.email}</Text>
            <Text style={styles.profileText}>Contact Number: {profileData?.student_contact}</Text>
          </View>
        )}
        
      </View>

);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '300',
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F46969',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  profileDropdown: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    width: '100%',
    backgroundColor: 'grey',
  },
  profileText: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
    textTransform: 'uppercase',
  },
});

export default Parenthome;
