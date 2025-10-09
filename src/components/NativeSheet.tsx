import { Feather } from "@expo/vector-icons";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { type ReactNode, type RefObject, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { theme } from "../constants/theme";

type TNativeSheetProps = {
	ref: RefObject<TrueSheet | null>;
	title?: string;
	description?: string;
	rightAction?: ReactNode;
	removeHorizontalPadding?: boolean;
	disableBackAction?: boolean;
	collapsable?: boolean;
	children: ReactNode;
};

const NativeSheet = ({
	ref,
	title,
	description,
	rightAction,
	removeHorizontalPadding,
	disableBackAction,
	collapsable = true,
	children,
}: TNativeSheetProps) => {
	const [sheetKey, setSheetKey] = useState(0);

	const handleDismiss = async () => {
		await ref.current?.dismiss();
	};

	return (
		<TrueSheet
			backgroundColor={theme.colors.white}
			ref={ref}
			dismissible
			key={`sheet-${sheetKey}`}
			sizes={["auto"]}
			cornerRadius={theme.radius.xl}
			onDismiss={() => setSheetKey(Math.random() * 1000)}
			collapsable={collapsable}
		>
			<GestureHandlerRootView style={{ flexGrow: 1 }}>
				<View
					style={[
						styles.content,
						removeHorizontalPadding && {
							paddingHorizontal: 0,
						},
					]}
				>
					<View style={{ gap: 4 }}>
						<View style={styles.titleWrapper}>
							{disableBackAction ? (
								<View style={{ width: 20 }} />
							) : (
								<Feather
									name="chevron-left"
									size={26}
									onPress={handleDismiss}
								/>
							)}
							<Text style={styles.title}>{title}</Text>
							<View style={styles.rightAction}>{rightAction}</View>
						</View>
						{description && (
							<Text style={{ textAlign: "center" }}>{description}</Text>
						)}
					</View>
					{children}
				</View>
			</GestureHandlerRootView>
		</TrueSheet>
	);
};

const styles = StyleSheet.create({
	content: {
		padding: 10,
		gap: 4,
		position: "relative",
		flexGrow: 1,
		backgroundColor: theme.colors.neutral200,
	},
	title: {
		fontSize: 24,
		color: theme.colors.primary,
		fontWeight: "600",
		textAlign: "center",
	},
	titleWrapper: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	rightAction: {
		minWidth: 20,
	},
});

export { NativeSheet };
