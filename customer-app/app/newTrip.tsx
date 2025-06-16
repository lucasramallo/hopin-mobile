import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import Button from './components/button';
import MapScreen, { Region } from './components/map';
import { customerStorageService, Status } from './service/CustomerStorageService';
import useStore from './store/index';

export default function TripRequestScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [requested, setRequested] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [time, setTime] = useState(0);
  const [price, setPrice] = useState(0);
  const [distance, setDistance] = useState(0);
  const [driverName, setDriverName] = useState(getRandomDriverName());

  const setCurrentTrip = useStore((state) => state.setCurrentTrip);

  const streetOptions: Region[] = [
    {
      "name": "Rua José de Almeida, 300 - Catolé, Campina Grande",
      "latitude": -7.2410,
      "longitude": -35.8700,
      "latitudeDelta": 0.0922,
      "longitudeDelta": 0.0421
    },
    {
      "name": "Rua Manoel Firmino da Silva, 150 - Malvinas, Campina Grande",
      "latitude": -7.2550,
      "longitude": -35.8950,
      "latitudeDelta": 0.0922,
      "longitudeDelta": 0.0421
    },
    {
      "name": "Rua Antônio Luiz de França, 200 - Bodocongó, Campina Grande",
      "latitude": -7.2300,
      "longitude": -35.8500,
      "latitudeDelta": 0.0922,
      "longitudeDelta": 0.0421
    },
    {
      "name": "Rua Severino José da Silva, 100 - Universitário, Campina Grande",
      "latitude": -7.2150,
      "longitude": -35.9100,
      "latitudeDelta": 0.0922,
      "longitudeDelta": 0.0421
    },
    {
      "name": "Rua José Guedes Cavalcanti, 250 - Mirante, Campina Grande",
      "latitude": -7.2050,
      "longitude": -35.8900,
      "latitudeDelta": 0.0922,
      "longitudeDelta": 0.0421
    },
    {
      "name": "Rua Aprígio Nepomuceno, 200 - Palmeira, Campina Grande",
      "latitude": -7.2200,
      "longitude": -35.8650,
      "latitudeDelta": 0.0922,
      "longitudeDelta": 0.0421
    },
    {
      "name": "Rua José Paulino, 150 - Dinamérica, Campina Grande",
      "latitude": -7.2450,
      "longitude": -35.8850,
      "latitudeDelta": 0.0922,
      "longitudeDelta": 0.0421
    },
    {
      "name": "Rua Maria José da Silva, 200 - Sandra Cavalcante, Campina Grande",
      "latitude": -7.2100,
      "longitude": -35.8700,
      "latitudeDelta": 0.0922,
      "longitudeDelta": 0.0421
    },
    {
      "name": "Rua Carlos Agra de Melo, 180 - Alto Branco, Campina Grande",
      "latitude": -7.2000,
      "longitude": -35.8800,
      "latitudeDelta": 0.0922,
      "longitudeDelta": 0.0421
    },
    {
      "name": "Rua João Batista de Almeida, 250 - Lauritzen, Campina Grande",
      "latitude": -7.2500,
      "longitude": -35.8800,
      "latitudeDelta": 0.0922,
      "longitudeDelta": 0.0421
    },
    // New locations below
    {
      "name": "Rua José Domingos da Silva, 200 - Malvinas, Campina Grande",
      "latitude": -7.2600,
      "longitude": -35.9000,
      "latitudeDelta": 0.0922,
      "longitudeDelta": 0.0421
    },
    {
      "name": "Rua Maria das Neves Ferreira, 150 - Cidades, Campina Grande",
      "latitude": -7.2400,
      "longitude": -35.9050,
      "latitudeDelta": 0.0922,
      "longitudeDelta": 0.0421
    },
    {
      "name": "Rua Antônio Bezerra Cabral, 300 - Cruzeiro, Campina Grande",
      "latitude": -7.2550,
      "longitude": -35.8750,
      "latitudeDelta": 0.0922,
      "longitudeDelta": 0.0421
    }
  ];

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
    const simulatedTime = Math.floor(Math.random() * 10) + 1;
    const simulatedPrice = Math.floor(Math.random() * 50) + 10;
    const simulatedDistance = Math.floor(Math.random() * 20) + 1;

    setTime(simulatedTime);
    setPrice(simulatedPrice);
    setDistance(simulatedDistance);
    setRequested(true);
  };

  function getRandomDriverName(): string {
    const firstNames = ['Carlos', 'Ana', 'João', 'Mariana', 'Pedro', 'Luana'];
    const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Lima'];
    const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${randomFirst} ${randomLast}`;
  }

  const handleTripRequest = async () => {
    try {
      if (!origin || !destination) {
        alert('Por favor, selecione origem e destino.');
        return;
      }

      const customer = await customerStorageService.getCustomer();
      if (!customer) {
        alert('Nenhum cliente logado. Faça login antes de solicitar uma viagem.');
        return;
      }

      const tripId = uuidv4();

      await setCurrentTrip({
        id: tripId,
        customerId: customer.id,
        driver: { id: uuidv4(), name: driverName },
        status: Status.COMPLETED,
        origin,
        payment: { amount: price, currency: 'BRL' },
        destination,
        createdAt: new Date().toISOString(),
      });

      router.replace({
        pathname: '/loadingTripScreen',
        params: { tripId },
      });
    } catch (error) {
      console.error('Erro ao solicitar viagem:', error);
      alert('Erro ao solicitar a viagem. Tente novamente.');
    }
  };

  const requestedTrip = () => (
    <View style={styles.bottomContainer}>
      <View style={styles.driverCard}>
        <Image source={require('../assets/images/carIcon.png')} style={styles.carImage} resizeMode="contain" />
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{driverName}</Text>
          <Text style={styles.pricePerKm}>Preço: R$5/Km</Text>
          <View style={styles.rating}>
            {[...Array(5)].map((_, index) => (
              <Ionicons key={index} name="star" size={16} color="#FFD700" />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.tripDetails}>
        <View style={styles.detailItem}><Text style={styles.detailValue}>{`${time} min`}</Text></View>
        <View style={styles.detailItem}><Text style={styles.detailValue}>{`R$${price}`}</Text></View>
        <View style={styles.detailItem}><Text style={styles.detailValue}>{`${distance} km`}</Text></View>
      </View>

      <Button onPress={handleTripRequest} title="Solicitar" />
    </View>
  );

  return (
    <View style={styles.container}>
      <MapScreen origin={streetOptions.find(street => street.name === origin) || streetOptions[0]} destination={streetOptions.find(street => street.name === destination)} />
      <View style={styles.header}>
        <Link href="/home"><Ionicons name="arrow-back" size={24} color="black" /></Link>
      </View>
      <View style={styles.locationCard}>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={origin} onValueChange={(itemValue) => setOrigin(itemValue)}>
            <Picker.Item label="Selecione uma rua..." value="" />
            {streetOptions.map((street, index) => (
              <Picker.Item key={index} label={street.name} value={street.name} />
            ))}
          </Picker>
        </View>

        <Text style={{ fontWeight: 'bold', marginTop: 15, marginBottom: 10 }}>Destino</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={destination} onValueChange={(itemValue) => setDestination(itemValue)}>
            <Picker.Item label="Selecione uma rua..." value="" />
            {streetOptions.map((street, index) => (
              <Picker.Item key={index} label={street.name} value={street.name} />
            ))}
          </Picker>
        </View>

        <Button title="Confirmar" onPress={handleGenerateTrip} style={{ marginTop: 15 }} />
      </View>

      {requested && requestedTrip()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  pickerContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 4,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 20,
    padding: 15,
    marginBottom: 100,
  },
  bottomContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 100
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