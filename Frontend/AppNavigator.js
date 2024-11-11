import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import UserSelectionScreen from './screens/UserSelectionScreen';
import AdminLogin from './screens/AdminLogin';
import AttenderLogin from './screens/AttenderLogin';
import ParentLogin from './screens/ParentLogin';
import AdminHomeScreen from './screens/AdminHomeScreen';
import ManageAttendantScreen from './screens/ManageAttendantScreen';
import AttenderProfile from './screens/AttenderProfile';
import ManageStudentScreen from './screens/ManageStudentScreen';
import StudentProfile from './screens/StudentProfile';
import ManageBus from './screens/ManageBus';
import BusProfile from './screens/BusProfile';
import ManageRoute from './screens/ManageRoute';
import RouteProfile from './screens/RouteProfile';
import AttendantHomeScreen from './screens/AttendantHomeScreen';
import AttendanceRegisterScreen from './screens/AttendanceRegisterScreen';
import Parenthome from './screens/Parenthome';
import EditAttendantScreen from './screens/EditAttendantScreen';
import EditStudentScreen from './screens/EditStudentScreen';
import HelpPage from './screens/HelpPage';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="UserSelectionScreen" component={UserSelectionScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLogin} />
        <Stack.Screen name="AttenderLogin" component={AttenderLogin} />
        <Stack.Screen name="AHS" component={AttendantHomeScreen}/>
        <Stack.Screen name="ParentLogin" component={ParentLogin} />
        <Stack.Screen name="AdminHomeScreen" component={AdminHomeScreen} />
        <Stack.Screen name="ManageAttendantScreen" component={ManageAttendantScreen} />
        <Stack.Screen name="AttenderProfile" component={AttenderProfile}/>
        <Stack.Screen name="ManageStudentScreen" component={ManageStudentScreen}/>
        <Stack.Screen name="StudentProfile" component={StudentProfile}/>
        <Stack.Screen name="ManageBus" component={ManageBus}/>
        <Stack.Screen name="BusProfile" component={BusProfile}/>
        <Stack.Screen name="ManageRoute" component={ManageRoute}/>
        <Stack.Screen name="RouteProfile" component={RouteProfile}/>
        <Stack.Screen name="ARS" component={AttendanceRegisterScreen}/>
        <Stack.Screen name="InstructionsScreen" component={HelpPage}/>
        <Stack.Screen name="PH" component={Parenthome}/>
        <Stack.Screen name="EditAttendantScreen" component={EditAttendantScreen}/>
        <Stack.Screen name="EditStudentScreen" component={EditStudentScreen}/>
        {/* Add other screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
