import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { ListItem } from '@rneui/themed';
import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function Home({ navigation }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [data, setData] = useState([]);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

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

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [user])
  );

  const marcarProgresoDiario = async (habitId) => {
    const fechaHoy = dayjs().format('YYYY-MM-DD');
    try {
      const progresoRef = firestore()
        .collection('Habitos')
        .doc(habitId)
        .collection('Progreso');

      await progresoRef.add({
        fecha: firestore.FieldValue.serverTimestamp(),
        completado: true,
      });

      Alert.alert('Éxito', 'Progreso del hábito registrado exitosamente.');
      loadData();
    } catch (error) {
      console.error('Error al registrar el progreso:', error);
      Alert.alert('Error', 'Hubo un problema al registrar el progreso.');
    }
  };

  const handleEditHabit = (habitId) => {
    navigation.navigate('Agregar Habito', { habitId, userId: user.uid });
  };

  const handleDeleteHabit = async (habitId) => {
    Alert.alert(
      'Eliminar Hábito',
      '¿Estás seguro de que quieres eliminar este hábito?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore().collection('Habitos').doc(habitId).delete();
              Alert.alert('Hábito eliminado');
              loadData();
            } catch (error) {
              console.error('Error al eliminar hábito:', error);
              Alert.alert('Error', 'Hubo un problema al eliminar el hábito.');
            }
          },
        },
      ]
    );
  };

  if (initializing) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Mis Hábitos</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Ajustes')} style={styles.settingsButton}>
          <MaterialIcons name="settings" size={28} color="#6200EE" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Agregar Habito', { userId: user.uid })}>
        <Text style={styles.addButtonText}>Agregar Hábito</Text>
      </TouchableOpacity>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem bottomDivider containerStyle={styles.listItem}>
            <ListItem.Content>
              <ListItem.Title style={styles.title}>{item.nombre}</ListItem.Title>
              <ListItem.Subtitle style={styles.subtitle}>Descripción: {item.descripcion}</ListItem.Subtitle>
              <Text style={styles.detail}>Frecuencia: {item.frecuencia.join(', ')}</Text>
              <Text style={styles.detail}>Hora Recordatorio: {item.hora_recordatorio.toDate().toLocaleTimeString()}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleEditHabit(item.id)} style={styles.editButton}>
                  <MaterialIcons name="edit" size={20} color="#FFFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteHabit(item.id)} style={styles.deleteButton}>
                  <MaterialIcons name="delete" size={20} color="#FFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => marcarProgresoDiario(item.id)} style={styles.completeButton}>
                  <Text style={styles.buttonText}>Marcar como Completado</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Progresos', { habitId: item.id })} style={styles.progressButton}
                >
                  <Text style={styles.buttonText}>Ver Progresos</Text>
                </TouchableOpacity>
              </View>

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
    backgroundColor: '#f7f7f7',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  settingsButton: {
    padding: 8,
  },
  addButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  progressButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

