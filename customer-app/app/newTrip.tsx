import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View
} from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import Button from './components/button';
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

  const streetOptions = [
    'Rua das Flores, 123 - Centro',
    'Avenida Central, 500 - Jardim América',
    'Rua dos Andradas, 215 - São José',
    'Rua São João, 87 - Bela Vista',
    'Travessa da Paz, 12 - Vila Nova',
    'Rua Dom Pedro, 310 - Centro',
    'Avenida Brasil, 980 - Morumbi',
    'Rua XV de Novembro, 143 - Centro',
    'Rua Getúlio Vargas, 250 - Alto Alegre',
    'Rua Marechal Deodoro, 98 - Vila Rica',
    'Rua das Palmeiras, 77 - São Bento',
    'Rua Amazonas, 331 - Santa Luzia',
    'Rua Ceará, 44 - Nova Esperança',
    'Rua Rio Branco, 68 - Liberdade',
    'Rua Padre Cícero, 55 - Centro',
    'Rua Santa Maria, 302 - Jardim Botânico',
    'Rua Tiradentes, 101 - São Francisco',
    'Rua Alagoas, 90 - Bela Vista',
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
      <ImageBackground source={require('../assets/images/home-background.png')} style={styles.map}>
        <View style={styles.darkOverlay} />
        <View style={styles.header}>
          <Link href="/home"><Ionicons name="arrow-back" size={24} color="black" /></Link>
        </View>

        {!requested ? (
          <View style={styles.locationCard}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Origem</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={origin} onValueChange={(itemValue) => setOrigin(itemValue)}>
                <Picker.Item label="Selecione uma rua..." value="" />
                {streetOptions.map((street, index) => (
                  <Picker.Item key={index} label={street} value={street} />
                ))}
              </Picker>
            </View>

            <Text style={{ fontWeight: 'bold', marginTop: 15, marginBottom: 10 }}>Destino</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={destination} onValueChange={(itemValue) => setDestination(itemValue)}>
                <Picker.Item label="Selecione uma rua..." value="" />
                {streetOptions.map((street, index) => (
                  <Picker.Item key={index} label={street} value={street} />
                ))}
              </Picker>
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
    marginTop: 20,
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
