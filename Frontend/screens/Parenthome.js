import React, { useState, useEffect } from 'react';
import { View, Button, Linking, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../component/axiosConfig';

const Parenthome = () => {
    const [email, setEmail] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [attendantData, setAttendantData] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showProfile, setShowProfile] = useState(false);
    const [showAttendant, setShowAttendant] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem('email');
                if (storedEmail) {
                    setEmail(storedEmail);
                    const { data } = await axios.post('/get_location_data', { email: storedEmail });
                    setLatitude(data.latitude);
                    setLongitude(data.longitude);
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
        }
    };

    const fetchProfileData = async () => {
        try {
            const { data } = await axios.post('/get_profile_data', { email });
            setProfileData(data);
            setShowProfile(true);
            setShowAttendant(false);
            setShowNotifications(false);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    const fetchAttendantDetails = async (attenderId) => {
        try {
            const { data } = await axios.get(`/get_attendant_details/${attenderId}`);
            setAttendantData(data);
            setShowAttendant(true);
            setShowProfile(false);
            setShowNotifications(false);
        } catch (error) {
            console.error('Error fetching attendant details:', error);
        }
    };

    const fetchNotifications = async () => {
      try {
          if (!profileData || !profileData.attender_id) {
              console.log("Error: Attender ID is not set in profileData.");
              return;
          }
  
          const { data } = await axios.post('/parentget_notifications', { attender_id: profileData.attender_id });
          setNotifications(data.notifications || []);
          setShowNotifications(true);
          setShowProfile(false);
          setShowAttendant(false);
      } catch (error) {
          console.error('Error fetching notifications:', error);
      }
  };

    const renderNotificationItem = ({ item }) => (
        <View style={styles.notificationItem}>
            <Text style={styles.notificationMessage}>{item.message}</Text>
            <Text style={styles.notificationTimestamp}>{item.timestamp}</Text>
            {item.latitude && item.longitude && (
                <Text style={styles.notificationLocation}>Location: {item.latitude}, {item.longitude}</Text>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome {email || 'School Bus Tracking App'}</Text>
            <Button title="Open Google Maps" onPress={openGoogleMaps} />

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={fetchProfileData} style={styles.button}>
                    <Text style={styles.buttonText}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => fetchAttendantDetails(profileData?.attender_id)} style={styles.button}>
                    <Text style={styles.buttonText}>Attendant</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={fetchNotifications} style={styles.button}>
                    <Text style={styles.buttonText}>Notifications</Text>
                </TouchableOpacity>
            </View>

            {showProfile && profileData && (
                <View style={styles.profileDropdown}>
                    <Text style={styles.profileText}>Profile Details:</Text>
                    <Text style={styles.profileText}>ID: {profileData?.student_id}</Text>
                    <Text style={styles.profileText}>Name: {profileData?.student_name}</Text>
                    <Text style={styles.profileText}>Email: {profileData?.email}</Text>
                    <Text style={styles.profileText}>Contact: {profileData?.student_contact}</Text>
                </View>
            )}

            {showAttendant && attendantData && (
                <View style={styles.profileDropdown}>
                    <Text style={styles.profileText}>Attendant Details:</Text>
                    <Text style={styles.profileText}>ID: {attendantData?.attender_id}</Text>
                    <Text style={styles.profileText}>Name: {attendantData?.attender_name}</Text>
                    <Text style={styles.profileText}>Age: {attendantData?.age}</Text>
                    <Text style={styles.profileText}>Contact: {attendantData?.attender_contact}</Text>
                    <Text style={styles.profileText}>Address: {attendantData?.address}</Text>
                </View>
            )}

            {showNotifications && (
                <View style={styles.notificationsContainer}>
                    <Text style={styles.notificationsTitle}>Notifications</Text>
                    <FlatList
                        data={notifications}
                        renderItem={renderNotificationItem}
                        keyExtractor={(item) => item.id.toString()}
                    />
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
        backgroundColor: 'grey',
        borderRadius: 5,
        width: '100%',
    },
    profileText: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'white',
    },
    notificationsContainer: {
        marginTop: 20,
        width: '100%',
        backgroundColor: 'grey',
        padding: 10,
        borderRadius: 5,
    },
    notificationsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    notificationItem: {
        padding: 10,
        backgroundColor: 'grey',
        marginBottom: 10,
        
    },
    notificationMessage: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black'
    },
    notificationTimestamp: {
        fontSize: 14,
        color: 'white',
    },
    notificationLocation: {
        fontSize: 14,
        color: '#F46969',
    },
});

export default Parenthome;
