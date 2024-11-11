import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Wait for 2 seconds and navigate to UserSelectionScreen
    const timer = setTimeout(() => {
      navigation.replace('UserSelectionScreen');
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timer
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.backgroundColor} />
      <Text style={styles.welcomeText}>Back to </Text>
      <Text style={styles.schoolText}>School!</Text>
      <Image
        source={require('../asset/ss.png')} // Replace with the path to your logo image
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundColor: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#1e2a78', // Your desired background color
  },
  welcomeText: {
    fontSize: 48,
    fontFamily: 'IslandMoments-Regular', // Ensure the font name matches the font file name
    color: '#fff',
    textAlign: 'center',
    zIndex: 1,
  },
  schoolText: {
    fontSize: 48,
    fontFamily: 'LilyScriptOne-Regular', // Ensure the font name matches the font file name
    color: '#fff',
    textAlign: 'center',
    zIndex: 1,
    marginBottom: 20,
    textTransform: 'uppercase'
  },
  logo: {
    width: 300, // Adjust the width of the logo
    height: 300, // Adjust the height of the logo
    resizeMode: 'contain',
    zIndex: 1,
  },
});

export default SplashScreen;
