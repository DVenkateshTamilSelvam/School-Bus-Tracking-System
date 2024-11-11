import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text, SafeAreaView, ScrollView, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const UserSelectionScreen = ({ navigation }) => {
  const handleAdmin = () => {
    navigation.navigate('AdminLogin');
  };

  const handleAttender = () => {
    navigation.navigate('AttenderLogin');
  };

  const handleParent = () => {
    navigation.navigate('ParentLogin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.heading}>Let's Go</Text>
          <Text style={styles.subheading}>Navigate the future, Ensure safety today with our school bus tracking system</Text>
        </View>

        <Image 
          source={require('../asset/sb.png')}
          style={styles.busImage}
        />

        <TouchableOpacity style={styles.button} onPress={handleAdmin}>
          <Image source={require('../asset/Admin.png')} style={styles.icon} />
          <Text style={styles.buttonText}>I am an Admin</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleAttender}>
          <Image source={require('../asset/Attender.png')} style={styles.icon} />
          <Text style={styles.buttonText}>I am an Attender</Text>
        </TouchableOpacity>
         
        <TouchableOpacity style={styles.button} onPress={handleParent}>
          <Image source={require('../asset/Parent.png')} style={styles.icon} />
          <Text style={styles.buttonText}>I am a Parent</Text>
        </TouchableOpacity>

        <Image 
          source={require('../asset/sbb.png')}
          style={styles.busLogo}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 20,
  },
  header: {
    width: '100%',
    backgroundColor: '#1e2a78',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 48,
    fontFamily: 'IslandMoments-Regular',
    color: '#fff',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 15,
    fontFamily: 'Inter_18pt-Regular',
    color: '#fff',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  busImage: {
    width: width * 0.7,
    height: height * 0.25,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#FFCC00',
    borderRadius: 10,
    width: width * 0.8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  busLogo: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: 'contain',
    marginTop: 20,
  },
});

export default UserSelectionScreen;