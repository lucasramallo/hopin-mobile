import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState, useMemo } from 'react';
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

  const calculateRegion = (origin: Region, destination?: Region): Region => {
    if (!destination) {
      return {
        ...origin,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }

    const minLat = Math.min(origin.latitude, destination.latitude);
    const maxLat = Math.max(origin.latitude, destination.latitude);
    const minLng = Math.min(origin.longitude, destination.longitude);
    const maxLng = Math.max(origin.longitude, destination.longitude);

    const latitude = (minLat + maxLat) / 2;
    const longitude = (minLng + maxLng) / 2;
    const latitudeDelta = (maxLat - minLat) * 3;
    const longitudeDelta = (maxLng - minLng) * 3;

    return {
      name: 'Route',
      latitude,
      longitude,
      latitudeDelta: Math.max(latitudeDelta, 0.01),
      longitudeDelta: Math.max(longitudeDelta, 0.01),
    };
  };

  const areRegionsEqual = (region1: Region, region2: Region): boolean => {
    return (
      region1.latitude === region2.latitude &&
      region1.longitude === region2.longitude &&
      region1.latitudeDelta === region2.latitudeDelta &&
      region1.longitudeDelta === region2.longitudeDelta
    );
  };

  const memoizedOrigin = useMemo(() => origin, [origin?.latitude, origin?.longitude, origin?.latitudeDelta, origin?.longitudeDelta]);
  const memoizedDestination = useMemo(() => destination, [destination?.latitude, destination?.longitude, destination?.latitudeDelta, destination?.longitudeDelta]);

  useEffect(() => {
    if (memoizedOrigin && memoizedDestination) {
      fetchRoute(memoizedOrigin, memoizedDestination);
    } else {
      setRouteCoordinates([]);
    }
  }, [memoizedOrigin, memoizedDestination]);

  useEffect(() => {
    if (memoizedOrigin) {
      const newRegion = calculateRegion(memoizedOrigin, memoizedDestination);
      if (!areRegionsEqual(newRegion, mapRegion)) {
        setMapRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
      }
    }
  }, [memoizedOrigin, memoizedDestination, mapRegion]);

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
        {memoizedOrigin && (
          <Marker
            coordinate={{
              latitude: memoizedOrigin.latitude,
              longitude: memoizedOrigin.longitude,
            }}
            title={memoizedOrigin.name}
            pinColor="black"
          >
            <Image
              source={require('../../assets/images/carIcon.png')}
              style={{ width: 40, height: 50 }}
              resizeMode="contain"
            />
          </Marker>
        )}
        {memoizedDestination && (
          <Marker
            coordinate={{
              latitude: memoizedDestination.latitude,
              longitude: memoizedDestination.longitude,
            }}
            title={memoizedDestination.name}
            pinColor="black"
          >
            <Ionicons name="person" size={25} color="black" />
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