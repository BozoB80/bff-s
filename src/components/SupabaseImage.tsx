import { type ComponentProps, useEffect, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import { supabase } from "../lib/supabase";
import { downloadImage } from "../utils/supabaseImages";

type SupabaseImageProps = {
	path: string;
} & ComponentProps<typeof Image>;

const SupabaseImage = ({ path, ...imageProps }: SupabaseImageProps) => {
	const [image, setImage] = useState<string>();
	const [isLoading, setIsLoading] = useState(true);

	const handleDownload = async () => {
		try {
			const result = await downloadImage(path, supabase);
			setImage(result);
		} catch (error) {
			console.error("Error downloading image:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		setIsLoading(true);
		if (path) {
			handleDownload();
		} else {
			setIsLoading(false);
		}
	}, [path]);

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
