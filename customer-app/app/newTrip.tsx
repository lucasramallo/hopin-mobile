import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import Button from './components/button';
import { customerStorageService, Status } from './service/CustomerStorageService';

export default function TripRequestScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [requested, setRequested] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [time, setTime] = useState(0);
  const [price, setPrice] = useState(0);
  const [distance, setDistance] = useState(0);


  useEffect(() => {
    if (requested) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [requested]);

  const handleGenerateTrip = () => {
    // Simular geração de dados de viagem
    const simulatedTime = Math.floor(Math.random() * 10) + 1; // Tempo entre 1 e 10 minutos
    const simulatedPrice = Math.floor(Math.random() * 50) + 10; // Preço entre R$10 e R$60
    const simulatedDistance = Math.floor(Math.random() * 20) + 1; // Distância entre 1 e 20 Km

    setTime(simulatedTime);
    setPrice(simulatedPrice);
    setDistance(simulatedDistance);

    // Marcar a viagem como solicitada
    setRequested(true);
  }

  const handleTripRequest = async () => {
    try {
      if (!origin || !destination) {
        alert('Por favor, preencha origem e destino.');
        return;
      }

      //  const newCustomer: Customer = {
      //    id: uuidv4(),
      //    name: 'John Doe',
      //    email: 'john.doe@example.com',
      //    password: 'securepassword',
      //    createdAt: new Date().toISOString(),
      //    role: Role.USER,
      //    creditCardNumber: '1234-5678-9012-3456',
      //    creditCardExpiry: '12/25',
      //    creditCardCVV: '123',
      //    trips: [],
      //  };

      // Save customer
      //  await customerStorageService.saveCustomer(newCustomer);

      // Obter o cliente atual
      const customer = await customerStorageService.getCustomer();
      if (!customer) {
        alert('Nenhum cliente logado. Faça login antes de solicitar uma viagem.');
        return;
      }

      let tripId = uuidv4();

      // Adicionar viagem
      console.log('Iniciando addTrip');
      await customerStorageService.addTrip({
        id: tripId,
        customerId: customer.id, // Usar o id do cliente resolvido
        driver: { id: uuidv4(), name: 'Jane Driver' },
        status: Status.COMPLETED,
        origin: origin,
        payment: { amount: price, currency: 'BRL' },
        destination: destination,
      });
      console.log('addTrip concluído');

      // Navegar para loadingScreen
      console.log('Navegando para /loadingScreen');
      router.replace({
        pathname: '/loadingScreen',
        params: { tripId },
      });
    } catch (error) {
      console.error('Erro ao solicitar viagem:', error);
      alert('Erro ao solicitar a viagem. Tente novamente.');
    }
  };

  const requestedTrip = () => {
    return (
      <View style={styles.bottomContainer}>
        <View style={styles.driverCard}>
          <Image
            source={require('../assets/images/carIcon.png')}
            style={styles.carImage}
            resizeMode="contain"
          />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>John Doe</Text>
            <Text style={styles.pricePerKm}>Preço: R$5/Km</Text>
            <View style={styles.rating}>
              {[...Array(5)].map((_, index) => (
                <Ionicons key={index} name="star" size={16} color="#FFD700" />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.tripDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailValue}>{`${time} min`}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailValue}>{`R$${price}`}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailValue}>{`${distance} km`}</Text>
          </View>
        </View>

        <Button onPress={handleTripRequest} title="Solicitar" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/images/home-background.png')} style={styles.map}>
        <View style={styles.darkOverlay} />
        <View style={styles.header}>
          <Link href="/home">
            <Ionicons name="arrow-back" size={24} color="black" />
          </Link>
        </View>

        {!requested ? (
          <View style={styles.locationCard}>
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={24} color="#000" style={styles.locationIcon} />
              <Text style={styles.locationText}>De</Text>
              <TextInput
                placeholder="Origem"
                style={styles.input}
                value={origin}
                onChangeText={(value) => setOrigin(value)}
              />
              <TouchableOpacity>
                <Ionicons name="add" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={24} color="#000" style={styles.locationIcon} />
              <Text style={styles.locationText}>Para</Text>
              <TextInput
                placeholder="Destino"
                style={styles.input}
                value={destination}
                onChangeText={(value) => setDestination(value)}
              />
              <TouchableOpacity>
                <Ionicons name="add" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <Button title="Confirmar" onPress={handleGenerateTrip} style={{ marginTop: 15 }} />
          </View>
        ) : (
          <Animated.Image
            source={require('../assets/images/mapRadar.png')}
            style={{ width: 280, height: 280, marginLeft: 33, opacity: fadeAnim }}
            resizeMode="contain"
          />
        )}
      </ImageBackground>

      {requested && requestedTrip()}
    </View>
  );
}

const styles = StyleSheet.create({
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
  },
  input: {
    width: 200,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 20,
    padding: 15,
    marginTop: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  locationIcon: {
    marginRight: 10,
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 50,
  },
  locationValue: {
    fontSize: 16,
    fontWeight: '400',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 20,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  carImage: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pricePerKm: {
    fontSize: 14,
    color: '#666',
  },
  rating: {
    flexDirection: 'row',
    marginTop: 5,
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});