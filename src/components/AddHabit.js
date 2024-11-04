import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddHabit = ({ route, navigation }) => {
  const { userId, habitId } = route.params || {}; // Recibe el ID del usuario y el ID del hábito

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [horaRecordatorio, setHoraRecordatorio] = useState(new Date());
  const [completado, setCompletado] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Cargar datos del hábito en modo de edición
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
            setCompletado(habitData.completado);
          }
        } catch (error) {
          console.error("Error al cargar hábito:", error);
          Alert.alert("Error", "Hubo un problema al cargar el hábito");
        }
      };
      loadHabitData();
    }
  }, [habitId]);

  // Función para manejar la selección de hora
  const onChangeHora = (event, selectedDate) => {
    const currentDate = selectedDate || horaRecordatorio;
    setShowTimePicker(false);
    setHoraRecordatorio(currentDate);
  };

  // Función para agregar o actualizar el hábito en Firestore
  const handleSaveHabit = async () => {
    try {
      const habitData = {
        usuario_id: userId,
        nombre: nombre,
        descripcion: descripcion,
        frecuencia: frecuencia.split(',').map(day => day.trim()),
        hora_recordatorio: horaRecordatorio,
        completado: completado,
      };

      if (habitId) {
        // Modo edición
        await firestore().collection('Habitos').doc(habitId).update(habitData);
        Alert.alert("Éxito", "Hábito actualizado exitosamente");
      } else {
        // Modo creación
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
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TextInput
        style={styles.input}
        placeholder="Frecuencia (ej: lunes, miércoles)"
        value={frecuencia}
        onChangeText={setFrecuencia}
      />

      <Button title="Seleccionar Hora de Recordatorio" onPress={() => setShowTimePicker(true)} />

      {showTimePicker && (
        <DateTimePicker
          value={horaRecordatorio}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeHora}
        />
      )}

      <Button title={habitId ? "Actualizar Hábito" : "Guardar Hábito"} onPress={handleSaveHabit} />
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

export default AddHabit;
