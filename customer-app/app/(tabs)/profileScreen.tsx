import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../api'; // Assuming axios is configured here
import Button from '../components/button';
import { Customer, customerStorageService } from '../service/CustomerStorageService';

interface CustomerUpdateForm {
  name: string;
  email: string;
  password: string;
  creditCardNumber?: string;
  creditCardExpiry?: string;
  creditCardCVV?: string;
}

export default function Profile() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form, setForm] = useState<CustomerUpdateForm>({
    name: '',
    email: '',
    password: '',
    creditCardNumber: '',
    creditCardExpiry: '',
    creditCardCVV: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const loadCustomerAndSync = async () => {
      try {
        const netInfo = await NetInfo.fetch();
        const isConnected = netInfo.isConnected;

        const user = await customerStorageService.getCustomer();
        setCustomer(user);
        if (user) {
          setForm({
            name: user.name,
            email: user.email,
            password: '',
            creditCardNumber: user.creditCardNumber || '',
            creditCardExpiry: user.creditCardExpiry || '',
            creditCardCVV: user.creditCardCVV || '',
          });
        }

        if (isConnected) {
          const pendingUpdate = await customerStorageService.getPendingCustomerUpdate();
          if (pendingUpdate && pendingUpdate.needsSync) {
            try {
              await api.put('/customer', {
                name: pendingUpdate.name,
                email: pendingUpdate.email,
                password: pendingUpdate.password,
                creditCardNumber: pendingUpdate.creditCardNumber,
                creditCardExpiry: pendingUpdate.creditCardExpiry,
                creditCardCVV: pendingUpdate.creditCardCVV,
              });

              if (user) {
                const updatedCustomer: Customer = {
                  ...user,
                  name: pendingUpdate.name,
                  email: pendingUpdate.email,
                  password: pendingUpdate.password,
                  creditCardNumber: pendingUpdate.creditCardNumber,
                  creditCardExpiry: pendingUpdate.creditCardExpiry,
                  creditCardCVV: pendingUpdate.creditCardCVV,
                };
                await customerStorageService.saveCustomer(updatedCustomer);
                setCustomer(updatedCustomer);
                setForm({
                  name: pendingUpdate.name,
                  email: pendingUpdate.email,
                  password: '',
                  creditCardNumber: pendingUpdate.creditCardNumber || '',
                  creditCardExpiry: pendingUpdate.creditCardExpiry || '',
                  creditCardCVV: pendingUpdate.creditCardCVV || '',
                });
              }
              await customerStorageService.clearPendingCustomerUpdate();
            } catch (error) {
              console.error('Falha ao sincronizar atualização do cliente:', error);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar cliente ou sincronizar:', error);
      }
    };

    loadCustomerAndSync();
  }, []);

  const handleClearStorage = async () => {
    try {
      await AsyncStorage.clear();
      router.push('/loginScreen');
    } catch (e) {
      console.error('Erro ao limpar AsyncStorage:', e);
    }
  };

  const handleEditSubmit = async () => {
    if (!form.name || !form.email) {
      setFormError('Nome e email são obrigatórios');
      return;
    }

    try {
      const netInfo = await NetInfo.fetch();
      const isConnected = netInfo.isConnected;

      const updatedCustomer: Customer = {
        ...customer!,
        name: form.name,
        email: form.email,
        password: form.password || customer!.password,
        creditCardNumber: form.creditCardNumber,
        creditCardExpiry: form.creditCardExpiry,
        creditCardCVV: form.creditCardCVV,
      };

      if (isConnected) {
        // Enviar para a API
        try {
          await api.put('/customer', {
            name: form.name,
            email: form.email,
            password: form.password || customer!.password,
            creditCardNumber: form.creditCardNumber,
            creditCardExpiry: form.creditCardExpiry,
            creditCardCVV: form.creditCardCVV,
          });
          // Atualizar localmente
          await customerStorageService.saveCustomer(updatedCustomer);
          await customerStorageService.clearPendingCustomerUpdate();
        } catch (error) {
          console.error('Falha ao atualizar cliente na API:', error);
          // Salvar como pendente se falhar
          await customerStorageService.addPendingCustomerUpdate({
            name: form.name,
            email: form.email,
            password: form.password || customer!.password,
            creditCardNumber: form.creditCardNumber,
            creditCardExpiry: form.creditCardExpiry,
            creditCardCVV: form.creditCardCVV,
            needsSync: true,
          });
          await customerStorageService.saveCustomer(updatedCustomer);
        }
      } else {
        // Salvar localmente como pendente
        await customerStorageService.addPendingCustomerUpdate({
          name: form.name,
          email: form.email,
          password: form.password || customer!.password,
          creditCardNumber: form.creditCardNumber,
          creditCardExpiry: form.creditCardExpiry,
          creditCardCVV: form.creditCardCVV,
          needsSync: true,
        });
        await customerStorageService.saveCustomer(updatedCustomer);
      }

      setCustomer(updatedCustomer);
      setEditModalVisible(false);
      setFormError(null);
    } catch (error) {
      console.error('Erro ao salvar alterações do cliente:', error);
      setFormError('Erro ao salvar alterações. Tente novamente.');
    }
  };

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
      <TouchableOpacity style={styles.button} onPress={() => setEditModalVisible(true)}>
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>
      <Button title="Resetar Memória" onPress={handleClearStorage} style={styles.reset} />

      {/* Modal de Informações de Pagamento */}
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

      {/* Modal de Edição de Perfil */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            {formError && <Text style={styles.errorText}>{formError}</Text>}
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Senha (deixe em branco para manter)"
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Número do Cartão"
              value={form.creditCardNumber}
              onChangeText={(text) => setForm({ ...form, creditCardNumber: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Validade (MM/AA)"
              value={form.creditCardExpiry}
              onChangeText={(text) => setForm({ ...form, creditCardExpiry: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="CVV"
              value={form.creditCardCVV}
              onChangeText={(text) => setForm({ ...form, creditCardCVV: text })}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={handleEditSubmit} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cancelar</Text>
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
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  reset: {
    marginTop: '100%',
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#666',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});