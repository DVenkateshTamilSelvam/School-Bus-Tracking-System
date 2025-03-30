import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import PropTypes from 'prop-types';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../component/axiosConfig';

const MapScreen = ({ route, navigation }) => {
    const { latitude: busLatitude, longitude: busLongitude } = route.params;
    const [currentLocation, setCurrentLocation] = useState(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [profileData, setProfileData] = useState(null);
    const [attendantData, setAttendantData] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [activeSection, setActiveSection] = useState(null);

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem('email');
                if (storedEmail) {
                    setEmail(storedEmail);
                }
            } catch (error) {
                console.error('Error fetching email:', error);
            }
        };
        fetchEmail();

        const watchId = Geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation({ latitude, longitude });

                fetchRoute(
                    busLatitude,
                    busLongitude,
                    latitude,
                    longitude
                );
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

        // Cleanup subscription on unmount
        return () => Geolocation.clearWatch(watchId);
    }, [busLatitude, busLongitude]);

    const fetchProfileData = async () => {
        try {
            const { data } = await axios.post('/get_profile_data', { email });
            setProfileData(data);
            setActiveSection('profile');
            setAttendantData(null);
            setNotifications([]);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    const fetchAttendantDetails = async (attenderId) => {
        try {
            const { data } = await axios.get(`/get_attendant_details/${attenderId}`);
            setAttendantData(data);
            setActiveSection('attendant');
            setProfileData(null);
            setNotifications([]);
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
            setActiveSection('notifications');
            setProfileData(null);
            setAttendantData(null);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Existing fetchRoute function remains the same...
    const fetchRoute = async (startLat, startLng, endLat, endLng) => {
        try {
            const response = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}?access_token=YOUR_MAPBOX_ACCESS_TOKEN`
            );

            const data = await response.json();

            // Extract route coordinates
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

    // Error handling for missing coordinates
    if (!busLatitude || !busLongitude) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Bus location coordinates are missing</Text>
            </View>
        );
    }

    // Error handling for location retrieval
    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    // Wait for current location to be fetched
    if (!currentLocation) {
        return (
            <View style={styles.container}>
                <Text>Fetching location...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: parseFloat(busLatitude),
                    longitude: parseFloat(busLongitude),
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {/* Bus Location Marker */}
                <Marker
                    coordinate={{
                        latitude: parseFloat(busLatitude),
                        longitude: parseFloat(busLongitude),
                    }}
                    title="Bus Location"
                >
                    <Image
                        source={require('../asset/ss.png')}
                        style={{ width: 38, height: 38 }}
                    />
                </Marker>

                {/* Current Location Marker */}
                <Marker
                    coordinate={currentLocation}
                    title="My Location"
                    pinColor="blue"
                />

                {/* Route Polyline */}
                {routeCoordinates.length > 0 && (
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeColor="#000"
                        strokeWidth={3}
                    />
                )}
            </MapView>

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

            {activeSection === 'notifications' && notifications.length > 0 && (
                <View style={styles.detailsOverlay}>
                    <Text style={styles.detailsTitle}>Notifications</Text>
                    {notifications.map((notification, index) => (
                        <View key={index} style={styles.notificationItem}>
                            <Text style={styles.notificationMessage}>{notification.message}</Text>
                            <Text style={styles.notificationTimestamp}>{notification.timestamp}</Text>
                            {notification.latitude && notification.longitude && (
                                <Text style={styles.notificationLocation}>
                                    Location: {notification.latitude}, {notification.longitude}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

// Prop type validation
MapScreen.propTypes = {
    route: PropTypes.shape({
        params: PropTypes.shape({
            latitude: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]).isRequired,
            longitude: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]).isRequired,
        }).isRequired,
    }).isRequired,
    navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        top: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#F46969',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    detailsOverlay: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(128, 128, 128, 0.9)',
        borderRadius: 10,
        padding: 15,
        maxHeight: '40%',
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

export default MapScreen;
