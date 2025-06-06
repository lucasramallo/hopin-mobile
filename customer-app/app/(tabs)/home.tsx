import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type dataItem = {
  id: string;
  title: string;
  driver: string;
  price: string;
};

const DATA = [
  { id: '1', title: 'Earthcare scapes church god', driver: 'John Doe', price: 'R$ 30' },
  { id: '2', title: 'Earthcare scapes church god', driver: 'John Doe', price: 'R$ 30' },
];

export default function Home() {
  const router = useRouter();

  const renderItem = ({ item }: { item: dataItem }) => (
    <View style={styles.card}>
      <Image
        source={require('../../assets/images/carIcon.png')}
        style={{ width: 50, height: 50, marginRight: 10 }}
        resizeMode="contain"
      />
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>
          {item.driver} - {item.price}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/home-background.png')}
        style={styles.map}
      >
        <View style={styles.darkOverlay} />
        <View style={styles.header}>
          <Text style={styles.headerText}>HOPIN</Text>
          <TouchableOpacity>
            <Ionicons name="location-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* bottomContainer agora é um modal fixo */}
      <View style={styles.bottomContainer}>
        <View style={styles.buttonRow}>
          <Text style={styles.titleText}>Onde quer ir?</Text>
          <TouchableOpacity
            style={[styles.button, styles.newTripButton]}
            onPress={() => router.replace('/newTrip')}
          >
            <Text style={[styles.buttonText, styles.newTripText]}>Nova Viagem</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
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