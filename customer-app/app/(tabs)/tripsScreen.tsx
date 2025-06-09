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
import { customerStorageService, Status, Trip } from '../service/CustomerStorageService';

export default function TripsScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchTrips = async () => {
        try {
          const fetchedTrips = await customerStorageService.getTrips();
          setTrips(fetchedTrips.reverse());
        } catch (error) {
          console.error('Failed to fetch trips:', error);
          setTrips([]);
        }
      };

      fetchTrips();
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
            {
              item.rating ?
                <StarRating
                  rating={item.rating || 0}
                  onChange={() => { }}
                  starSize={18}
                  color="#FFE578"
                  emptyColor="#f9f9f9"
                  starStyle={{ marginHorizontal: 1 }}
                />
                : <Text style={{ color: '#777777', fontSize: 14 }}>Sem avaliação</Text>
            }

            {isCanceled ? (
              <Text style={{ color: 'red', marginTop: 5, fontWeight: 'bold' }}>
                CANCELADA
              </Text>
            ) : (
              <Text style={{ color: 'green', marginTop: 5, fontWeight: 'bold' }}>
                {item.status}
              </Text>
            )}
          </View>

          <Text style={styles.cardTitle}>
            Para: {item.destination}
          </Text>
          <Text style={styles.cardSubtitle}>
            {formatDate(item.createdAt)}
          </Text>
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
    fontWeight: 500,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: 400,
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
