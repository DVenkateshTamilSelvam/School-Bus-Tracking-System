import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, FlatList } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import axios from '../component/axiosConfig';

const Parenthome = () => {
    const [email, setEmail] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [profileData, setProfileData] = useState(null);
    const [attendantData, setAttendantData] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [activeSection, setActiveSection] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem('email');
                if (storedEmail) {
                    setEmail(storedEmail);

                    // Fetch location data
                    const { data } = await axios.post('/get_location_data', { email: storedEmail });
                    setLatitude(data.latitude);
                    setLongitude(data.longitude);
                }
            // eslint-disable-next-line no-catch-shadow
            } catch (error) {
                console.error('Error fetching initial data:', error);
            }
        };

        const watchLocation = () => {
            const watchId = Geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({ latitude, longitude });

                    if (latitude && longitude && busLatitude && busLongitude) {
                        fetchRoute(
                            busLatitude,
                            busLongitude,
                            latitude,
                            longitude
                        );
                    }
                },
                (error) => {
                    setError('Unable to retrieve location');
                    console.error(error);
                },
                { 
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 1000,
                }
            );

            return () => Geolocation.clearWatch(watchId);
        };

        fetchInitialData();
        const cleanup = watchLocation();

        return () => {
            cleanup();
        };
    }, []);

    const fetchProfileData = async () => {
        try {
            const { data } = await axios.post('/get_profile_data', { email });
            setProfileData(data);
            setActiveSection('profile');
            setAttendantData(null);
            setNotifications([]);
        // eslint-disable-next-line no-catch-shadow
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    const fetchAttendantDetails = async () => {
        try {
            if (!profileData || !profileData.attender_id) {
                console.log('Error: Profile data or Attender ID is not set.');
                return;
            }
            const { data } = await axios.get(`/get_attendant_details/${profileData.attender_id}`);
            setAttendantData(data);
            setActiveSection('attendant');
            setProfileData({...profileData}); // Keep profile data
            setNotifications([]);
        // eslint-disable-next-line no-catch-shadow
        } catch (error) {
            console.error('Error fetching attendant details:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            if (!profileData || !profileData.attender_id) {
                console.log('Error: Attender ID is not set in profileData.');
                return;
            }

            const { data } = await axios.post('/parentget_notifications', { attender_id: profileData.attender_id });
            setNotifications(data.notifications || []);
            setActiveSection('notifications');
            setProfileData(null);
            setAttendantData(null);
        // eslint-disable-next-line no-catch-shadow
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const fetchRoute = async (startLat, startLng, endLat, endLng) => {
        try {
            const response = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}?access_token=YOUR_MAPBOX_ACCESS_TOKEN`
            );

            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                const coordinates = data.routes[0].geometry.coordinates.map(coord => ({
                    latitude: coord[1],
                    longitude: coord[0],
                }));

                setRouteCoordinates(coordinates);
            }
        } catch (err) {
            console.error('Route fetching error:', err);
            setError('Could not fetch route');
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

    // Error and loading states
    if (!latitude || !longitude) {
        return (
            <View style={styles.container}>
                <Text>Loading location...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Welcome Text */}
            <Text style={styles.welcomeText}>Welcome {email || 'School Bus Tracking App'}</Text>

            {/* Map View */}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {/* Bus Location Marker */}
                <Marker
                    coordinate={{
                        latitude: parseFloat(latitude),
                        longitude: parseFloat(longitude),
                    }}
                    title="Bus Location"
                >
                    <Image
                        source={require('../asset/ss.png')}
                        style={{ width: 38, height: 38 }}
                    />
                </Marker>

                {/* Current Location Marker */}
                {currentLocation && (
                    <Marker
                        coordinate={currentLocation}
                        title="My Location"
                        pinColor="blue"
                    />
                )}

                {/* Route Polyline */}
                {routeCoordinates.length > 0 && (
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeColor="#000"
                        strokeWidth={3}
                    />
                )}
            </MapView>

            {/* Bottom Section with Buttons and Details */}
            <View style={styles.bottomSection}>
                {/* Buttons Container */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={fetchProfileData}
                    >
                        <Text style={styles.buttonText}>Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={() => fetchAttendantDetails(profileData?.attender_id)}
                    >
                        <Text style={styles.buttonText}>Attendant</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={fetchNotifications}
                    >
                        <Text style={styles.buttonText}>Notifications</Text>
                    </TouchableOpacity>
                </View>

                {/* Details Overlay */}
                {activeSection === 'profile' && profileData && (
                    <View style={styles.detailsOverlay}>
                        <Text style={styles.detailsTitle}>Profile Details:</Text>
                        <Text style={styles.detailsText}>ID: {profileData?.student_id}</Text>
                        <Text style={styles.detailsText}>Name: {profileData?.student_name}</Text>
                        <Text style={styles.detailsText}>Email: {profileData?.email}</Text>
                        <Text style={styles.detailsText}>Contact: {profileData?.student_contact}</Text>
                    </View>
                )}

                {activeSection === 'attendant' && attendantData && (
                    <View style={styles.detailsOverlay}>
                        <Text style={styles.detailsTitle}>Attendant Details:</Text>
                        <Text style={styles.detailsText}>ID: {attendantData?.attender_id}</Text>
                        <Text style={styles.detailsText}>Name: {attendantData?.attender_name}</Text>
                        <Text style={styles.detailsText}>Age: {attendantData?.age}</Text>
                        <Text style={styles.detailsText}>Contact: {attendantData?.attender_contact}</Text>
                        <Text style={styles.detailsText}>Address: {attendantData?.address}</Text>
                    </View>
                )}

                {activeSection === 'notifications' && (
                    <View style={styles.detailsOverlay}>
                        <Text style={styles.detailsTitle}>Notifications</Text>
                        <FlatList
                            data={notifications}
                            renderItem={renderNotificationItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    welcomeText: {
        position: 'absolute',
        top: 0,
        width: '100%',
        textAlign: 'center',
        color: 'black',
        fontSize: 20,
        fontWeight: '300',
        textTransform: 'uppercase',
        zIndex: 1,
        backgroundColor: 'white',
        paddingVertical: 10,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 200, // Adjust height to make room for bottom section
    },
    bottomSection: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#7BB8FF',
        borderRadius: 5,
        marginHorizontal: 5,
        padding: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    detailsOverlay: {
        backgroundColor: 'rgba(128, 128, 128, 0.9)',
        padding: 15,
        maxHeight: 200,
    },
    detailsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
    },
    detailsText: {
        color: 'white',
        marginBottom: 5,
    },
    notificationItem: {
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        paddingBottom: 5,
    },
    notificationMessage: {
        color: 'white',
        fontWeight: 'bold',
    },
    notificationTimestamp: {
        color: 'lightgrey',
    },
    notificationLocation: {
        color: '#F46969',
    },
});

export default Parenthome;