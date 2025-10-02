import { useRouter } from "expo-router";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/src/components";
import { supabase } from "@/src/lib/supabase";

const Profile = () => {
	const router = useRouter();

	const onLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			Alert.alert("Signout", "Error signing out");
		}
	};

	const handleLogout = async () => {
		Alert.alert("Odjava", "Želite se odjaviti?", [
			{
				text: "Natrag",
				style: "cancel",
			},
			{
				text: "Odjava",
				style: "destructive",
				onPress: () => onLogout(),
			},
		]);
	};

	return (
		<SafeAreaView>
			<Button title="Odjava" onPress={handleLogout} />
		</SafeAreaView>
	);
};

export default Profile;

const styles = StyleSheet.create({});
