import { useState, useEffect } from "react";
import { Link } from "expo-router";
import {
  Image,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons, FontAwesome, Foundation } from "@expo/vector-icons";
import { driverStorageService, Driver } from "../../service/service";
import DefaultAvatar from "../../../assets/images/avatar_placeholder.png";
import useStore from "../../store/store";

export default function Login() {
  const user = useStore((state) => state.user);

  return (
    <View style={styles.container}>
      <View style={styles.profileView}>
        {user && (
          <Link href="editProfile" asChild>
            <TouchableOpacity style={styles.editButton}>
              <Text style={{ color: "#47ca6c" }}>Editar</Text>
            </TouchableOpacity>
          </Link>
        )}
        <Image
          source={user?.avatar ? { uri: user.avatar } : DefaultAvatar}
          style={styles.image}
        />
        <Text>{user?.name || "Sem usuário"}</Text>
        <Text>{user?.email || "emaildeexemplo@gmail.com"}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.dataView}>
          <View style={styles.iconView}>
            <FontAwesome name="car" size={20} color="#47ca6c" />
          </View>
          <Text style={styles.data}>
            Modelo - {user?.cab?.model || "Exemplo de modelo"}
          </Text>
        </View>
        <View style={styles.dataView}>
          <View style={styles.iconView}>
            <Ionicons name="color-palette" size={20} color="#47ca6c" />
          </View>
          <Text style={styles.data}>
            Cor - {user?.cab?.color || "Exemplo de cor"}
          </Text>
        </View>
        <View style={styles.dataView}>
          <View style={styles.iconView}>
            <Foundation name="credit-card" size={20} color="#47ca6c" />
          </View>
          <Text style={styles.data}>
            Placa - {user?.cab?.plateNum || "Exemplo de placa"}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => driverStorageService.clearDriver()}
        style={{
          backgroundColor: "black",
          alignSelf: "stretch",
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
        }}
      >
        <Text style={{ color: "white" }}>Resetar dados</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 100,
    gap: 50,
  },
  profileView: {
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    gap: 10,
    padding: 20,
    borderRadius: 20,
    width: "100%",
  },
  editButton: {
    alignSelf: "flex-end",
  },
  image: {
    borderRadius: 100,
    width: 65,
    height: 65,
  },
  content: {
    gap: 15,
    width: "100%",
  },
  iconView: {
    borderWidth: 1,
    borderColor: "#47ca6c",
    borderRadius: 100,
    padding: 5,
    minWidth: 33,
    alignItems: "center",
    justifyContent: "center",
  },
  dataView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
});
