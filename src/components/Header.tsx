import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { theme } from "../constants/theme";
import { BackButton } from "./BackButton";

type HeaderProps = {
	showBackButton?: boolean;
	headerRight?: React.ReactNode;
};

const Header = ({ showBackButton = false, headerRight }: HeaderProps) => {
	const router = useRouter();

	return (
		<View style={styles.container}>
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
