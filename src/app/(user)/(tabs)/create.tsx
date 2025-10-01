import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { supabase } from "@/src/lib/supabase";

const CreatePage = () => {
	const router = useRouter();

	useEffect(() => {
		const checkAuth = async () => {
			const { data } = await supabase.auth.getSession();
			if (!data.session) {
				router.replace("/register");
			}
		};
		checkAuth();
	}, [router]);

	return (
		<View>
			<Text>CreatePage</Text>
		</View>
	);
};

export default CreatePage;

const styles = StyleSheet.create({});
