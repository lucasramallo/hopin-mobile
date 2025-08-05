import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api, { setAuthToken } from './api';
import Button from './components/button';
import { customerStorageService, Role, type Customer } from './service/CustomerStorageService';
import useStore from './store/index';

// Corrected interface for registerResponse
interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const setCurrentCustomer = useStore((state) => state.setCurrentCustomer);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [creditCardCVV, setCreditCardCVV] = useState('');
  const [creditCardExpiry, setCreditCardExpiry] = useState('');

  const handleCreateAccount = async () => {
    if (!name || !email || !password) {
      alert('Preencha todos os campos');
      return;
    }

    const payload = {
      name,
      email,
      password,
      creditCardNumber,
      creditCardCVV,
      creditCardExpiry,
    };

    try {
      const registerResponse = await api.post<UserResponse>('/auth/customer/register', payload);
      const customer = registerResponse.data;

      const loginPayload = {
        email,
        password,
      };
      const loginResponse = await api.post('/auth/login', loginPayload);
      const { token } = loginResponse.data;

      const newCustomer: Customer = {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        password,
        createdAt: customer.createdAt,
        role: Role.USER,
        creditCardNumber: creditCardNumber || '',
        creditCardExpiry: creditCardExpiry || '',
        creditCardCVV: creditCardCVV || '',
        trips: [],
      };

      await setAuthToken(token);
      await setCurrentCustomer(newCustomer);
      await customerStorageService.saveCustomer(newCustomer);

      router.replace('/home');
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao criar conta ou logar. Verifique seus dados ou tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={18} color="black" style={styles.icon} />
        <TextInput
          placeholder="Nome Completo"
          placeholderTextColor="#999"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={18} color="black" style={styles.icon} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={18} color="black" style={styles.icon} />
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="credit-card" size={18} color="black" style={styles.icon} />
        <TextInput
          placeholder="Número do Cartão"
          placeholderTextColor="#999"
          style={styles.input}
          value={creditCardNumber}
          onChangeText={setCreditCardNumber}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="calendar" size={18} color="black" style={styles.icon} />
        <TextInput
          placeholder="Data de Expiração (MM/AA)"
          placeholderTextColor="#999"
          style={styles.input}
          value={creditCardExpiry}
          onChangeText={setCreditCardExpiry}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={18} color="black" style={styles.icon} />
        <TextInput
          placeholder="CVV"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
          value={creditCardCVV}
          onChangeText={setCreditCardCVV}
        />
      </View>

      <Button title="Continuar" onPress={handleCreateAccount} />

      <TouchableOpacity onPress={() => router.replace('/loginScreen')}>
        <Text style={styles.linkText}>Fazer Login</Text>
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
    backgroundColor: '#E5E5E5',
    padding: 5,
    borderRadius: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  linkText: {
    marginTop: 20,
    color: '#555',
  },
  iconImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 10,
  },
});