import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddHabit = ({ route, navigation }) => {
  const { userId } = route.params; // Recibe el ID del usuario
  
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [frecuencia, setFrecuencia] = useState(''); // Puedes ajustar el formato según tu interfaz
  const [horaRecordatorio, setHoraRecordatorio] = useState(new Date());
  const [completado, setCompletado] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Función para mostrar el selector de hora
  const onChangeHora = (event, selectedDate) => {
    const currentDate = selectedDate || horaRecordatorio;
    setShowTimePicker(false);
    setHoraRecordatorio(currentDate);
  };

  // Función para guardar el hábito en Firestore
  const handleAddHabit = async () => {
    try {
      await firestore().collection('Habitos').add({
        usuario_id: userId,
        nombre: nombre,
        descripcion: descripcion,
        frecuencia: frecuencia.split(',').map(day => day.trim()), // Convierte frecuencia en un array
        hora_recordatorio: horaRecordatorio, // Guarda el timestamp de la hora seleccionada
        completado: completado,
      });
      Alert.alert('Éxito', 'Hábito agregado exitosamente');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error al agregar hábito:', error);
      Alert.alert('Error', 'Hubo un problema al agregar el hábito');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Hábito</Text>

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

      <Button title="Guardar Hábito" onPress={handleAddHabit} />
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
