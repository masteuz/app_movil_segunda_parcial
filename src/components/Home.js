import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { ListItem } from '@rneui/themed';
import { useFocusEffect } from '@react-navigation/native';

export default function Home({ navigation }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [data, setData] = useState([]);

  // Manejar el cambio de estado del usuario
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  // Función para cargar los datos de hábitos del usuario desde Firestore
  async function loadData() {
    if (user) {
      try {
        const habitos = await firestore()
          .collection('Habitos')
          .where('usuario_id', '==', user.uid)
          .get();
        setData(habitos.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.log(error);
      }
    }
  }

  // Recargar los datos cada vez que la pantalla Home se enfoca
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [user])
  );

  if (initializing) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Hábitos</Text>
      
      {/* Botón para navegar a AddHabit y pasar el ID del usuario */}
      <Button 
        title="Agregar Hábito"
        onPress={() => navigation.navigate('AddHabit', { userId: user.uid })}
      />

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title style={styles.title}>{item.nombre}</ListItem.Title>
              <ListItem.Subtitle style={styles.subtitle}>Descripción: {item.descripcion}</ListItem.Subtitle>
              <Text style={styles.detail}>Frecuencia: {item.frecuencia.join(', ')}</Text>
              <Text style={styles.detail}>Hora Recordatorio: {item.hora_recordatorio.toDate().toLocaleTimeString()}</Text>
              <Text style={styles.detail}>Completado: {item.completado ? 'Sí' : 'No'}</Text>
            </ListItem.Content>
          </ListItem>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    color: '#333',
  },
});
