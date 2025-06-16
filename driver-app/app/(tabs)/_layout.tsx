import { Tabs } from "expo-router";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function RootLayout() {
  return (
  	<Tabs screenOptions={{ headerShown: false,  tabBarActiveTintColor: 'black' }}>
  		<Tabs.Screen 
  			name="trip"
        options={{
          title: 'Corridas',
          tabBarIcon: ({ color }) => <MaterialIcons name="route" size={24} color={color} />,
        }} />
  		<Tabs.Screen 
  			name="(profileStack)"
  			options={{
  				title: 'Perfil',
          tabBarIcon: ({ color }) => <FontAwesome name="user-circle-o" size={24} color={color} />
	  		}} />
  	</Tabs>);
}
