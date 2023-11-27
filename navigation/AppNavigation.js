
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddTripScreen from '../screens/AddTripScreen';
import TripExpenseScreen from '../screens/TripExpenseScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen'
import WelcomeScreen from '../screens/WelcomeScreen';


const Stack = createNativeStackNavigator();

function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">

        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown : false}} />
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown : false}} />
        <Stack.Screen name="AddTrip" component={AddTripScreen} options={{headerShown : false}} />
        <Stack.Screen name="Trip" component={TripExpenseScreen} options={{headerShown : false}} />
        <Stack.Screen name="Expense" component={AddExpenseScreen} options={{headerShown : false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;