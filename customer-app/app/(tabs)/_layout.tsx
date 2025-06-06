import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';


export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false}}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color="black" />
        }}
      />
      <Tabs.Screen
        name="tripsScreen"
        options={{
          title: 'Corridas',
          tabBarIcon: ({ color }) => <MaterialIcons name="route" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="profileScreen"
        options={{
        title: 'Perfil',
        tabBarIcon: ({ color }) => <Feather name="user" size={24} color="black" />
      }}
      />
    </Tabs>
  );
}