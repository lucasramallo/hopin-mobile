import NetInfo from '@react-native-community/netinfo';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import api from '../api'; // Assuming axios is configured here
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

export default function TripsScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchTripsAndRatings = async () => {
        try {
          const netInfo = await NetInfo.fetch();
          const isConnected = netInfo.isConnected;
          let fetchedTrips: Trip[] = [];

          if (isConnected) {
            // Fetch trips from API
            const response = await api.get<Page<TripResponseDTO>>('/customer/getTripsHistory', {
              params: { page: 0, size: 100 },
            });
            const apiTrips = response.data.content;
            fetchedTrips = await Promise.all(
              apiTrips.map(async (tripDTO) => {
                let rating: number | undefined;
                try {
                  const ratingResponse = await api.get<Rating>(`/rating/${tripDTO.id}`);
                  rating = ratingResponse.data.rating;
                  console.log(`Rating obtido para a viagem ${tripDTO.id}: ${rating}`);
                } catch (error: any) {
                  if (error.response?.status === 404) {
                    console.log(`Nenhum rating encontrado para a viagem ${tripDTO.id}`);
                  } else {
                    console.error(`Falha ao buscar rating para a viagem ${tripDTO.id}:`, error);
                  }
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
                  rating, // Include fetched rating
                };
              })
            );
            await customerStorageService.saveTrips(fetchedTrips);
          } else {
            fetchedTrips = await customerStorageService.getTrips();
          }

          setTrips(fetchedTrips.reverse());
        } catch (error) {
          console.error('Falha ao buscar viagens ou ratings:', error);
          const localTrips = await customerStorageService.getTrips();
          setTrips(localTrips.reverse());
        }
      };

      fetchTripsAndRatings();
    }, [])
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Intl.DateTimeFormat('pt-BR', options).format(date);
  };

  const renderItem = ({ item }: { item: Trip }) => {
    const isCanceled = item.status === Status.CANCELED;
    return (
      <View style={[styles.card, isCanceled && { opacity: 0.5 }]}>
        <Image
          source={require('../../assets/images/carIcon2.png')}
          style={{ width: 70, height: 70, marginRight: 10 }}
          resizeMode="contain"
        />
        <View style={styles.cardText}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            {item.rating ? (
              <StarRating
                rating={item.rating || 0}
                onChange={() => { }}
                starSize={18}
                color="#FFE578"
                emptyColor="#f9f9f9"
                starStyle={{ marginHorizontal: 1 }}
              />
            ) : (
              <Text style={{ color: '#777777', fontSize: 14 }}>Sem avaliação</Text>
            )}
            {isCanceled ? (
              <Text style={{ color: 'red', marginTop: 5, fontWeight: 'bold' }}>CANCELADA</Text>
            ) : (
              <Text style={{ color: 'green', marginTop: 5, fontWeight: 'bold' }}>{item.status}</Text>
            )}
          </View>
          <Text style={styles.cardTitle}>Para: {item.destination}</Text>
          <Text style={styles.cardSubtitle}>{formatDate(item.createdAt)}</Text>
          <Text style={styles.cardContent}>
            {item.driver.name} - R${item.payment.amount} {item.payment.currency}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Minhas Viagens</Text>
      </View>
      <FlatList
        data={trips}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={trips.length === 0 && styles.emptyList}
        ListEmptyComponent={<Text style={styles.cardSubtitle}>Nenhuma viagem encontrada</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
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
    fontSize: 15,
    fontWeight: '500',
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  cardContent: {
    fontSize: 14,
    color: '#666',
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});