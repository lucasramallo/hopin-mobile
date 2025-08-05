import { useState, useEffect } from 'react';
import { useRouter, Link } from 'expo-router';
import { KeyboardAvoidingView, Platform, Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { driverStorageService, Driver } from './service/service';
import useStore from './store/store';

export default function Index() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<number[]>([]);
	const router = useRouter();
  const setCurrentUser = useStore((state) => state.setCurrentUser);
	
	useEffect(() => {
		setErrors(errors.filter(input => input != 1));
	}, [name]);
	
	useEffect(() => {
		setErrors(errors.filter(input => input != 2));
	}, [email]);
	
	useEffect(() => {
		setErrors(errors.filter(input => input != 3));
	}, [dateOfBirth]);
	
	useEffect(() => {
		setErrors(errors.filter(input => input != 4));
	}, [password]);
	
	const dateMask = (value: string) => {
		value = value.replace(/\D/g, "");
    
    if (value.length <= 2) {
      return value;
    }
    if (value.length <= 4) {
      return value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    return value.slice(0, 2) + "/" + value.slice(2, 4) + "/" + value.slice(4, 8);
  }
  
  const calculateAge = (birthDate: string) => {
    const [day, month, year] = birthDate.split('/').map(Number);
    const birthDateObj = new Date(year, month - 1, day);
    const ageDiff = Date.now() - birthDateObj.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
	};
  
  const register = async () => {
  	try {
	  	const newDriver: Driver = {
		    name,
		    email,
		    password,
		    dateOfBirth,
		    trips: []
		  };
			
		  setCurrentUser(newDriver);
		  router.push('/cabRegister');
  	} catch (error) {
      console.error("Erro ao registrar:", error);
  	}
  };
  
  const handleSubmit = () => {
  	const validName = name.length > 3;
  	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  	const validEmail = emailRegex.test(email);
  	const [day, month, year] = dateOfBirth.split('/');
  	const validBirthDate = day && month && year && parseInt(year) <= (new Date().getFullYear() - 18);
  	const validPassword = password.length >= 8;
  	
  	if(validName && validEmail && validBirthDate && validPassword){
  		register();
  	} else {
  		let errorsCopy = [...errors];
  		if(!validName){
  			errorsCopy.push(1);
  		}
  		if(!validEmail){
  			errorsCopy.push(2);
  		}
  		if(!validBirthDate){
  			errorsCopy.push(3);
  		}
  		if(!validPassword){
  			errorsCopy.push(4);
  		}
  		setErrors(errorsCopy);
  	}
  }
	
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
    	<Text style={styles.title}>Criar conta</Text>
    	
    	<View style={styles.content}>
    		<View style={[styles.inputView, errors.includes(1) ? styles.inputViewError : {}]}>
    			<View style={[styles.iconView, errors.includes(1) ? styles.iconViewError : {}]}>
    				<FontAwesome name="user" size={20} color="black" />
    			</View>
    			<TextInput 
    				placeholder="Nome" 
    				value={name}
    				onChangeText={(value) => setName(value)}
    				style={styles.input}/>
    		</View>
    		<View style={[styles.inputView, errors.includes(2) ? styles.inputViewError : {}]}>
    			<View style={[styles.iconView, errors.includes(2) ? styles.iconViewError : {}]}>
    				<Ionicons name="mail-sharp" size={20} color="black" />
    			</View>
    			<TextInput 
    				placeholder="Email" 
    				value={email}
    				onChangeText={(value) => setEmail(value.toLowerCase())}
    				style={styles.input}/>
    		</View>
    		<View style={[styles.inputView, errors.includes(3) ? styles.inputViewError : {}]}>
    			<View style={[styles.iconView, errors.includes(3) ? styles.iconViewError : {}]}>
    				<Ionicons name="calendar-number-sharp" size={20} color="black" />
    			</View>
    			<TextInput 
    				placeholder="Data de nascimento" 
    				value={dateOfBirth}
    				onChangeText={(value) => setDateOfBirth(dateMask(value))}
    				keyboardType="numeric"
    				style={styles.input}/>
    		</View>
    		<View style={[styles.inputView, errors.includes(4) ? styles.inputViewError : {}]}>
    			<View style={[styles.iconView, errors.includes(4) ? styles.iconViewError : {}]}>
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
	    	<TouchableOpacity style={styles.button} onPress={handleSubmit}>
	    		<Text style={styles.buttonText}>Continuar</Text>
	      </TouchableOpacity>
	      <Link href="/login" asChild>
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