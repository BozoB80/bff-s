import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers";

const AuthLayout = () => {
	const { setAuth, user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		supabase.auth.onAuthStateChange((_event, session) => {
			if (session) {
				setAuth(session?.user);
				router.replace("/(tabs)");
			} else {
				setAuth(null);
				router.replace("/(auth)/login");
			}
		});
	}, []);

	console.log(user);
	return (
		<Stack>
			<Stack.Screen name="login" options={{ headerShown: false }} />
			<Stack.Screen name="register" options={{ headerShown: false }} />
		</Stack>
	);
};

export default AuthLayout;
