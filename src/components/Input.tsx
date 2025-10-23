import {
	StyleSheet,
	TextInput,
	type TextInputProps,
	View,
	type ViewStyle,
} from "react-native";
import { theme } from "../constants/theme";

interface InputProps extends TextInputProps {
	containerStyles?: ViewStyle;
	icon?: React.ReactNode;
	inputRef?: React.RefObject<TextInput>;
	iconRight?: React.ReactNode;
}

const Input = (props: InputProps) => {
	return (
		<View
			style={[styles.container, props.containerStyles && props.containerStyles]}
		>
			{props.icon && props.icon}
			<TextInput
				ref={props.inputRef && props.inputRef}
				style={{
					flex: 1,
					height: props.multiline ? 100 : 50,
					color: theme.colors.black,
				}}
				placeholderTextColor={theme.colors.neutral500}
				{...props}
			/>
			{props.iconRight && props.iconRight}
		</View>
	);
};

export { Input };

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 0.4,
		borderColor: theme.colors.text,
		borderRadius: theme.radius.lg,
		borderCurve: "continuous",
		paddingHorizontal: 18,
		gap: 12,
		backgroundColor: theme.colors.white,
	},
});
