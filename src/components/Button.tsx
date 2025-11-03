import { Feather } from "@expo/vector-icons";
import {
	type StyleProp,
	StyleSheet,
	Text,
	type TextStyle,
	View,
	type ViewStyle,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
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
					backgroundColor: "transparent",
					padding: 0,
				},
				text: {
					fontSize: 18,
					color: theme.colors.dark,
				},
			};
		default: // default
			return {
				button: {},
				text: {},
			};
	}
};

const getSizeStyles = (size: ButtonProps["size"]) => {
	switch (size) {
		case "small":
			return {
				button: {
					height: 36,
					paddingHorizontal: 12,
				},
				text: {
					fontSize: 16,
				},
			};
		case "large":
			return {
				button: {
					height: 56,
					paddingHorizontal: 20,
				},
				text: {
					fontSize: 24,
				},
			};
		default: // medium
			return {
				button: {
					height: 46,
					paddingHorizontal: 16,
				},
				text: {
					fontSize: 22,
				},
			};
	}
};

type ButtonProps = {
	title?: string;
	onPress: () => void;
	buttonStyle?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
	loading?: boolean;
	hasShadow?: boolean;
	disabled?: boolean;
	variant?: "default" | "outline" | "secondary" | "icon";
	size?: "small" | "medium" | "large";
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
	size = "medium",
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
	const sizeStyles = getSizeStyles(size);
	const textColor = variantStyles.text.color || theme.colors.white;

	const getIconSize = () => {
		switch (size) {
			case "small":
				return 16;
			case "large":
				return 24;
			default:
				return 20;
		}
	};

	const iconSize = getIconSize();

	if (loading) {
		return (
			<View
				style={[
					styles.button,
					sizeStyles.button,
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
		<RectButton
			onPress={onPress}
			enabled={!disabled}
			style={[
				styles.button,
				sizeStyles.button,
				variantStyles.button,
				buttonStyle,
				hasShadow && shadow,
				disabled && { opacity: 0.6 },
			]}
		>
			{variant === "icon" ? (
				<Feather
					name={iconName || "circle"}
					size={iconSize}
					color={textColor}
				/>
			) : (
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					{iconName && (
						<Feather
							name={iconName}
							size={iconSize}
							color={textColor}
							style={{ marginRight: 8 }}
						/>
					)}
					<Text
						style={[
							styles.text,
							sizeStyles.text,
							variantStyles.text,
							textStyle,
						]}
					>
						{title}
					</Text>
				</View>
			)}
		</RectButton>
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
