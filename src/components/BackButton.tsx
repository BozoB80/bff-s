import { Feather } from "@expo/vector-icons";
import type { Router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { theme } from "../constants/theme";

type BackButtonProps = {
	router?: Router;
};

const BackButton = ({ router }: BackButtonProps) => {
	return (
		<Pressable onPress={() => router?.back()} style={styles.button}>
			<Feather name="arrow-left" size={26} color={theme.colors.primaryLight} />
		</Pressable>
	);
};

export { BackButton };

const styles = StyleSheet.create({
	button: {
		alignSelf: "flex-start",
		padding: 5,
		borderRadius: theme.radius.sm,
		backgroundColor: "transparent",
	},
});
