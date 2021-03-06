import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../Screens/LoginScreen';
import HomeScreen from '../Screens/HomeScreen';
import SettingScreen from '../Screens/SettingScreen';
import AddReminderScreen from '../Screens/AddReminderscreen';
import ReminderScreen from '../Screens/RemindersScreen'
import AddToDoScreen from '../Screens/AddTodoScreen'
import ToDoScreen from '../Screens/ToDoScreen'
import AddLocationScreen from '../Screens/AddLocationScreen'
import LocationScreen from '../Screens/LocationScreen'

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Smart Clock Home Page</Text>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode={'none'} initialRouteName={'Login'}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={SettingsScreen} />
        <Stack.Screen name="Settings" component={SettingScreen} />
        <Stack.Screen name="AddReminder" component={AddReminderScreen} />
        <Stack.Screen name="Reminder" component={ReminderScreen} />
        <Stack.Screen name='AddTodo' component={AddToDoScreen} />
        <Stack.Screen name='Todo' component={ToDoScreen} />
        <Stack.Screen name='AddLocation' component={AddLocationScreen} />
        <Stack.Screen name='Location' component={LocationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
