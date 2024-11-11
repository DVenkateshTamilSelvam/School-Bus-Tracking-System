import { View, Image, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { HelpCircle } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const AdminHomeScreen = ({ navigation }) => {
  const handleManageAttendant = () => {
    navigation.navigate('ManageAttendantScreen');
  };
  const handleManageStudents = () => {
    navigation.navigate('ManageStudentScreen');
  };
  const handleBuses = () => {
    navigation.navigate('ManageBus');
  };
  const handleRoutes = () => {
    navigation.navigate('ManageRoute');
  };
  const handleHelp = () => {
    navigation.navigate('InstructionsScreen'); // Navigate to the Instructions screen
  };

  return (
    <View style={styles.container}>
      {/* Background Shapes */}
      <View style={styles.shape1}></View>
      <View style={styles.shape2}></View>
      <View style={styles.shape3}></View>

      <Text style={styles.heading}>Crafting Tomorrow's Safe Journeys, Today.</Text>
      <Image source={require('../asset/teacher.png')} style={styles.icon} />
      
      {/* Main Action Buttons */}
      <View style={styles.rowContainer}>
        <TouchableOpacity style={styles.button} onPress={handleManageAttendant}>
          <Text style={styles.buttonText}>Manage Attendant</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleManageStudents}>
          <Text style={styles.buttonText}>Manage Students</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row2container}>
        <TouchableOpacity style={styles.button} onPress={handleBuses}>
          <Text style={styles.buttonText}>Manage Buses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRoutes}>
          <Text style={styles.buttonText}>Manage Routes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.helpButton} onPress={handleHelp}>
        <HelpCircle color="#ff6666" size={32} />
      </TouchableOpacity>
      </View>

      {/* Help Button */}
    

      {/* Bottom Icon */}
      <Image source={require('../asset/drop_down.png')} style={styles.bottomicon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  shape1: {
    position: 'absolute',
    top: -150,
    left: -100,
    width: 500,
    height: 500,
    backgroundColor: '#ff6666',
    borderRadius: 400,
    zIndex: -2,
  },
  shape2: {
    position: 'absolute',
    top: -50,
    right: -80,
    width: 200,
    height: 200,
    backgroundColor: '#ff9999',
    borderRadius: 100,
    zIndex: -1,
  },
  shape3: {
    position: 'absolute',
    top: 100,
    right: -50,
    width: 200,
    height: 200,
    backgroundColor: '#ff6666',
    borderRadius: 100,
    zIndex: -1,
    borderColor: 'black',
  },
  icon: {
    zIndex: 0,
    top: 20,
  },
  heading: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'LilyScriptOne-Regular',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingBottom: 0,
  },
  content: {
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
    marginBottom: 30,
    paddingTop: 0,
    width: '100%',
  },
  row2container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: '#F46969',
    padding: 8,
    height: 60,
    borderRadius: 10,
    flex: 1,
    marginRight: 20,
    marginLeft: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  helpButton: {
    position: 'absolute',
    bottom: -90,
    left: 180,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 8,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  bottomicon: {
    width: 550,
    height: 200,
    bottom: -50,
    zIndex: -1
  },
});

export default AdminHomeScreen;
