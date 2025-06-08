import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Button from './components/button';
import { customerStorageService, Status, Trip } from './service/CustomerStorageService';

export default function LoadingScreen() {
  const router = useRouter();
  const { tripId } = useLocalSearchParams(); // Recuperar o tripId dos query parameters
  const progress = useRef(new Animated.Value(0)).current;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTrip = async () => {
    if (typeof tripId !== 'string') {
      setError('ID da viagem inválido');
      return;
    }

    try {
      const trips = await customerStorageService.getTrips();
      const foundTrip = trips.find((t) => t.id === tripId);
      if (foundTrip) {
        setTrip(foundTrip);
      } else {
        setError('Viagem não encontrada');
      }
    } catch (error) {
      console.error('Erro ao buscar viagem:', error);
      setError('Erro ao buscar a viagem.');
    }
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const startLoading = async () => {
      await fetchTrip();

      Animated.timing(progress, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }).start();

      timer = setTimeout(() => {
        router.push('/success');
      }, 6000);
    };

    startLoading();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [router, tripId]);

  const handleCancelTrip = () => {
    if (trip) {
      const newTrip: Partial<Trip> & { id: string } = {
        ...trip,
        status: Status.CANCELED,
      };

      customerStorageService.updateTrip(newTrip);
    }

    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Viagem em andamento</Text>
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <Button
        title="Cancelar Viagem"
        onPress={handleCancelTrip}
        variant="danger"
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  tripDetails: {
    alignItems: 'center',
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    marginVertical: 5,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '80%',
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 30,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 10,
  },
});
