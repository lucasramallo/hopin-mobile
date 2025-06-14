import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

export type Region = {
  name: string;
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type Props = {
  origin?: Region;
  destination?: Region;
};

const mapStyle = [
  {
    stylers: [
      { saturation: -100 },
      { lightness: 0 },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      { lightness: 10 },
      { visibility: 'simplified' },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [
      { visibility: 'on' },
      { lightness: 20 },
    ],
  },
  {
    featureType: 'water',
    stylers: [
      { lightness: -10 },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      { lightness: 0 },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [
      { visibility: 'simplified' },
      { lightness: 20 },
    ],
  },
  {
    featureType: 'landscape',
    stylers: [
      { lightness: 0 },
    ],
  },
];

const MapScreen: React.FC<Props> = ({
  origin = {
    name: 'Campina Grande, Centro',
    latitude: -7.23056,
    longitude: -35.88111,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  destination,
}) => {
  const [mapRegion, setMapRegion] = useState<Region>(origin);
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
  const mapRef = useRef<MapView>(null);

  const fetchRoute = async (origin: Region, destination: Region) => {
    const apiKey = '5b3ce3597851110001cf6248257071b1644442ccad2a6d3c5be79ff2';
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';
    const body = {
      coordinates: [
        [origin.longitude, origin.latitude],
        [destination.longitude, destination.latitude],
      ],
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar a rota');
      }

      const data = await response.json();
      const coordinates = data.features[0].geometry.coordinates;
      const formattedCoordinates = coordinates.map(([lng, lat]: [number, number]) => ({
        latitude: lat,
        longitude: lng,
      }));
      setRouteCoordinates(formattedCoordinates);
    } catch (error) {
      console.error('Erro ao buscar rota:', error);
      setRouteCoordinates([
        { latitude: origin.latitude, longitude: origin.longitude },
        { latitude: destination.latitude, longitude: destination.longitude },
      ]);
    }
  };

  useEffect(() => {
    if (
      mapRegion.latitude !== origin.latitude ||
      mapRegion.longitude !== origin.longitude ||
      mapRegion.latitudeDelta !== origin.latitudeDelta ||
      mapRegion.longitudeDelta !== origin.longitudeDelta ||
      mapRegion.name !== origin.name
    ) {
      setMapRegion(origin);
    }

    if (mapRef.current) {
      if (destination) {
        const minLat = Math.min(origin.latitude, destination.latitude);
        const maxLat = Math.max(origin.latitude, destination.latitude);
        const minLng = Math.min(origin.longitude, destination.longitude);
        const maxLng = Math.max(origin.longitude, destination.longitude);

        const latitude = (minLat + maxLat) / 2;
        const longitude = (minLng + maxLng) / 2;
        const latitudeDelta = (maxLat - minLat) * 1.5 || origin.latitudeDelta;
        const longitudeDelta = (maxLng - minLng) * 1.5 || origin.longitudeDelta;

        const newRegion = {
          latitude,
          longitude,
          latitudeDelta,
          longitudeDelta,
        };

        mapRef.current.animateToRegion(newRegion, 1000);
        // Buscar rota do OpenRouteService
        fetchRoute(origin, destination);
      } else {
        // Anima apenas para a origem
        mapRef.current.animateToRegion(
          {
            latitude: origin.latitude,
            longitude: origin.longitude,
            latitudeDelta: origin.latitudeDelta,
            longitudeDelta: origin.longitudeDelta,
          },
          1000
        );
        setRouteCoordinates([]);
      }
    }

    console.log("dest" + destination?.name);
  }, [origin, destination]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={{
          latitude: mapRegion.latitude,
          longitude: mapRegion.longitude,
          latitudeDelta: mapRegion.latitudeDelta,
          longitudeDelta: mapRegion.longitudeDelta,
        }}
        showsUserLocation={true}
        followsUserLocation={true}
        customMapStyle={mapStyle}
      >
        {origin && (
          <Marker
            coordinate={{
              latitude: origin.latitude,
              longitude: origin.longitude,
            }}
            title={origin.name}
            pinColor="black"
          >
            <Ionicons name="person" size={25} color="black" />
          </Marker>
        )}
        {destination && (
          <Marker
            coordinate={{
              latitude: destination.latitude,
              longitude: destination.longitude,
            }}
            title={destination.name}
            pinColor="black"
          >
            <Image
              source={require('../../assets/images/carIcon.png')}
              style={{ width: 40, height: 50 }}
              resizeMode="contain"
            />
          </Marker>
        )}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#000000"
            strokeWidth={3}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;