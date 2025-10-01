import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { BackButton, Button, Input, ScreenWrapper } from "@/src/components";
import { theme } from "@/src/constants/theme";
import { supabase } from "@/src/lib/supabase";

const Register = () => {
	const router = useRouter();
	const nameRef = useRef("");
	const emailRef = useRef("");
	const passwordRef = useRef("");
	const [loading, setLoading] = useState(false);

	const onSubmit = async () => {
		if (!emailRef.current || !passwordRef.current || !nameRef.current) {
			Alert.alert("Greška", "Molimo popunite sva polja");
		}

		const name = nameRef.current.trim();
		const email = emailRef.current.trim();
		const password = passwordRef.current.trim();

		setLoading(true);

		const { data: session, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					name,
				},
			},
		});

		console.log(session, error);

		if (error) {
			Alert.alert("Greška", error.message);
			setLoading(false);
			return;
		}

		setLoading(false);
	};

	return (
		<ScreenWrapper showPattern bgOpacity={0.2}>
			<StatusBar style="dark" />
			<View style={styles.container}>
				<BackButton router={router} />
				<View>
					<Text style={styles.welcomeText}>Krenimo</Text>
					<Text style={styles.welcomeText}>U Avanturu</Text>
				</View>

				<View style={styles.form}>
					<Text style={{ fontSize: 16, color: theme.colors.text }}>
						Unesite detalje
					</Text>
					<Input
						icon={<Feather name="user" size={26} />}
						placeholder="Unesite vaše ime"
						onChangeText={(value) => {
							nameRef.current = value;
						}}
					/>
					<Input
						icon={<Feather name="mail" size={26} />}
						placeholder="Email adresa"
						onChangeText={(value) => {
							emailRef.current = value;
						}}
					/>
					<Input
						icon={<Feather name="lock" size={26} />}
						placeholder="Lozinka"
						secureTextEntry
						onChangeText={(value) => {
							passwordRef.current = value;
						}}
					/>
					<Button title="Kreiraj" loading={loading} onPress={onSubmit} />
				</View>

				<View style={styles.footer}>
					<Text style={styles.footerText}>Već imate račun?</Text>
					<Pressable onPress={() => router.push("/(auth)/login")}>
						<Text
							style={[
								styles.footerText,
								{
									color: theme.colors.primary,
									fontWeight: theme.fonts.semibold,
								},
							]}
						>
							Prijava
						</Text>
					</Pressable>
				</View>
			</View>
		</ScreenWrapper>
	);
};

export default Register;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 45,
		paddingHorizontal: 5,
	},
	welcomeText: {
		fontSize: 36,
		fontWeight: theme.fonts.bold,
		color: theme.colors.text,
	},
	form: {
		gap: 20,
	},
	forgotPassword: {
		textAlign: "right",
		fontWeight: theme.fonts.semibold,
		color: theme.colors.text,
	},
	footer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 5,
	},
	footerText: {
		textAlign: "center",
		color: theme.colors.text,
		fontSize: 16,
	},
});
