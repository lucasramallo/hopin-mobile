import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import api, { setAuthToken } from './api';
import Button from './components/button';
import useStore from './store/index';

export default function LoginScreen() {
  const router = useRouter();
  const setCurrentCustomer = useStore((state) => state.setCurrentCustomer);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const payload = {
      email,
      password,
    };

    try {
      const response = await api.post('/auth/login', payload);
      const { token } = response.data;

      await setAuthToken(token);

      router.replace('/home');
    } catch (error) {
      console.error('Erro na requisição:', error);

      console.error('Erro na configuração:', error);
      Alert.alert('Erro', 'Ocorreu um erro inesperado.');
    }
  };

  const handleClearStorage = async () => {
    const router = useRouter();
    try {
      await AsyncStorage.clear();
      router.push('/loginScreen');
    } catch (e) {
      console.error('Erro ao limpar AsyncStorage:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={18} color="black" style={styles.icon} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
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

      <Button title="Continuar" onPress={handleLogin} />

      <TouchableOpacity onPress={() => router.replace('/registerScreen')}>
        <Text style={styles.linkText}>Fazer Cadastro</Text>
      </TouchableOpacity>

      <Button title="Resetar Memória" onPress={handleClearStorage} />
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
});