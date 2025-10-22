import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../constants/theme";
import { BackButton } from "./BackButton";

type HeaderProps = {
	showBackButton?: boolean;
	headerRight?: React.ReactNode;
};

const Header = ({ showBackButton = false, headerRight }: HeaderProps) => {
	const router = useRouter();
	const insets = useSafeAreaInsets();

	return (
		<LinearGradient
			colors={[theme.colors.primary, theme.colors.dark]}
			style={[styles.container, { paddingTop: insets.top || 16 }]}
		>
			{showBackButton && (
				<View style={styles.backButton}>
					<BackButton router={router} />
				</View>
			)}
			<Image
				source={require("@/assets/images/logo.png")}
				contentFit="contain"
				style={styles.logo}
			/>
			{headerRight && <View style={styles.headerRight}>{headerRight}</View>}
		</LinearGradient>
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
	backButton: {
		position: "absolute",
		left: 5,
		bottom: 10,
	},
	headerRight: {
		position: "absolute",
		right: 5,
		bottom: 10,
		padding: 5,
	},
});
