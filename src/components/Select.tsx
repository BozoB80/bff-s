import { Feather, Ionicons } from "@expo/vector-icons";
import type { TrueSheet } from "@lodev09/react-native-true-sheet";
import { FlashList } from "@shopify/flash-list";
import { useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";
import { NativeSheet } from "./NativeSheet";

interface SelectProps {
	value?: string | number;
	placeholder: string;
	onPress?: () => void;
	onChange?: (value: string | number) => void;
	options: { id: number; name: string; icon?: string }[];
	title?: string;
	description?: string;
}

const Select = ({
	value,
	placeholder,
	onPress,
	onChange,
	options,
	title,
	description,
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
				<View style={styles.textContainer}>
					{value && options.find((opt) => opt.id === value)?.icon && (
						<Feather
							name={
								options.find((opt) => opt.id === value)
									?.icon as keyof typeof Feather.glyphMap
							}
							size={16}
							color={theme.colors.text}
						/>
					)}
					<Text style={[styles.text, !value && styles.placeholder]}>
						{options.find((opt) => opt.id === value)?.name || placeholder}
					</Text>
				</View>
				<Ionicons name="chevron-forward" size={20} color={theme.colors.text} />
			</Pressable>

			<NativeSheet
				ref={sheetRef}
				title={title}
				description={description}
				disableBackAction={true}
			>
				<FlashList
					data={options}
					renderItem={({ item }) => (
						<Pressable
							onPress={() => handleSelectOption(item)}
							style={styles.optionPressable}
						>
							{item.icon && (
								<Feather
									name={item.icon as keyof typeof Feather.glyphMap}
									size={16}
									color={theme.colors.white}
								/>
							)}
							<Text style={styles.optionText}>{item.name}</Text>
						</Pressable>
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
	textContainer: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
		gap: 8,
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
	optionPressable: {
		backgroundColor: theme.colors.primary,
		borderRadius: theme.radius.sm,
		paddingVertical: 6,
		paddingHorizontal: 12,
		margin: 4,
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	optionText: {
		color: theme.colors.white,
	},
});
