import { Feather } from "@expo/vector-icons";
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

type FeatherIconName = keyof typeof Feather.glyphMap;

const getVariantStyles = (variant: ButtonProps["variant"]) => {
	switch (variant) {
		case "outline":
			return {
				button: {
					backgroundColor: "transparent",
					borderWidth: 1,
					borderColor: theme.colors.dark,
				},
				text: {
					color: theme.colors.dark,
				},
			};
		case "secondary":
			return {
				button: {
					backgroundColor: theme.colors.neutral200,
				},
				text: {
					color: theme.colors.dark,
				},
			};
		case "icon":
			return {
				button: {
					height: 40,
					width: 40,
				},
				text: {
					fontSize: 18,
				},
			};
		default: // default
			return {
				button: {},
				text: {},
			};
	}
};

type ButtonProps = {
	title: string;
	onPress: () => void;
	buttonStyle?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
	loading?: boolean;
	hasShadow?: boolean;
	disabled?: boolean;
	variant?: "default" | "outline" | "secondary" | "icon";
	iconName?: FeatherIconName;
};

const Button = ({
	title = "",
	onPress,
	buttonStyle,
	textStyle,
	loading = false,
	hasShadow = false,
	disabled = false,
	variant = "default",
	iconName,
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

	const variantStyles = getVariantStyles(variant);
	const textColor = variantStyles.text.color || theme.colors.white;

	if (loading) {
		return (
			<View
				style={[
					styles.button,
					variantStyles.button,
					buttonStyle,
					{ backgroundColor: "white" },
				]}
			>
				<Loading />
			</View>
		);
	}

	return (
		<Pressable
			onPress={onPress}
			disabled={disabled}
			style={[
				styles.button,
				variantStyles.button,
				buttonStyle,
				hasShadow && shadow,
				disabled && { opacity: 0.6 },
			]}
		>
			{variant === "icon" ? (
				<Feather name={iconName || "circle"} size={20} color={textColor} />
			) : (
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					{iconName && (
						<Feather
							name={iconName}
							size={20}
							color={textColor}
							style={{ marginRight: 8 }}
						/>
					)}
					<Text style={[styles.text, variantStyles.text, textStyle]}>
						{title}
					</Text>
				</View>
			)}
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
		borderRadius: theme.radius.lg,
	},
	text: {
		fontSize: 22,
		color: "white",
		fontWeight: theme.fonts.bold,
		textAlign: "center",
	},
});
