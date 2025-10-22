import { useMemo } from "react";
import type { ImageStyle, StyleProp, ViewStyle } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/src/constants/theme";
import { SupabaseImage } from "./SupabaseImage";

type Props = {
	name?: string | null;
	path?: string | null;
	bucket?: string;
	size?: number;
	style?: StyleProp<ViewStyle>;
};

const Avatar: React.FC<Props> = ({
	name,
	path,
	bucket = "avatars",
	size = 100,
	style,
}) => {
	const initials = useMemo(() => {
		const n = name ?? "";
		if (!n) return "";
		const parts = n.trim().split(/\s+/);
		if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
		const first = parts[0].charAt(0);
		const last = parts[parts.length - 1].charAt(0);
		return (first + last).toUpperCase();
	}, [name]);

	const avatarStyle: StyleProp<ImageStyle> = {
		width: size,
		height: size,
		borderRadius: size / 2,
		backgroundColor: "white",
	};

	const placeholderStyle: StyleProp<ViewStyle> = {
		width: size,
		height: size,
		borderRadius: size / 2,
		backgroundColor: "#f0f0f0",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: theme.colors.primary,
		borderStyle: "dashed",
	};

	return (
		<View style={style}>
			{path ? (
				<View style={styles.relative}>
					<SupabaseImage path={path} bucket={bucket} style={avatarStyle} />
				</View>
			) : (
				<View style={placeholderStyle}>
					<Text
						style={[
							styles.text,
							{ fontSize: Math.max(12, Math.floor(size / 6)) },
						]}
					>
						{initials}
					</Text>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	text: {
		color: theme.colors.text,
		fontWeight: "500",
		zIndex: 100,
	},
	relative: {
		position: "relative",
	},
});

export { Avatar };
