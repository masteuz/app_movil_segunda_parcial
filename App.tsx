import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from './src/components/Login';
import Home from './src/components/Home';
import ForgotPassword from './src/components/ForgotPassword';
import Register from './src/components/Register';
import AddHabit from './src/components/AddHabit';
import { Text } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen options={{
            header: () => null
          }} name="Home" component={Home} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="AddHabit" component={AddHabit} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
