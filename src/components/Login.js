import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import { getAuth } from "firebase/auth";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('mateusvasiak@gmail.com');
  const [password, setPassword] = useState('12345678');

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    try {
      let user = await auth().signInWithEmailAndPassword(email, password);
      console.log(user)
      console.log('Inicio de sesión exitoso');
      // Navegar a la pantalla principal o al home
      navigation.navigate('Home'); // Asegúrate de que la pantalla 'Home' exista en tu navegación
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button style={styles.button} title="Iniciar Sesión" onPress={handleLogin} />

      <Button style={styles.button} title="Recuperar Contraseña" onPress={() => navigation.navigate('ForgotPassword')} />

      <Button style={styles.button} title="Crear Cuenta" onPress={() => navigation.navigate('Register')} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    padding: 10
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 10, // Agrega un margen entre los botones
  },
});

export default Login;
