import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { theme } from "../constants/theme";

const Header = () => {
	return (
		<View style={styles.container}>
			<Image
				source={require("@/assets/images/logo.png")}
				contentFit="contain"
				style={styles.logo}
			/>
		</View>
	);
};

export { Header };

const styles = StyleSheet.create({
	container: {
		paddingTop: 50,
		paddingBottom: 5,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 15,
		backgroundColor: theme.colors.dark,
	},
	logo: {
		width: 100,
		aspectRatio: 2,
	},
});
