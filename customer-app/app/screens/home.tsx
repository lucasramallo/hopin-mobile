import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DATA = [
  { id: '1', title: 'Earthcare scapes church god', driver: 'John Doe', price: 'R$ 30' },
  { id: '2', title: 'Earthcare scapes church god', driver: 'John Doe', price: 'R$ 30' },
];



export default function Home() {

  
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={require('../../assets/images/carIcon.png')}
        style={{ width: 50, height: 50, marginRight: 10}}
        resizeMode="contain"
      />
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.driver} - {item.price}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/home-background.png')}
        style={styles.map}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>HOPIN</Text>
          <TouchableOpacity>
            <Ionicons name="location-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View style={styles.bottomContainer}>
        <View style={styles.buttonRow}>
          <Text style={styles.titleText}>Onde quer ir?</Text>
          <TouchableOpacity style={[styles.button, styles.newTripButton]}>
            <Text style={[styles.newTripText]}>Nova Viagem</Text>
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 30,
    borderRadius: 30,
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
    width: 120,
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
    fontWeight: 600,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});