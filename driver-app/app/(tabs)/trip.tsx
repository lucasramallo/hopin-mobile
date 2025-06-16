import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Modal,
} from 'react-native';
import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import Mapa from '../../assets/images/Mapa.png';
import { driverStorageService, Customer, Driver, Status, Trip } from '../service/service';
import DefaultAvatar from "../../assets/images/avatar_placeholder.png";
import useStore from '../store/store';
import Map from '../components/map';

export default function TripScreen() {
  const [tab, setTab] = useState<'atuais' | 'anteriores'>('atuais');
  const [tripRequests, setTripRequests] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<Trip | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [finishedTrip, setFinishedTrip] = useState<any>(null);
  const [tripsHistory, setTripsHistory] = useState<Trip[]>([]);
  const user = useStore((state) => state.user);

	useEffect(() => {
		const fetchTrips = async () => {
      const trips = await driverStorageService.getTrips();
      setTripsHistory(trips);
    };
    fetchTrips();
	}, [tab]);
	
	const generateData = async () => {
		const randomNumber = Math.ceil(Math.random() * 3);
		const generatedRequests = [];
		for(let i = 1; i <= randomNumber; i++){
			const newTripRequest = await driverStorageService.generateTrip();
			generatedRequests.push(newTripRequest);
		}
	  setTripRequests(generatedRequests);
	}

	useEffect(() => {
		if(user){
			generateData();
		}
	}, []);

  const acceptTrip = (currentTrip: Trip) => {
    setLoading(currentTrip);
    const accept = async () => {
    	const trip = {
        ...currentTrip,
        status: Status.COMPLETED,
        rating: Math.ceil(Math.random() * 5),
      };
      setFinishedTrip(trip);
      await driverStorageService.addTripToHistory(trip);
      setModalVisible(true);
      generateData();
      setLoading(null);
    };
    
    setTimeout(() => accept(), 5000);
  };

  const cancelTrip = (currentTrip: Trip) => {
    driverStorageService.addTripToHistory(
      { ...currentTrip, status: Status.CANCELED },
    );
    setCancelModalVisible(true);
    generateData();
  };

  const closeModal = () => {
    setModalVisible(false);
    setFinishedTrip(null);
  };

  const closeCancelModal = () => {
    setCancelModalVisible(false);
  };

  return (
    <View style={styles.container}>
    	<Link href="profile" style={{ alignSelf: 'flex-end' }}>
	    	<Image source={user?.avatar ? { uri: user.avatar } : DefaultAvatar} style={styles.profileImage} />
	    </Link>
      <Text style={styles.title}>Minhas Corridas</Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'atuais' && styles.activeTab]}
          onPress={() => setTab('atuais')}
        >
          <Text style={[styles.tabText, tab === 'atuais' && styles.activeTabText]}>
            Corridas Atuais
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'anteriores' && styles.activeTab]}
          onPress={() => setTab('anteriores')}
        >
          <Text style={[styles.tabText, tab === 'anteriores' && styles.activeTabText]}>
            Corridas Anteriores
          </Text>
        </TouchableOpacity>
      </View>

      {tab === 'atuais' ? (
        	tripRequests.length ?
        	<FlatList
        		data={tripRequests}
        		keyExtractor={(item) => item.id.toString()}
            renderItem={({ item: currentTrip }) => (
			        <View style={styles.card}>
				          <View style={styles.userInfo}>
				            <Image
				              source={{ uri: currentTrip.customer.avatar }}
				              style={styles.avatar}
				            />
				            <View>
				              <Text style={styles.name}>{currentTrip.customer.name || 3}</Text>
				              <Text style={styles.subtitle}>Passageiro</Text>
				            </View>
				          </View>
				
				          <Text style={styles.label}>De</Text>
				          <Text style={styles.location}>{currentTrip.origin.name}</Text>
				          <Text style={styles.label}>Para</Text>
				          <Text style={styles.location}>{currentTrip.destination.name}</Text>
				
				          {loading === currentTrip ? (
				            <Text style={{ textAlign: 'center', marginVertical: 16, fontSize: 16 }}>
				              Corrida em andamento...
				            </Text>
				          ) : (
				            <View style={styles.buttonRow}>
				              <TouchableOpacity
				                style={styles.cancelButton}
				                onPress={() => cancelTrip(currentTrip)}
				                disabled={loading !== null}
				              >
				                <Text style={styles.cancelText}>Cancelar</Text>
				              </TouchableOpacity>
				              <TouchableOpacity
				                style={styles.acceptButton}
				                onPress={() => acceptTrip(currentTrip)}
				                disabled={loading !== null}
				              >
				                <Text style={styles.acceptText}>Aceitar</Text>
				              </TouchableOpacity>
				            </View>
				          )}
				
				          <View style={styles.map}>
                    <Map origin={currentTrip.origin} destination={currentTrip.destination} />
                  </View>
				        </View>)} /> :
        	<Text style={{ textAlign: 'center', marginTop: 24 }}>Nenhuma solicitação de corrida no momento.</Text>
      ) : (
        <>
          {tripsHistory.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 24 }}>
              Nenhuma corrida anterior encontrada.
            </Text>
          ) : (
            <FlatList
              data={[...tripsHistory].reverse()}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item: trip }) => (
                <View style={styles.card}>
                  <View
                    style={
                      trip.status === Status.COMPLETED
                        ? styles.statusAccepted
                        : styles.statusCanceled
                    }
                  >
                    <Text style={styles.statusText}>
                      {trip.status === Status.COMPLETED ? 'Aceita' : 'Cancelada'}
                    </Text>
                  </View>
                  <Image source={Mapa} style={styles.mapSmall} resizeMode="cover" />
                  <Text style={styles.label}>Com</Text>
                  <Text style={styles.location}>{trip.customer?.name}</Text>
                  <Text style={styles.label}>De</Text>
                  <Text style={styles.location}>{trip.origin.name}</Text>
                  <Text style={styles.label}>Para</Text>
                  <Text style={styles.location}>{trip.destination.name}</Text>

                  {trip.status === Status.COMPLETED && (
                    <>
                      <Text style={styles.label}>Avaliação</Text>
                      <Text style={styles.avaliacao}>
                        {'⭐'.repeat(trip.rating)} ({trip.rating})
                      </Text>
                      <Text style={styles.label}>Valor</Text>
                      <Text style={styles.valor}>
                        R$ {trip.payment.amount.toString().replace('.', ',')}
                      </Text>
                    </>
                  )}
                </View>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
            />
          )}
        </>
      )}

      {/* Modal corrida concluída */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Corrida Concluída!</Text>
            {finishedTrip && (
              <>
                <Text style={styles.modalText}>
                  Obrigado por realizar a corrida com {finishedTrip.customer.name}.
                </Text>
                <Text style={styles.modalText}>De: {finishedTrip.origin.name}</Text>
                <Text style={styles.modalText}>Para: {finishedTrip.destination.name}</Text>
                <Text style={styles.modalText}>
                  Valor: R$ {finishedTrip.payment.amount.toString().replace('.', ',')}
                </Text>
                <Text style={styles.modalText}>
                  Avaliação: {'⭐'.repeat(finishedTrip.rating)} ({finishedTrip.rating})
                </Text>
              </>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal cancelamento */}
      <Modal visible={cancelModalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Corrida Cancelada</Text>
            <Text style={[styles.modalText, { fontSize: 48, marginVertical: 16 }]}>
              😢
            </Text>
            <Text style={styles.modalText}>
              Você cancelou a viagem.
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeCancelModal}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
  	flex: 1, 
  	paddingHorizontal: 24, 
  	paddingTop: 65,
  	backgroundColor: '#fff',
  },
  profileImage: {
  	alignSelf: 'flex-end',
  	width: 50,
  	height: 50,
  	borderRadius: 100,
  	marginBottom: 50,
  	borderWidth: 2
  },
  title: { 
  	fontSize: 22, 
  	fontWeight: '600', 
  	marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: 30,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
    elevation: 2,
  },
  tabText: {
    color: '#999',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 5,
    marginBottom: 24,
    marginHorizontal: 5,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitle: {
    color: '#777',
    fontSize: 13,
  },
  label: {
    color: '#666',
    marginTop: 8,
    fontSize: 13,
  },
  location: {
    fontSize: 15,
    marginBottom: 4,
  },
  avaliacao: {
    fontSize: 14,
    color: '#f5a623',
    marginBottom: 4,
  },
  valor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#f00',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#0a0',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#f00',
    fontWeight: 'bold',
  },
  acceptText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  map: {
    height: 200,
    width: '100%',
    marginTop: 16,
    borderRadius: 10,
  },
  mapSmall: {
    height: 80,
    width: '100%',
    borderRadius: 10,
    marginBottom: 16,
  },
  statusAccepted: {
    backgroundColor: '#0a0',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusCanceled: {
    backgroundColor: '#f00',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 4,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 24,
    backgroundColor: '#0a0',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
