import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../components/button';
import { Customer, customerStorageService } from '../service/CustomerStorageService';

const handleClearStorage = async () => {
  const router = useRouter();
  try {
    await AsyncStorage.clear();
    router.push('/loginScreen');
  } catch (e) {
    console.error('Erro ao limpar AsyncStorage:', e);
  }
};

export default function Profile() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadCustomer = async () => {
      const user = await customerStorageService.getCustomer();
      setCustomer(user);
    };

    loadCustomer();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/profile.png')}
        style={styles.avatar}
      />
      <Text style={styles.name}>{customer?.name}</Text>
      <Text style={styles.email}>{customer?.email}</Text>

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Informações de Pagamento</Text>
      </TouchableOpacity>

      <Button title="Resetar Memória" onPress={handleClearStorage} style={styles.reset} />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cartão de Crédito</Text>
            <Text>Número: {customer?.creditCardNumber || 'Não informado'}</Text>
            <Text>Validade: {customer?.creditCardExpiry || 'Não informado'}</Text>
            <Text>CVV: {customer?.creditCardCVV || 'Não informado'}</Text>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 30,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  infoText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  reset: {
    marginTop: '100%',
  },
});