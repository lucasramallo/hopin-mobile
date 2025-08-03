import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import api from './api'; // Importe a instância da API
import Button from './components/button';
import { customerStorageService, Status, Trip } from './service/CustomerStorageService';
import useStore from './store/index';

export default function LoadingScreen() {
  const router = useRouter();
  const progress = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCancelled = useRef(false);
  const hasNavigated = useRef(false);
  const currentTrip = useStore((state) => state.trip);
  const setCurrentTrip = useStore((state) => state.setCurrentTrip);

  useEffect(() => {
    const startLoading = () => {
      Animated.timing(progress, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }).start();
      timerRef.current = setTimeout(() => {
        if (!isCancelled.current && !hasNavigated.current) {
          if (currentTrip) {
            customerStorageService.addTrip(currentTrip);
          }
          hasNavigated.current = true;
          router.push('/success');
        }
      }, 6000);
    };
    startLoading();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      isCancelled.current = true;
    };
  }, []);

  const handleCancelTrip = async () => {
    try {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      isCancelled.current = true;

      if (currentTrip) {
        const response = await api.patch(`/trip/${currentTrip.id}/cancel`);
        const updatedTrip: Trip = {
          ...currentTrip,
          status: Status.CANCELLED,
        };
        await customerStorageService.addTrip(updatedTrip);
        await setCurrentTrip(updatedTrip);
      }

      if (!hasNavigated.current) {
        hasNavigated.current = true;
        router.push('/home');
      }
    } catch (error) {
      console.error('Erro ao cancelar viagem:', error);
      alert('Erro ao cancelar a viagem. Tente novamente.');
    }
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