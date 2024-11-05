import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { BarChart, LineChart } from 'react-native-chart-kit';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(isoWeek);

const screenWidth = Dimensions.get('window').width;

const Progress = ({ route }) => {
  const { habitId } = route.params;
  const [weeklyLabels, setWeeklyLabels] = useState([]);
  const [weeklyCounts, setWeeklyCounts] = useState([]);
  const [dailyLabels, setDailyLabels] = useState([]);
  const [dailyCounts, setDailyCounts] = useState([]);

  useEffect(() => {
    const loadProgressData = async () => {
      try {
        const progressSnapshot = await firestore()
          .collection('Habitos')
          .doc(habitId)
          .collection('Progreso')
          .orderBy('fecha', 'desc')
          .limit(30) // Limita a los últimos 30 registros
          .get();
        
        if (progressSnapshot.empty) {
          console.log("No hay datos de progreso disponibles");
          return;
        }

        const progressData = progressSnapshot.docs.map(doc => doc.data()).reverse();

        // Agrupar por semana para el gráfico de barras
        const weeklyData = {};
        progressData.forEach(item => {
          const week = dayjs(item.fecha.toDate()).isoWeek();
          weeklyData[week] = (weeklyData[week] || 0) + (item.completado ? 1 : 0);
        });

        setWeeklyLabels(Object.keys(weeklyData).map(week => `Semana ${week}`));
        setWeeklyCounts(Object.values(weeklyData));

        // Para el gráfico de líneas, convertir los timestamps en fechas legibles
        const dates = progressData.map(item => dayjs(item.fecha.toDate()).format('dddd ' + 'DD/MM/YYYY'));
        const counts = progressData.map(item => (item.completado ? 1 : 0));

        setDailyLabels(dates);
        setDailyCounts(counts);
      } catch (error) {
        console.error('Error al cargar el progreso:', error);
      }
    };

    loadProgressData();
  }, [habitId]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Progreso Semanal del Hábito</Text>

      {weeklyCounts.length > 0 ? (
        <ScrollView horizontal>
          <LineChart
            data={{
              labels: weeklyLabels,
              datasets: [{ data: weeklyCounts }],
            }}
            width={screenWidth + weeklyLabels.length * 20} // Ajustable para desplazamiento
            height={220}
            yAxisSuffix=" días"
            chartConfig={{
              backgroundGradientFrom: '#f7f7f7',
              backgroundGradientTo: '#f7f7f7',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(60, 60, 60, ${opacity})`,
              style: { borderRadius: 16 },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            fromZero
          />
        </ScrollView>
      ) : (
        <Text style={styles.noData}>No hay datos de progreso disponibles para el gráfico semanal.</Text>
      )}

      <Text style={styles.header}>Progreso Diario del Hábito</Text>

      {dailyCounts.length > 0 ? (
        <ScrollView horizontal>
          <LineChart
            data={{
              labels: dailyLabels,
              datasets: [{ data: dailyCounts }],
            }}
            width={screenWidth + dailyLabels.length * 100} // Ajustable para desplazamiento
            height={220}
            yAxisSuffix=" "
            chartConfig={{
              backgroundGradientFrom: '#f7f7f7',
              backgroundGradientTo: '#f7f7f7',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(60, 60, 60, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#6200EE',
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            fromZero
          />
        </ScrollView>
      ) : (
        <Text style={styles.noData}>No hay datos de progreso disponibles para el gráfico diario.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
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
