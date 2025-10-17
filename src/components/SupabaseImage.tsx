import { type ComponentProps, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import { supabase } from "../lib/supabase";
import { downloadImage } from "../utils/supabaseImages";

type SupabaseImageProps = {
	path: string;
	bucket?: string;
} & ComponentProps<typeof Image>;

const SupabaseImage = ({
	path,
	bucket = "images",
	...imageProps
}: SupabaseImageProps) => {
	const [image, setImage] = useState<string>();
	const [isLoading, setIsLoading] = useState(true);

	const handleDownload = useCallback(async () => {
		try {
			const result = await downloadImage(path, supabase, bucket);
			setImage(result as string);
		} catch (error) {
			console.error("Error downloading image:", error);
		} finally {
			setIsLoading(false);
		}
	}, [path, bucket]);

	useEffect(() => {
		setIsLoading(true);
		if (path) {
			handleDownload();
		} else {
			setIsLoading(false);
		}
	}, [path, handleDownload]);

	if (isLoading) {
		return (
			<View
				style={[
					{
						backgroundColor: "gainsboro",
						alignItems: "center",
						justifyContent: "center",
					},
					imageProps.style,
				]}
			>
				<ActivityIndicator />
			</View>
		);
	}

	return <Image source={{ uri: image }} {...imageProps} />;
};

export { SupabaseImage };
