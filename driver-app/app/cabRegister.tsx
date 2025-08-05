import { useState } from "react";
import { Link, router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Ionicons,
  FontAwesome,
  Foundation,
  Octicons,
} from "@expo/vector-icons";
import { driverStorageService, Driver } from "./service/service";
import useStore from "./store/store";

export default function CabRegister() {
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [plateNum, setPlateNum] = useState("");
  const [bank, setBank] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [error, setError] = useState(0);
  const user = useStore((state) => state.user);
  const driver = useLocalSearchParams();
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  const register = async () => {
    let loggedDriver = null;
    if (!error && user) {
      loggedDriver = await driverStorageService.saveDriver({
        ...user,
        cab: {
          model,
          color,
          plateNum,
        },
        bank,
        bankBranch,
        bankAccount
      });
    }

    if (loggedDriver) {
      setCurrentUser(loggedDriver);
      router.push("/trip");
    } else {
      Alert.alert(
        "Ups! Alerta de erro.",
        "Ocorreu um erro inesperado ao tentar salvar novo usuário."
      );
    }
  };

  return (
    <KeyboardAwareScrollView style={{ flex: 1 }} extraScrollHeight={20}>
      <View style={styles.container}>
        <Text style={styles.title}>Informações do carro</Text>

        <View style={styles.content}>
          <View
            style={[styles.inputView, error === 1 ? styles.inputViewError : {}]}
          >
            <View
              style={[styles.iconView, error === 1 ? styles.iconViewError : {}]}
            >
              <FontAwesome name="car" size={20} color="black" />
            </View>
            <TextInput
              placeholder="Modelo"
              value={model}
              onChangeText={(value) => setModel(value)}
              style={styles.input}
            />
          </View>
          <View
            style={[styles.inputView, error === 2 ? styles.inputViewError : {}]}
          >
            <View
              style={[styles.iconView, error === 2 ? styles.iconViewError : {}]}
            >
              <Ionicons name="color-palette" size={20} color="black" />
            </View>
            <TextInput
              placeholder="Cor"
              value={color}
              onChangeText={(value) => setColor(value)}
              style={styles.input}
            />
          </View>
          <View
            style={[styles.inputView, error === 3 ? styles.inputViewError : {}]}
          >
            <View
              style={[styles.iconView, error === 3 ? styles.iconViewError : {}]}
            >
              <Foundation name="credit-card" size={20} color="black" />
            </View>
            <TextInput
              placeholder="Placa"
              value={plateNum}
              onChangeText={(value) => setPlateNum(value.toUpperCase())}
              style={styles.input}
            />
          </View>
        </View>

        <Text style={styles.title}>Informações bancárias</Text>

        <View style={styles.content}>
          <View
            style={[styles.inputView, error === 4 ? styles.inputViewError : {}]}
          >
            <View
              style={[styles.iconView, error === 4 ? styles.iconViewError : {}]}
            >
              <FontAwesome name="bank" size={20} color="black" />
            </View>
            <TextInput
              placeholder="Banco"
              value={bank}
              onChangeText={(value) => setBank(value)}
              style={styles.input}
            />
          </View>
          <View
            style={[styles.inputView, error === 5 ? styles.inputViewError : {}]}
          >
            <View
              style={[styles.iconView, error === 5 ? styles.iconViewError : {}]}
            >
              <Ionicons name="git-branch" size={20} color="black" />
            </View>
            <TextInput
              placeholder="Agência"
              value={bankBranch}
              onChangeText={(value) => setBankBranch(value)}
              style={styles.input}
            />
          </View>
          <View
            style={[styles.inputView, error === 6 ? styles.inputViewError : {}]}
          >
            <View
              style={[styles.iconView, error === 6 ? styles.iconViewError : {}]}
            >
              <Octicons name="number" size={20} color="black" />
            </View>
            <TextInput
              placeholder="Conta"
              value={bankAccount}
              onChangeText={(value) => setBankAccount(value)}
              style={styles.input}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={register}>
          <Text style={styles.buttonText}>Finalizar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 100,
    gap: 50,
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
    alignSelf: "flex-start",
  },
  content: {
    gap: 15,
    width: "100%",
    alignItems: "center",
  },
  inputView: {
    padding: 20,
    backgroundColor: "#eaeaea",
    borderRadius: 20,
    flexDirection: "row",
    gap: 15,
  },
  inputViewError: {
    backgroundColor: "#edd1d1",
  },
  iconView: {
    backgroundColor: "#DEDEDE",
    borderRadius: 100,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  iconViewError: {
    backgroundColor: "#d6b4b4",
  },
  input: {
    flex: 1,
  },
  bottomButtons: {
    width: "100%",
    gap: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "black",
    borderRadius: 20,
    width: "100%",
    padding: 20,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "white",
  },
});
