import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { BarChart } from 'react-native-chart-kit';
import dayjs from 'dayjs';

const screenWidth = Dimensions.get('window').width;

const Progress = ({ route }) => {
  const { habitId } = route.params;
  const [labels, setLabels] = useState([]);
  const [completedCounts, setCompletedCounts] = useState([]);

  useEffect(() => {
    const loadProgressData = async () => {
      try {
        const progressSnapshot = await firestore()
          .collection('Habitos')
          .doc(habitId)
          .collection('Progreso')
          .get();
        
        if (progressSnapshot.empty) {
          console.log("No hay datos de progreso disponibles");
          return;
        }

        const progressData = progressSnapshot.docs.map(doc => doc.data());

        // Convertir timestamps a formato de fecha legible
        const dates = progressData.map(item => {
          const fecha = item.fecha.toDate(); // Convertir a objeto Date
          return dayjs(fecha).format('DD/MM/YYYY'); // Formatear la fecha como "DD/MM/YYYY"
        });

        const counts = progressData.map(item => (item.completado ? 1 : 0));

        setLabels(dates);
        setCompletedCounts(counts);
      } catch (error) {
        console.error('Error al cargar el progreso:', error);
      }
    };

    loadProgressData();
  }, [habitId]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Progreso del Hábito</Text>

      {completedCounts.length > 0 ? (
        <BarChart
          data={{
            labels: labels,
            datasets: [{ data: completedCounts }],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: '#1E2923',
            backgroundGradientFrom: '#08130D',
            backgroundGradientTo: '#08130D',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      ) : (
        <Text style={styles.noData}>No hay datos de progreso disponibles.</Text>
      )}
    </ScrollView>
  );
};

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
  noData: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Progress;
