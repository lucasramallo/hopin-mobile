import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack initialRouteName="loadingScreen">
      <Stack.Screen name="loadingScreen" options={{ headerShown: false }} />
      <Stack.Screen name="loginScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="paymantMethodScreen" options={{ headerShown: false }} />
      <Stack.Screen name="registerScreen" options={{ headerShown: false }} />
      <Stack.Screen name="newTrip" options={{ headerShown: false }} />
      <Stack.Screen name="loadingTripScreen" options={{ headerShown: false }} />
      <Stack.Screen name="reviewScreen" options={{ headerShown: false }} />
      <Stack.Screen name="success" options={{ headerShown: false }} />
    </Stack>
  );
}