import { StatusBar, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { theme } from "../constants/theme";

const SplashScreen = () => {
	return (
		<View style={styles.container}>
			<StatusBar
				barStyle="light-content"
				backgroundColor={theme.colors.darkLight}
			/>
			<Animated.Image
				source={require("@/assets/images/logo.png")}
				entering={FadeInDown.duration(700).springify()}
				resizeMode={"contain"}
				style={styles.logo}
			/>
		</View>
	);
};

export default SplashScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: theme.colors.dark,
	},
	logo: {},
});
