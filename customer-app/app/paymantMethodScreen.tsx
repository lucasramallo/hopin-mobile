import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from './components/button';
import { customerStorageService } from './service/CustomerStorageService';
import useStore from './store/index';

export default function PaymentMethodScreen() {
  const router = useRouter();

  const currentCustomer = useStore((state) => state.customer);
  const resetCurrentCustomer = useStore((state) => state.resetCurrentCustomer);

  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [creditCardCVV, setCreditCardCVV] = useState('');
  const [creditCardExpiry, setCreditCardExpiry] = useState('');

  const handleSavePayment = async () => {
    if (!currentCustomer) {
      alert('Nenhum usuário encontrado');
      return;
    }

    if (!creditCardNumber || !creditCardCVV || !creditCardExpiry) {
      alert('Preencha todos os campos do cartão');
      return;
    }

    try {
      const updatedCustomer = {
        ...currentCustomer,
        creditCardNumber,
        creditCardCVV,
        creditCardExpiry,
      };

      resetCurrentCustomer();

      await customerStorageService.saveCustomer(updatedCustomer);

      alert('Dados do cartão salvos com sucesso!');
      router.push('/home');
    } catch (error) {
      console.error('Erro ao salvar dados do cartão:', error);
      alert('Erro ao salvar dados do cartão');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pagamento</Text>

      <View style={styles.inputContainer}>
        <FontAwesome name="credit-card-alt" size={18} color="black" />
        <TextInput
          placeholder="Número do cartão"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="numeric"
          value={creditCardNumber}
          onChangeText={setCreditCardNumber}
          maxLength={16}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="password" size={18} color="black" />
        <TextInput
          placeholder="CVV"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="numeric"
          value={creditCardCVV}
          onChangeText={setCreditCardCVV}
          maxLength={4}
          secureTextEntry
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="date-range" size={18} color="black" />
        <TextInput
          placeholder="Data de Validade (MM/AA)"
          placeholderTextColor="#999"
          style={styles.input}
          value={creditCardExpiry}
          onChangeText={setCreditCardExpiry}
          maxLength={5}
        />
      </View>

      <Button title="Continuar" onPress={handleSavePayment} />

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.linkText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  linkText: {
    marginTop: 20,
    color: '#555',
  },
});
