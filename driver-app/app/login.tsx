import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { driverStorageService, Driver } from './service/service';
import useStore from './store/store';

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(0);
	const router = useRouter();
	const setCurrentUser = useStore((state) => state.setCurrentUser);

	const login = async () => {
		const driver: Driver | null = await driverStorageService.login(email, password);
		if (driver) {
			setCurrentUser(driver);
			router.push('/trip');
		} else {
			setError(1);
		}
	};

	useEffect(() => {
		setError(0);
	}, [email, password]);

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<Text style={styles.title}>Fazer login</Text>

			<View style={styles.content}>
				<View style={[styles.inputView, (error === 1) ? styles.inputViewError : {}]}>
					<View style={[styles.iconView, (error === 1) ? styles.iconViewError : {}]}>
						<Ionicons name="mail-sharp" size={20} color="black" />
					</View>
					<TextInput
						placeholder="Email"
						value={email}
						onChangeText={(value) => setEmail(value.toLowerCase())}
						style={styles.input} />
				</View>
				<View style={[styles.inputView, (error === 1) ? styles.inputViewError : {}]}>
					<View style={[styles.iconView, (error === 1) ? styles.iconViewError : {}]}>
						<FontAwesome name="lock" size={20} color="black" />
					</View>
					<TextInput
						placeholder="Senha"
						value={password}
						onChangeText={(value) => setPassword(value)}
						style={styles.input} secureTextEntry />
				</View>
			</View>

			{error === 1 && <View style={styles.warnView}>
				<Text style={styles.warnText}>Email ou senha incorretos</Text>
			</View>}

			<View style={styles.bottomButtons}>
				<TouchableOpacity style={styles.button} onPress={login}>
					<Text style={styles.buttonText}>Entrar</Text>
				</TouchableOpacity>
				<Link href="register" dismissTo asChild>
					<TouchableOpacity>
						<Text>Criar conta</Text>
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
	content: {
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
	warnView: {
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#cc3300',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'stretch',
		padding: 20
	},
	warnText: {
		color: '#cc3300'
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