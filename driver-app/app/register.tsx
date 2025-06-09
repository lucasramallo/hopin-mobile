import { useState } from 'react';
import { Link } from 'expo-router';
import { KeyboardAvoidingView, Platform, Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default function Index() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [birthDate, setBirthDate] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(0);
	
	const dateMask = (value) => {
		value = value.replace(/\D/g, "");
    
    if (value.length <= 2) {
      return value;
    }
    if (value.length <= 4) {
      return value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    return value.slice(0, 2) + "/" + value.slice(2, 4) + "/" + value.slice(4, 8);
  }
	
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
    	<Text style={styles.title}>Criar conta</Text>
    	
    	<View style={styles.content}>
    		<View style={[styles.inputView, error === 1 ? styles.inputViewError : {}]}>
    			<View style={[styles.iconView, error === 1 ? styles.iconViewError : {}]}>
    				<FontAwesome name="user" size={20} color="black" />
    			</View>
    			<TextInput 
    				placeholder="Nome" 
    				value={name}
    				onChangeText={(value) => setName(value)}
    				style={styles.input}/>
    		</View>
    		<View style={[styles.inputView, error === 2 ? styles.inputViewError : {}]}>
    			<View style={[styles.iconView, error === 2 ? styles.iconViewError : {}]}>
    				<Ionicons name="mail-sharp" size={20} color="black" />
    			</View>
    			<TextInput 
    				placeholder="Email" 
    				value={email}
    				onChangeText={(value) => setEmail(value)}
    				style={styles.input}/>
    		</View>
    		<View style={[styles.inputView, error === 3 ? styles.inputViewError : {}]}>
    			<View style={[styles.iconView, error === 3 ? styles.iconViewError : {}]}>
    				<Ionicons name="calendar-number-sharp" size={20} color="black" />
    			</View>
    			<TextInput 
    				placeholder="Data de nascimento" 
    				value={birthDate}
    				onChangeText={(value) => setBirthDate(dateMask(value))}
    				keyboardType="numeric"
    				style={styles.input}/>
    		</View>
    		<View style={[styles.inputView, error === 4 ? styles.inputViewError : {}]}>
    			<View style={[styles.iconView, error === 4 ? styles.iconViewError : {}]}>
    				<FontAwesome name="lock" size={20} color="black" />
    			</View>
    			<TextInput 
    				placeholder="Senha"
    				value={password}
    				onChangeText={(value) => setPassword(value)} 
    				style={styles.input} secureTextEntry/>
    		</View>
    	</View>
    	
    	<View style={styles.bottomButtons}>
    		<Link href="cabRegister" asChild>
		    	<TouchableOpacity style={styles.button}>
		    		<Text style={styles.buttonText}>Continuar</Text>
		      </TouchableOpacity>
	      </Link>
	      <Link href="login" asChild>
		      <TouchableOpacity>
		      	<Text>Fazer login</Text>
		      </TouchableOpacity>
	      </Link>
      </View>
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