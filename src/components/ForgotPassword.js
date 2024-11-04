import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');

  // Función para enviar el enlace de recuperación de contraseña
  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor, ingresa un correo electrónico');
      return;
    }

    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert('Éxito', 'Correo de recuperación enviado. Por favor revisa tu bandeja de entrada.');
      navigation.goBack(); // Regresa a la pantalla de inicio de sesión
    } catch (error) {
      console.error('Error al enviar correo de recuperación:', error.message);
      Alert.alert('Error', 'Hubo un problema al enviar el correo de recuperación.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Contraseña</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <Button title="Enviar Correo de Recuperación" onPress={handlePasswordReset} />
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

export default ForgotPassword;
