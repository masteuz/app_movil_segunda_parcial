import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
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

  // Función para cambiar el estado de "completado"
  const toggleCompletado = async (habitId, currentStatus) => {
    try {
      await firestore().collection('Habitos').doc(habitId).update({
        completado: !currentStatus, // Cambia a true si es false, y viceversa
      });
      loadData(); // Recargar los datos después de actualizar el estado
    } catch (error) {
      console.error('Error al actualizar estado de completado:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el estado del hábito');
    }
  };

  // Función para eliminar un hábito
  const handleDelete = async (habitId) => {
    try {
      await firestore().collection('Habitos').doc(habitId).delete();
      Alert.alert('Hábito eliminado', 'El hábito ha sido eliminado exitosamente');
      loadData(); // Recargar los datos después de la eliminación
    } catch (error) {
      console.error('Error al eliminar hábito:', error);
      Alert.alert('Error', 'Hubo un problema al eliminar el hábito');
    }
  };

  const confirmDelete = (habitId) => {
    Alert.alert(
      "Eliminar Hábito",
      "¿Estás seguro de que deseas eliminar este hábito?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => handleDelete(habitId) }
      ]
    );
  };
  

  if (initializing) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Hábitos</Text>
      
      {/* Botón para navegar a AddHabit en modo de creación */}
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
              
              {/* Switch para cambiar el estado de completado */}
              <View style={styles.switchContainer}>
                <Text style={styles.detail}>Completado: {item.completado ? 'Sí' : 'No'}</Text>
                <Switch
                  value={item.completado}
                  onValueChange={() => toggleCompletado(item.id, item.completado)}
                />
              </View>
            </ListItem.Content>
            
            {/* Botón de edición */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('AddHabit', { userId: user.uid, habitId: item.id })}
            >
              <Text style={styles.editButton}>Editar</Text>
            </TouchableOpacity>

            {/* Botón de eliminación */}
            <TouchableOpacity 
              onPress={() => confirmDelete(item.id)}
            >
              <Text style={styles.deleteButton}>Eliminar</Text>
            </TouchableOpacity>
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  editButton: {
    color: 'blue',
    fontSize: 14,
    padding: 5,
  },
  deleteButton: {
    color: 'red',
    fontSize: 14,
    padding: 5,
    marginLeft: 10,
  },
});
