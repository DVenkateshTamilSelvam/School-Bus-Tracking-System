// MapScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const MapScreen = ({ route }) => {
  const { latitude, longitude } = route.params;

  // Construct the Google Maps URL with the coordinates
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ uri: mapUrl }} style={{ flex: 1 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  // Add your custom styles here if needed
});

export default MapScreen;
