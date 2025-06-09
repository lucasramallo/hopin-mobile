import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Modal,
} from 'react-native';
import { useState } from 'react';
import Mapa from '../assets/images/Mapa.png';

const enderecos = [
  'Av. Brasil, 100 - Centro',
  'Rua das Palmeiras, 45 - Jardim América',
  'Av. Atlântica, 3000 - Copacabana',
  'Rua da Alegria, 12 - Bairro Feliz',
  'Travessa do Sol, 87 - Zona Leste',
  'Rua João Pessoa, 231 - Centro',
];

const gerarEnderecoAleatorio = () =>
  enderecos[Math.floor(Math.random() * enderecos.length)];

const gerarNotaAleatoria = () => Math.floor(Math.random() * 3) + 3; // de 3 a 5
const gerarValorAleatorio = () =>
  parseFloat((Math.random() * 40 + 10).toFixed(2)); // de 10 a 50

function gerarCorrida() {
  let from = gerarEnderecoAleatorio();
  let to;
  do {
    to = gerarEnderecoAleatorio();
  } while (to === from);

  return {
    id: Date.now(),
    passageiro: {
      nome: 'Ana Silva',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    },
    from,
    to,
    status: 'pendente', // ou 'aceita', 'cancelada'
  };
}

export default function Trip() {
  const [tab, setTab] = useState<'atuais' | 'anteriores'>('atuais');
  const [corridaAtual, setCorridaAtual] = useState(gerarCorrida());
  const [corridasAnteriores, setCorridasAnteriores] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalCancelamentoVisivel, setModalCancelamentoVisivel] = useState(false);
  const [corridaConcluida, setCorridaConcluida] = useState<any>(null);

  const aceitarCorrida = () => {
    setCarregando(true);
    setTimeout(() => {
      const corridaFinalizada = {
        ...corridaAtual,
        status: 'aceita',
        nota: gerarNotaAleatoria(),
        valor: gerarValorAleatorio(),
      };
      setCorridasAnteriores((prev) => [...prev, corridaFinalizada]);
      setCorridaConcluida(corridaFinalizada);
      setModalVisivel(true);
      setCorridaAtual(gerarCorrida());
      setCarregando(false);
    }, 5000);
  };

  const cancelarCorrida = () => {
    setCorridasAnteriores((prev) => [
      ...prev,
      { ...corridaAtual, status: 'cancelada' },
    ]);
    setModalCancelamentoVisivel(true);
    setCorridaAtual(gerarCorrida());
  };

  const fecharModal = () => {
    setModalVisivel(false);
    setCorridaConcluida(null);
  };

  const fecharModalCancelamento = () => {
    setModalCancelamentoVisivel(false);
  };

  return (
    <View style={styles.container}>
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
        <View style={styles.card}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: corridaAtual.passageiro.avatar }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.name}>{corridaAtual.passageiro.nome}</Text>
              <Text style={styles.subtitle}>Passageiro</Text>
            </View>
          </View>

          <Text style={styles.label}>De</Text>
          <Text style={styles.location}>{corridaAtual.from}</Text>
          <Text style={styles.label}>Para</Text>
          <Text style={styles.location}>{corridaAtual.to}</Text>

          {carregando ? (
            <Text style={{ textAlign: 'center', marginVertical: 16, fontSize: 16 }}>
              Corrida em andamento...
            </Text>
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelarCorrida}
                disabled={carregando}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={aceitarCorrida}
                disabled={carregando}
              >
                <Text style={styles.acceptText}>Aceitar</Text>
              </TouchableOpacity>
            </View>
          )}

          <Image source={Mapa} style={styles.map} resizeMode="cover" />
        </View>
      ) : (
        <>
          {corridasAnteriores.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 24 }}>
              Nenhuma corrida anterior encontrada.
            </Text>
          ) : (
            <FlatList
              data={[...corridasAnteriores].reverse()}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item: corrida }) => (
                <View style={styles.card}>
                  <View
                    style={
                      corrida.status === 'aceita'
                        ? styles.statusAccepted
                        : styles.statusCanceled
                    }
                  >
                    <Text style={styles.statusText}>
                      {corrida.status === 'aceita' ? 'Aceita' : 'Cancelada'}
                    </Text>
                  </View>
                  <Image source={Mapa} style={styles.mapSmall} resizeMode="cover" />
                  <Text style={styles.label}>De</Text>
                  <Text style={styles.location}>{corrida.from}</Text>
                  <Text style={styles.label}>Para</Text>
                  <Text style={styles.location}>{corrida.to}</Text>

                  {corrida.status === 'aceita' && (
                    <>
                      <Text style={styles.label}>Avaliação</Text>
                      <Text style={styles.avaliacao}>
                        {'⭐'.repeat(corrida.nota)} ({corrida.nota})
                      </Text>
                      <Text style={styles.label}>Valor</Text>
                      <Text style={styles.valor}>
                        R$ {corrida.valor.toFixed(2).replace('.', ',')}
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
      <Modal visible={modalVisivel} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Corrida Concluída!</Text>
            {corridaConcluida && (
              <>
                <Text style={styles.modalText}>
                  Obrigado por realizar a corrida com {corridaConcluida.passageiro.nome}.
                </Text>
                <Text style={styles.modalText}>De: {corridaConcluida.from}</Text>
                <Text style={styles.modalText}>Para: {corridaConcluida.to}</Text>
                <Text style={styles.modalText}>
                  Valor: R$ {corridaConcluida.valor.toFixed(2).replace('.', ',')}
                </Text>
                <Text style={styles.modalText}>
                  Avaliação: {'⭐'.repeat(corridaConcluida.nota)} ({corridaConcluida.nota})
                </Text>
              </>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={fecharModal}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal cancelamento */}
      <Modal visible={modalCancelamentoVisivel} transparent animationType="fade">
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
              onPress={fecharModalCancelamento}
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
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16 },
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
    marginBottom: 24,
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
    height: 100,
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
