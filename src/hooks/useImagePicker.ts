import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { uploadImage } from "@/src/utils/supabaseImages";

export const useImagePicker = (initialPath?: string) => {
	const [imagePath, setImagePath] = useState<string | null>(
		initialPath ?? null,
	);
	const [uploading, setUploading] = useState(false);
	const [hasChanged, setHasChanged] = useState(false);

	useEffect(() => {
		setImagePath(initialPath ?? null);
		setHasChanged(false);
	}, [initialPath]);

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			setUploading(true);
			try {
				// Upload image to Supabase Storage
				const path = await uploadImage(result.assets[0].uri, supabase);
				setImagePath(path);
				setHasChanged(true);
			} catch (err) {
				console.error("Error uploading image:", err);
			} finally {
				setUploading(false);
			}
		}
	};

	const reset = () => {
		setImagePath(initialPath ?? null);
		setHasChanged(false);
	};

	return { pickImage, uploading, imagePath, hasChanged, reset };
};
