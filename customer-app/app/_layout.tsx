import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="newTrip" options={{ headerShown: false }} />
      <Stack.Screen name="loadingScreen" options={{ headerShown: false }} />
      <Stack.Screen name="reviewScreen" options={{ headerShown: false }} />
      <Stack.Screen name="success" options={{ headerShown: false }} />
    </Stack>
  );
}