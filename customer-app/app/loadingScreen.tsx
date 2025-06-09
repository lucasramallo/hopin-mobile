import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { customerStorageService } from './service/CustomerStorageService';

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    async function checkCustomer() {
      try {
        const savedCustomer = await customerStorageService.getCustomer();

        if (savedCustomer) {
          router.replace('/home');
        } else {
          router.replace('/loginScreen');
        }
      } catch (error) {
        console.error('Erro ao verificar cliente salvo:', error);
        router.replace('/loginScreen');
      }
    }

    checkCustomer();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
