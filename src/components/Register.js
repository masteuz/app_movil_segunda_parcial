import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Función para manejar el registro de usuario
  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, ingresa un correo electrónico y una contraseña');
      return;
    }

    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const userId = userCredential.user.uid;

      // Guardar información del usuario en Firestore
      await firestore().collection('Usuarios').doc(userId).set({
        email: email
      });

      Alert.alert('Éxito', 'Cuenta creada exitosamente');
      navigation.navigate('Login'); // Redirige a la pantalla de inicio de sesión
    } catch (error) {
      console.error('Error al crear cuenta:', error.message);
      Alert.alert('Error', 'Hubo un problema al crear la cuenta. Verifica los datos ingresados.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

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

      <Button title="Registrar" onPress={handleRegister} />
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
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
});

export default Register;
