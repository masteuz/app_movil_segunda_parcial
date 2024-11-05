import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from './src/components/Login';
import Home from './src/components/Home';
import ForgotPassword from './src/components/ForgotPassword';
import Register from './src/components/Register';
import UserSettings from './src/components/UserSettings'
import AddHabit from './src/components/AddHabit';
import Progress from './src/components/Progress';
import { Text } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen options={{
            header: () => null
          }} name="Login" component={Login} />
          <Stack.Screen options={{
            header: () => null
          }} name="Home" component={Home} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="AddHabit" component={AddHabit} />
          <Stack.Screen name="UserSettings" component={UserSettings} />
          <Stack.Screen name="Progress" component={Progress} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
