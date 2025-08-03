import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import api from './api';
import Button from './components/button';
import { customerStorageService } from './service/CustomerStorageService';
import useStore from './store/index';

export default function ReviewScreen() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const currentTrip = useStore((state) => state.trip);
  const resetCurrentTrip = useStore((state) => state.resetCurrentTrip);

  const handleSubmit = async () => {
    if (!currentTrip) return;

    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isConnected;

    const updatedTrip = {
      ...currentTrip,
      rating: rating,
    };

    try {
      if (isConnected) {
        const ratingRequest = {
          tripId: currentTrip.id,
          rating: rating,
          feedback: '',
        };
        await api.post('/rating', ratingRequest);
        await customerStorageService.updateTrip(updatedTrip);
      } else {
        await customerStorageService.addPendingRating({
          tripId: currentTrip.id,
          rating: rating,
          feedback: '',
          needsSync: true,
        });
        await customerStorageService.updateTrip(updatedTrip);
      }
      resetCurrentTrip();
      router.replace('/home');
    } catch (error) {
      console.error('Error submitting rating:', error);
      await customerStorageService.addPendingRating({
        tripId: currentTrip.id,
        rating: rating,
        feedback: '',
        needsSync: true,
      });
      await customerStorageService.updateTrip(updatedTrip);
      resetCurrentTrip();
      router.replace('/home');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/home')}>
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.emojiContainer}>
          <TouchableOpacity>
            <Ionicons name="sad-outline" size={40} color="#FFD700" style={styles.emoji} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="sad" size={40} color="#FFD700" style={styles.emoji} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="happy-outline" size={40} color="#FFD700" style={[styles.emoji, styles.selectedEmoji]} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="happy" size={40} color="#FFD700" style={styles.emoji} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Avalie a corrida</Text>
        <Text style={styles.subtitle}>Esperamos que tenha sido satisfatória</Text>
        <View style={styles.starInputContainer}>
          <StarRating rating={rating} onChange={setRating} starSize={50} color="#121212" />
        </View>
        <Button onPress={handleSubmit} title="Avaliar" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 30,
  },
  emoji: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  selectedEmoji: {
    backgroundColor: 'rgba(255, 215, 0, 0.4)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  starInputContainer: {
    marginBottom: 30,
  },
});