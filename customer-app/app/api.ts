import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.13:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('jwt_token');
    console.log(token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      const token = await AsyncStorage.getItem('jwt_token');
      if (token) {
        await AsyncStorage.removeItem('jwt_token');
      }
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = async (token: string) => {
  if (token) {
    await AsyncStorage.setItem('jwt_token', token);
  }
};

export const getAuthToken = async () => {
  return await AsyncStorage.getItem('jwt_token');
};

export const clearAuthToken = async () => {
  await AsyncStorage.removeItem('jwt_token');
};

export default api;