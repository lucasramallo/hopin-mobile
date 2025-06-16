import { useState, useEffect, useRef } from 'react';
import { Link, useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScrollView, KeyboardAvoidingView, Platform, Image, Text, View, StyleSheet, TextInput, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons, FontAwesome, Foundation } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { driverStorageService, Driver } from '../../service/service';
import DefaultAvatar from "../../../assets/images/avatar_placeholder.png";
import useStore from '../../store/store';

export default function Index() {
  const user = useStore((state) => state.user);
  const setCurrentUser = useStore((state) => state.setCurrentUser);
	const [image, setImage] = useState<string | null>(user?.avatar);
	const [driver, setDriver] = useState<Driver | null>(user);
	const [password, setPassword] = useState<string>(user?.password);
	const [errors, setErrors] = useState<number[]>([]);
  const scrollRef = useRef();
	const router = useRouter();
	
	useEffect(() => {
		setErrors([]);
	}, [driver]);
	
	useEffect(() => {
		setDriver({ ...driver, avatar: image, password });
	}, [image, password]);
		
	const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
	
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
  
  const edit = () => {
  	driverStorageService.editDriver(driver);
  	setCurrentUser(driver);
  	console.log(driver)
  	router.push('/profile');
  }
  
  const handleSubmit = () => {
  	const validName = driver.name.length > 3;
  	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  	const validEmail = emailRegex.test(driver.email);
  	const [day, month, year] = driver.birthDate.split('/');
  	const validBirthDate = day && month && year && parseInt(year) <= (new Date().getFullYear() - 18);
  	const validPassword = password.length >= 8;
  	
  	if(validName && validEmail && validBirthDate && validPassword){
  		edit();
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

	const scrollToInputs = () => {
	  scrollRef.current?.scrollTo({
	    y: Dimensions.get('window').height - 600,
	    animated: true,
	  });
	};
	
	const scrollToEnd = () => {
	  scrollRef.current?.scrollToEnd();
	};
	
  return (
    <ScrollView 
    	style={{ flex: 1 }}
    	ref={scrollRef} >
    	<KeyboardAvoidingView style={styles.container}>
    	<Link href="profile" dismissTo asChild>
    		<TouchableOpacity style={styles.backButton}>
    			<FontAwesome name="chevron-left" size={25} color="black" />
    		</TouchableOpacity>
    	</Link>
    	
    	<Text style={styles.title}>Informações do usuário</Text>
    	
    	<TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
    		<Image source={image ? { uri: image } : DefaultAvatar} style={styles.image} />
    		<View style={{ elevation: 2, top: -35, borderRadius: 100, width: 35, height: 35, alignSelf: 'flex-end', backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', }}>
    			<FontAwesome name="pencil" size={20} color="black" />
    		</View>
    	</TouchableOpacity>
    	
    	<View style={styles.content}>
    		<View style={[styles.inputView, errors.includes(1) ? styles.inputViewError : {}]}>
    			<View style={[styles.iconView, errors.includes(1) ? styles.iconViewError : {}]}>
    				<FontAwesome name="user" size={20} color="black" />
    			</View>
    			<TextInput 
    				placeholder="Nome" 
    				value={driver.name}
    				onChangeText={(value) => setDriver({ ...driver, name: value })}
    				style={styles.input}
    				onFocus={scrollToInputs}/>
    		</View>
    		<View style={[styles.inputView, errors.includes(2) ? styles.inputViewError : {}]}>
    			<View style={[styles.iconView, errors.includes(2) ? styles.iconViewError : {}]}>
    				<Ionicons name="mail-sharp" size={20} color="black" />
    			</View>
    			<TextInput 
    				placeholder="Email" 
    				value={driver.email}
    				onChangeText={(value) => setDriver({ ...driver, email: value })}
    				style={styles.input}
    				onFocus={scrollToInputs}/>
    		</View>
    		<View style={[styles.inputView, errors.includes(3) ? styles.inputViewError : {}]}>
    			<View style={[styles.iconView, errors.includes(3) ? styles.iconViewError : {}]}>
    				<Ionicons name="calendar-number-sharp" size={20} color="black" />
    			</View>
    			<TextInput 
    				placeholder="Data de nascimento" 
    				value={driver.birthDate}
    				onChangeText={(value) => setDriver({ ...driver, birthDate: dateMask(value) })}
    				keyboardType="numeric"
    				style={styles.input}
    				onFocus={scrollToInputs}/>
    		</View>
    		<View style={[styles.inputView, errors.includes(4) ? styles.inputViewError : {}]}>
    			<View style={[styles.iconView, errors.includes(4) ? styles.iconViewError : {}]}>
    				<FontAwesome name="lock" size={20} color="black" />
    			</View>
    			<TextInput 
    				placeholder="Senha"
    				value={password}
    				onChangeText={(value) => setPassword(value)} 
    				style={styles.input} 
    				secureTextEntry
    				onFocus={scrollToInputs}/>
    		</View>
    	</View>
    	
    	
    	<Text style={styles.title}>Informações do carro</Text>
    	
    	<View style={styles.content}>
    		<View style={[styles.inputView, errors.includes(5) ? styles.inputViewError : {}]}>
    			<View style={[styles.iconView, errors.includes(5) ? styles.iconViewError : {}]}>
    				<FontAwesome name="car" size={20} color="black" />
    			</View>
    			<TextInput 
    				placeholder="Modelo" 
    				value={driver.cab.model}
    				onChangeText={(value) => setDriver({ ...driver, cab: { ...driver.cab, model: value }})}
    				style={styles.input}
    				onFocus={scrollToEnd}/>
    		</View>
    		<View style={[styles.inputView, errors.includes(6) ? styles.inputViewError : {}]}>
    			<View style={[styles.iconView, errors.includes(6) ? styles.iconViewError : {}]}>
    				<Ionicons name="color-palette" size={20} color="black" />
    			</View>
    			<TextInput 
    				placeholder="Cor" 
    				value={driver.cab.color}
    				onChangeText={(value) => setDriver({ ...driver, cab: { ...driver.cab, color: value }})}
    				style={styles.input}
    				onFocus={scrollToEnd}/>
    		</View>
    		<View style={[styles.inputView, errors.includes(7) ? styles.inputViewError : {}]}>
    			<View style={[styles.iconView, errors.includes(7) ? styles.iconViewError : {}]}>
    				<Foundation name="credit-card" size={20} color="black" />
    			</View>
    			<TextInput 
    				placeholder="Placa" 
    				value={driver.cab.plateNumber}
    				onChangeText={(value) => setDriver({ ...driver, cab: { ...driver.cab, plateNumber: value.toUpperCase() }})}
    				style={styles.input}
    				onFocus={scrollToEnd}/>
    		</View>
    	</View>
    	
    	<View style={styles.bottomButtons}>
	    	<TouchableOpacity style={styles.button} onPress={handleSubmit}>
	    		<Text style={styles.buttonText}>Continuar</Text>
	      </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingTop: 100,
    paddingBottom: 150,
    gap: 50
  },
  backButton: {
  	width: 50,
  	height: 50,
  	borderWidth: 1,
  	justifyContent: 'center',
  	alignItems: 'center',
  	borderRadius: 50,
  	alignSelf: 'flex-start',
  },
  title: {
  	fontWeight: "bold",
  	fontSize: 30,
  	alignSelf: 'flex-start',
  },
  imagePicker: { 
  	borderRadius: 100, 
  	borderWidth: 2, 
  	alignSelf: 'center',
  	width: 104, 
  	height: 104, 
  },
  image: {
  	borderRadius: 100, 
  	width: 100, 
  	height: 100, 
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