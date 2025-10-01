import {
	Pressable,
	type StyleProp,
	StyleSheet,
	Text,
	type TextStyle,
	View,
	type ViewStyle,
} from "react-native";
import { theme } from "../constants/theme";
import Loading from "./Loading";

type ButtonProps = {
	title: string;
	onPress: () => void;
	buttonStyle?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
	loading?: boolean;
	hasShadow?: boolean;
};

const Button = ({
	title = "",
	onPress,
	buttonStyle,
	textStyle,
	loading = false,
	hasShadow = false,
}: ButtonProps) => {
	const shadow = {
		shadowColor: theme.colors.dark,
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 4,
	};

	if (loading) {
		return (
			<View style={[styles.button, buttonStyle, { backgroundColor: "white" }]}>
				<Loading />
			</View>
		);
	}

	return (
		<Pressable
			onPress={onPress}
			style={[styles.button, buttonStyle, hasShadow && shadow]}
		>
			<Text style={[styles.text, textStyle]}>{title}</Text>
		</Pressable>
	);
};

export { Button };

const styles = StyleSheet.create({
	button: {
		backgroundColor: theme.colors.primary,
		height: 46,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: theme.radius.xl,
	},
	text: {
		fontSize: 22,
		color: "white",
		fontWeight: theme.fonts.bold,
		textAlign: "center",
	},
});
