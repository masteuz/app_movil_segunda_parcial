import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddHabit = ({ route, navigation }) => {
  const { userId, habitId } = route.params || {};

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [horaRecordatorio, setHoraRecordatorio] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (habitId) {
      const loadHabitData = async () => {
        try {
          const habitSnapshot = await firestore().collection('Habitos').doc(habitId).get();
          if (habitSnapshot.exists) {
            const habitData = habitSnapshot.data();
            setNombre(habitData.nombre);
            setDescripcion(habitData.descripcion);
            setFrecuencia(habitData.frecuencia.join(', '));
            setHoraRecordatorio(habitData.hora_recordatorio.toDate());
          }
        } catch (error) {
          console.error("Error al cargar hábito:", error);
          Alert.alert("Error", "Hubo un problema al cargar el hábito");
        }
      };
      loadHabitData();
    }
  }, [habitId]);

  const onChangeHora = (event, selectedDate) => {
    const currentDate = selectedDate || horaRecordatorio;
    setShowTimePicker(false);
    setHoraRecordatorio(currentDate);
  };

  const handleSaveHabit = async () => {
    try {
      const habitData = {
        usuario_id: userId,
        nombre,
        descripcion,
        frecuencia: frecuencia.split(',').map(day => day.trim()),
        hora_recordatorio: horaRecordatorio,
      };

      if (habitId) {
        await firestore().collection('Habitos').doc(habitId).update(habitData);
        Alert.alert("Éxito", "Hábito actualizado exitosamente");
      } else {
        await firestore().collection('Habitos').add(habitData);
        Alert.alert("Éxito", "Hábito agregado exitosamente");
      }
      navigation.navigate('Home');
    } catch (error) {
      console.error("Error al guardar hábito:", error);
      Alert.alert("Error", "Hubo un problema al guardar el hábito");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{habitId ? "Editar Hábito" : "Agregar Hábito"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del Hábito"
        placeholderTextColor="#aaa"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        placeholderTextColor="#aaa"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TextInput
        style={styles.input}
        placeholder="Frecuencia (ej: lunes, miércoles)"
        placeholderTextColor="#aaa"
        value={frecuencia}
        onChangeText={setFrecuencia}
      />

      <TouchableOpacity style={styles.timeButton} onPress={() => setShowTimePicker(true)}>
        <Text style={styles.buttonText}>Seleccionar Hora de Recordatorio</Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={horaRecordatorio}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeHora}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveHabit}>
        <Text style={styles.buttonText}>{habitId ? "Actualizar Hábito" : "Guardar Hábito"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  timeButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddHabit;
