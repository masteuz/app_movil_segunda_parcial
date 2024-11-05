import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const UserSettings = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');

  // Cargar los datos actuales del usuario
  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      setUserId(user.uid);
      loadUserData(user.uid);
    }
  }, []);

  const loadUserData = async (uid) => {
    try {
      const userDoc = await firestore().collection('Usuarios').doc(uid).get();
      if (userDoc.exists) {
        setUsername(userDoc.data().username || '');
      }
    } catch (error) {
      console.log('Error al cargar datos del usuario:', error);
    }
  };

  // Función para actualizar el nombre de usuario
  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre de usuario.');
      return;
    }
    try {
      await firestore().collection('Usuarios').doc(userId).update({
        username: username,
      });
      Alert.alert('Éxito', 'Nombre de usuario actualizado.');
    } catch (error) {
      console.error('Error al actualizar nombre de usuario:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el nombre de usuario.');
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => navigation.replace('Login'))
      .catch((error) => console.error('Error al cerrar sesión:', error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración de Usuario</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
      />

      <Button title="Guardar Cambios" onPress={handleSave} />

      <Button title="Cerrar Sesión" color="red" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
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

export default UserSettings;
