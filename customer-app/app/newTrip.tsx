import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from './components/button';

export default function TripRequestScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/images/home-background.png')} style={styles.map}>
        <View style={styles.darkOverlay} />
        <View style={styles.header}>
          <Link href="/home">
            <Ionicons name="arrow-back" size={24} color="black" />
          </Link>
        </View>

        <View style={styles.locationCard}>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={24} color="#000" style={styles.locationIcon} />
            <Text style={styles.locationText}>De</Text>
            <TextInput placeholder='Origem' style={styles.input}/>
            <TouchableOpacity>
              <Ionicons name="add" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={24} color="#000" style={styles.locationIcon} />
            <Text style={styles.locationText}>Para</Text>
            <TextInput placeholder='Destino' style={styles.input}/>
            <TouchableOpacity>
              <Ionicons name="add" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

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
            <Text style={styles.detailValue}>4 min</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailValue}>R$30</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailValue}>6 Km</Text>
          </View>
        </View>

        <Button href='/loadingScreen' title='Solicitar'/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
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
    width: 200
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
    fontWeight: 400,
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