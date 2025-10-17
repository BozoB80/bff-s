import { Feather } from "@expo/vector-icons";
import { Image, type ImageStyle } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { theme } from "@/src/constants/theme";
import { supabase } from "@/src/lib/supabase";
import { downloadImage } from "@/src/utils/supabaseImages";

const blurhash = "e1R3TW~qfQ~qfQ~qj[fQj[fQfQfQfQfQfQ~qj[fQj[fQfQfQfQfQfQ";

type TAvatarProps = {
	src: string;
	style?: ImageStyle;
	bucket?: string;
};

const Avatar = ({ src, style, bucket = "avatars" }: TAvatarProps) => {
	const [imageUri, setImageUri] = useState<string>();
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

	const handleDownload = useCallback(async () => {
		try {
			const result = await downloadImage(src, supabase, bucket);
			setImageUri(result as string);
		} catch (error) {
			console.error("Error downloading avatar:", error);
			setIsError(true);
		} finally {
			setIsLoading(false);
		}
	}, [src, bucket]);

	useEffect(() => {
		setIsLoading(true);
		setIsError(false);
		if (src) {
			handleDownload();
		} else {
			setIsLoading(false);
			setIsError(true);
		}
	}, [src, handleDownload]);

	if (isLoading || isError || !imageUri) {
		return (
			<View style={[styles.fallback, style]}>
				<Feather name="user" size={20} color={theme.colors.neutral400} />
			</View>
		);
	}

	return (
		<Image
			style={[styles.userImage, style]}
			decodeFormat="rgb"
			source={{
				uri: imageUri,
			}}
			placeholder={{
				blurhash,
				height: style?.height ? Number(style?.height) : undefined,
				width: style?.width ? Number(style?.width) : undefined,
			}}
			transition={0}
			contentFit="contain"
			cachePolicy="memory-disk"
		/>
	);
};

const styles = StyleSheet.create({
	userImage: {
		height: 40,
		width: 40,
		borderRadius: theme.radius.xl,
	},
	fallback: {
		height: 40,
		width: 40,
		borderRadius: theme.radius.xl,
		backgroundColor: theme.colors.neutral200,
		alignItems: "center",
		justifyContent: "center",
	},
});

export { Avatar };
