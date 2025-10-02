import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { theme } from "../constants/theme";

const SplashScreen = () => {
	const router = useRouter();

	useEffect(() => {
		setTimeout(() => {
			router.replace("/(auth)/login");
		}, 2000);
	}, [router.replace]);

	return (
		<View style={styles.container}>
			<LinearGradient
				colors={[theme.colors.primary, theme.colors.dark]}
				style={styles.background}
			>
				<StatusBar
					barStyle="light-content"
					backgroundColor={theme.colors.darkLight}
				/>
				<Animated.Image
					source={require("@/assets/images/logo.png")}
					entering={FadeInDown.duration(1000).springify()}
					resizeMode={"contain"}
					style={styles.logo}
				/>
			</LinearGradient>
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
	logo: {
		height: "30%",
		aspectRatio: 1,
	},
	background: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
	},
});
