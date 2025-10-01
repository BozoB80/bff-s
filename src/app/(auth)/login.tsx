import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { BackButton, Button, Input, ScreenWrapper } from "@/src/components";
import { theme } from "@/src/constants/theme";
import { supabase } from "@/src/lib/supabase";
import { useLoginUser } from "@/src/queries/auth";

const Login = () => {
	const router = useRouter();
	const emailRef = useRef("");
	const passwordRef = useRef("");

	const { mutate: login, isPending } = useLoginUser(
		emailRef.current,
		passwordRef.current,
	);

	const onSubmit = async () => {
		login();
	};

	return (
		<ScreenWrapper showPattern bgOpacity={0.2}>
			<StatusBar style="dark" />
			<View style={styles.container}>
				<BackButton router={router} />
				<View>
					<Text style={styles.welcomeText}>Hej,</Text>
					<Text style={styles.welcomeText}>Dobrodošli natrag</Text>
				</View>

				<View style={styles.form}>
					<Text style={{ fontSize: 16, color: theme.colors.text }}>
						Unesite detalje za prijavu
					</Text>
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
					<Button title="Prijava" loading={isPending} onPress={onSubmit} />
				</View>

				<View style={styles.footer}>
					<Text style={styles.footerText}>Nemate račun?</Text>
					<Pressable onPress={() => router.push("/(auth)/register")}>
						<Text
							style={[
								styles.footerText,
								{
									color: theme.colors.primary,
									fontWeight: theme.fonts.semibold,
								},
							]}
						>
							Registracija
						</Text>
					</Pressable>
				</View>
			</View>
		</ScreenWrapper>
	);
};

export default Login;

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
