import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome, Foundation } from '@expo/vector-icons';

export default function Index() {
	const [model, setModel] = useState("");
	const [color, setColor] = useState("");
	const [plateNumber, setPlateNumber] = useState("");
	const [error, setError] = useState(0);
	
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
    	<Text style={styles.title}>Informações do carro</Text>
    	
    	<View style={styles.content}>
    		<View style={[styles.inputView, error === 1 ? styles.inputViewError : {}]}>
    			<View style={[styles.iconView, error === 1 ? styles.iconViewError : {}]}>
    				<FontAwesome name="car" size={20} color="black" />
    			</View>
    			<TextInput 
    				placeholder="Modelo" 
    				value={model}
    				onChangeText={(value) => setModel(value)}
    				style={styles.input}/>
    		</View>
    		<View style={[styles.inputView, error === 2 ? styles.inputViewError : {}]}>
    			<View style={[styles.iconView, error === 2 ? styles.iconViewError : {}]}>
    				<Ionicons name="color-palette" size={20} color="black" />
    			</View>
    			<TextInput 
    				placeholder="Cor" 
    				value={color}
    				onChangeText={(value) => setColor(value)}
    				style={styles.input}/>
    		</View>
    		<View style={[styles.inputView, error === 3 ? styles.inputViewError : {}]}>
    			<View style={[styles.iconView, error === 3 ? styles.iconViewError : {}]}>
    				<Foundation name="credit-card" size={20} color="black" />
    			</View>
    			<TextInput 
    				placeholder="Placa" 
    				value={plateNumber}
    				onChangeText={(value) => setPlateNumber(value)}
    				style={styles.input}/>
    		</View>
    	</View>
    	
    	<TouchableOpacity style={styles.button}>
    		<Text style={styles.buttonText}>Finalizar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'white',
    padding: 15,
    gap: 50
  },
  title: {
  	fontWeight: "bold",
  	fontSize: 30,
  	alignSelf: 'flex-start',
  },
  content : { 
  	gap: 15, 
  	width: "100%", 
  	alignItems: 'center' 
  },
  inputView: {
    padding: 20,
    backgroundColor: "#eaeaea",
    borderRadius: 20,
    flexDirection: "row",
    gap: 15
  },
  inputViewError: {
    backgroundColor: "#edd1d1",
  },
  iconView: {
    backgroundColor: "#DEDEDE",
    borderRadius: 100,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconViewError: {
  	backgroundColor: "#d6b4b4"
  },
  input: {
  	flex: 1
  },
  bottomButtons: {
  	width: "100%",
  	gap: 20,
  	alignItems: 'center',
  },
  button: {
  	backgroundColor: 'black',
  	borderRadius: 20,
  	width: "100%",
  	padding: 20,
  	alignItems: 'center',
  	marginTop: 30
  },
  buttonText: {
  	color: 'white',
  }
});