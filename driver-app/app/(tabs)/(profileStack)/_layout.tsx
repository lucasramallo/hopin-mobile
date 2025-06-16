import { Stack } from "expo-router";

export default function RootLayout() {
  return (
  	<Stack screenOptions={{ headerShown: false }}>
  		<Stack.Screen name="profile" />
  		<Stack.Screen 
  			name="editProfile"
  			options={{
          tabBarStyle: { display: 'none' },
        }} />
  	</Stack>);
}
