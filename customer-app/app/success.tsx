import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import api from './api'; // Importe a instância da API
import Button from './components/button';
import type { TripResponseDTO } from './newTrip';
import useStore from './store/index';

export default function SuccessScreen() {
  const router = useRouter();
  const currentTrip = useStore((state) => state.trip);
  const setCurrentTrip = useStore((state) => state.setCurrentTrip);

  const handleCompleteTrip = async () => {
    try {
      if (!currentTrip?.id) {
        alert('Nenhuma viagem encontrada para concluir.');
        return;
      }

      const response = await api.patch<TripResponseDTO>(`/trip/${currentTrip.id}/complete`);
      const tripResponse: TripResponseDTO = response.data;

      await setCurrentTrip({
        ...tripResponse,
        customerId: tripResponse.customer.id,
        payment: { amount: tripResponse.payment.amount, currency: 'BRL' },
      });
      router.replace('/reviewScreen');
    } catch (error) {
      console.error('Erro ao concluir viagem:', error);
      alert('Erro ao concluir a viagem. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href="/home">
          <Ionicons name="close" size={28} color="#000" />
        </Link>
      </View>
      <View style={styles.content}>
        <Ionicons name="checkmark-circle" size={80} color="#28a745" style={styles.checkIcon} />
        <Text style={styles.title}>Obrigado!</Text>
        <Text style={styles.subtitle}>Esperamos que tenha gostado da Viagem!</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Resumo</Text>
            <Ionicons name="information-circle-outline" size={20} color="#666" />
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>De</Text>
            <Text style={styles.summaryValue}>{currentTrip?.origin}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Para</Text>
            <Text style={styles.summaryValue}>{currentTrip?.destination}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Distância</Text>
            <Text style={styles.summaryValue}>6km</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryValue}>{`R$ ${currentTrip?.payment.amount}`}</Text>
          </View>
        </View>
        <Button onPress={handleCompleteTrip} title="Concluir" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
  },
  content: {
    marginTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  checkIcon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  summaryCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryRow: {
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});