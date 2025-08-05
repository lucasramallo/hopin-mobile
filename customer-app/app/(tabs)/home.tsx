import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../api'; // Assuming axios is configured here
import MapScreen from '../components/map';
import { customerStorageService, Status, Trip } from '../service/CustomerStorageService';

interface TripResponseDTO {
  id: string;
  customer: {
    createdAt: string;
    id: string;
    name: string;
    email: string;
    creditCardNumber?: string;
    creditCardExpiry?: string;
    creditCardCVV?: string;
  };
  driver: {
    createdAt: string;
    id: string;
    name: string;
    email: string;
    dateOfBirth: string;
  };
  payment: {
    id: string;
    method: string;
    amount: number;
    createdAt: string;
  };
  status: Status;
  origin: string;
  destination: string;
  createdAt: string;
}

interface Rating {
  rating: number;
  feedback: string;
}

interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export default function Home() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchTripsAndSyncRatings = async () => {
        try {
          const netInfo = await NetInfo.fetch();
          const isConnected = netInfo.isConnected;
          let fetchedTrips: Trip[] = [];

          if (isConnected) {
            const pendingRatings = await customerStorageService.getPendingRatings();
            for (const rating of pendingRatings) {
              if (rating.needsSync) {
                try {
                  await api.post('/rating', {
                    tripId: rating.tripId,
                    rating: rating.rating,
                    feedback: rating.feedback,
                  });
                } catch (error) {
                  console.error(`Failed to sync rating for trip ${rating.tripId}:`, error);
                  continue;
                }
              }
            }
            await customerStorageService.clearPendingRatings();

            const response = await api.get<Page<TripResponseDTO>>('/customer/getTripsHistory', {
              params: { page: 0, size: 100 },
            });
            const apiTrips = response.data.content;
            fetchedTrips = await Promise.all(
              apiTrips.map(async (tripDTO) => {
                let rating: number | undefined;
                try {
                  if (tripDTO.status !== Status.CANCELLED) {
                    const ratingResponse = await api.get<Rating>(`/rating/${tripDTO.id}`);
                    rating = ratingResponse.data.rating || undefined;
                  }
                } catch (error) {
                  console.error(`Failed to fetch rating for trip ${tripDTO.id}:`, error);
                }
                return {
                  id: tripDTO.id,
                  customerId: tripDTO.customer.id,
                  driver: {
                    id: tripDTO.driver.id,
                    name: tripDTO.driver.name,
                    email: tripDTO.driver.email,
                    dateOfBirth: tripDTO.driver.dateOfBirth,
                    password: '',
                    createdAt: tripDTO.driver.createdAt || new Date().toISOString(),
                    role: 'DRIVER',
                    trips: [],
                    cab: null,
                  },
                  payment: {
                    id: tripDTO.payment.id,
                    method: tripDTO.payment.method,
                    amount: tripDTO.payment.amount,
                    createdAt: tripDTO.payment.createdAt,
                    currency: 'BRL',
                  },
                  status: tripDTO.status,
                  origin: tripDTO.origin,
                  destination: tripDTO.destination,
                  createdAt: tripDTO.createdAt,
                  rating,
                };
              })
            );
            await customerStorageService.saveTrips(fetchedTrips);
          } else {
            fetchedTrips = await customerStorageService.getTrips();
          }

          const recentTrips = fetchedTrips.reverse().slice(0, 3);
          setTrips(recentTrips);
        } catch (error) {
          console.error('Failed to fetch trips or sync ratings:', error);
          const localTrips = await customerStorageService.getTrips();
          const recentTrips = localTrips.reverse().slice(0, 3);
          setTrips(recentTrips);
        }
      };

      fetchTripsAndSyncRatings();
    }, [])
  );

  function truncateString(text: string): string {
    const maxLength = 30;
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
  }

  const renderItem = ({ item }: { item: Trip }) => {
    const isCanceled = item.status === Status.CANCELLED;
    return (
      <View style={[styles.card, isCanceled && { opacity: 0.5 }]}>
        <Image source={require('../../assets/images/carIcon.png')} style={{ width: 50, height: 50, marginRight: 10 }} resizeMode="contain" />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>
            {truncateString(item.origin)} {truncateString(item.destination)}
          </Text>
          <Text style={styles.cardSubtitle}>
            {item.driver.name} - {item.payment.amount} {item.payment.currency}
          </Text>
          {isCanceled ? (
            <Text style={{ color: 'red', marginTop: 5, fontWeight: 'bold' }}>CANCELADA</Text>
          ) : (
            <Text style={{ color: 'green', marginTop: 5, fontWeight: 'bold' }}>{item.status}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <MapScreen />
      <View style={styles.darkOverlay} />
      <View style={styles.header}>
        <Text style={styles.headerText}>HOPIN</Text>
        <TouchableOpacity>
          <Ionicons name="location-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.buttonRow}>
          <Text style={styles.titleText}>Onde quer ir?</Text>
          <TouchableOpacity style={[styles.button, styles.newTripButton]} onPress={() => router.replace('/newTrip')}>
            <Text style={[styles.buttonText, styles.newTripText]}>Nova Viagem</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={trips}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          ListEmptyComponent={<Text style={styles.cardSubtitle}>No trips found</Text>}
        />
      </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  map: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 70,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
  },
  button: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    width: 140,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newTripButton: {
    backgroundColor: '#000',
  },
  buttonText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
  newTripText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    flex: 1,
  },
});