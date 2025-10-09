import { Ionicons } from "@expo/vector-icons";
import type { TrueSheet } from "@lodev09/react-native-true-sheet";
import { FlashList } from "@shopify/flash-list";
import { useRef } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { theme } from "../constants/theme";
import { NativeSheet } from "./NativeSheet";

interface SelectProps {
	value?: string | number;
	placeholder: string;
	onPress?: () => void;
	onChange?: (value: string | number) => void;
	options: { id: number; name: string }[];
}

const Select = ({
	value,
	placeholder,
	onPress,
	onChange,
	options,
}: SelectProps) => {
	const sheetRef = useRef<TrueSheet>(null);

	const handleOpenModal = async () => {
		await sheetRef.current?.present();
	};

	const handleSelectOption = async (option: { id: number; name: string }) => {
		if (onChange) {
			onChange(option.id);
		}
		await sheetRef.current?.dismiss();
	};

	return (
		<>
			<Pressable onPress={onPress || handleOpenModal} style={styles.container}>
				<Text style={[styles.text, !value && styles.placeholder]}>
					{options.find((opt) => opt.id === value)?.name || placeholder}
				</Text>
				<Ionicons name="chevron-forward" size={20} color={theme.colors.text} />
			</Pressable>

			<NativeSheet
				ref={sheetRef}
				title="Select Option"
				description="Choose an option from the list"
				disableBackAction={true}
			>
				<FlashList
					data={options}
					renderItem={({ item }) => (
						<Text
							onPress={() => handleSelectOption(item)}
							style={styles.option}
						>
							{item.name}
						</Text>
					)}
					contentContainerStyle={styles.contentStyle}
					masonry
					numColumns={2}
				/>
			</NativeSheet>
		</>
	);
};

export { Select };

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderWidth: 0.4,
		borderColor: theme.colors.text,
		borderRadius: theme.radius.lg,
		borderCurve: "continuous",
		paddingHorizontal: 18,
		paddingVertical: 14,
		gap: 12,
		backgroundColor: theme.colors.white,
	},
	text: {
		color: theme.colors.text,
		flex: 1,
	},
	placeholder: {
		color: theme.colors.neutral500,
	},
	contentStyle: {
		padding: 4,
	},
	option: {
		backgroundColor: theme.colors.primary,
		borderRadius: theme.radius.sm,
		color: theme.colors.white,
		paddingVertical: 6,
		paddingHorizontal: 12,
		alignItems: "center",
		justifyContent: "center",
		margin: 4,
	},
});
