import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { toast } from "sonner-native";
import z from "zod";
import { Button, Header, Input, Select, SupabaseImage } from "@/src/components";
import { theme } from "@/src/constants/theme";
import { supabase } from "@/src/lib/supabase";
import { newEmotionIcons } from "@/src/mappers";
import { useAuth } from "@/src/providers";
import {
	useCreatePost,
	useGetCategories,
	useGetEmotions,
} from "@/src/queries/posts";
import { uploadImage } from "@/src/utils/supabaseImages";

const createPostSchema = z.object({
	categoryId: z.number().optional(),
	image: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	emotionId: z.number().optional(),
});

const CreatePage = () => {
	const router = useRouter();
	const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(
		null,
	);
	const [uploading, setUploading] = useState(false);

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
				setUploadedImagePath(path);
			} catch (err) {
				console.error("Error uploading image:", err);
			} finally {
				setUploading(false);
			}
		}
	};

	const { user } = useAuth();
	const { data: categories } = useGetCategories();
	const { data: emotions } = useGetEmotions();
	const { mutate: createPost, isPending } = useCreatePost(() => {
		toast.success("Objava uspješno kreirana");
		reset();
		setUploadedImagePath(null);
		router.replace("/(user)/(tabs)");
	});

	const {
		control,
		handleSubmit,
		reset,
		formState: { isDirty },
	} = useForm<z.infer<typeof createPostSchema>>({
		resolver: zodResolver(createPostSchema),
		defaultValues: {
			title: "",
			description: "",
			image: "",
			categoryId: undefined,
			emotionId: undefined,
		},
	});

	const onSubmit: SubmitHandler<z.infer<typeof createPostSchema>> = (data) => {
		createPost({
			title: data.title ?? "",
			description: data.description ?? "",
			image: uploadedImagePath ?? "",
			categoryId: data?.categoryId ?? null,
			emotionId: data?.emotionId ?? null,
			userId: user?.id,
		});
		reset();
		setUploadedImagePath(null);
	};

	return (
		<View>
			<Header />
			<Text style={styles.post}>Kreirajte objavu</Text>
			<View style={styles.container}>
				<Controller
					name={"categoryId"}
					control={control}
					render={({ field: { onChange, value } }) => (
						<View>
							<Select
								value={value}
								onChange={onChange}
								placeholder="Izaberite kategoriju"
								options={(categories || []).map((category) => ({
									id: category.id,
									name: category.name ?? "",
								}))}
								title="Kategorije"
								description="Izaberite kategoriju za vašu objavu"
							/>
						</View>
					)}
				/>
				<Pressable onPress={pickImage}>
					{uploading ? (
						<View style={styles.imageUpload}>
							<Text>Učitavam...</Text>
						</View>
					) : uploadedImagePath ? (
						<SupabaseImage
							path={uploadedImagePath}
							style={{ width: "100%", height: 200, borderRadius: 10 }}
						/>
					) : (
						<View style={styles.imageUpload}>
							<Feather name="plus-circle" size={24} />
							<Text>Dodaj sliku</Text>
						</View>
					)}
				</Pressable>
				<Controller
					name="emotionId"
					control={control}
					render={({ field: { onChange, value } }) => (
						<View>
							<Select
								value={value}
								onChange={onChange}
								placeholder="Kako se osjećate?"
								options={(emotions || []).map((emotion) => ({
									id: emotion.id,
									name: emotion.title ?? "",
									icon: newEmotionIcons()[emotion.id],
								}))}
								title="Emocije"
								description="Izrazite osjećaje povezane s vašom objavom"
							/>
						</View>
					)}
				/>
				<Controller
					name="title"
					control={control}
					render={({ field }) => (
						<View>
							<Text>Naslov</Text>
							<Input
								placeholder="Unesite naslov"
								value={field.value ?? ""}
								onChangeText={field.onChange}
							/>
						</View>
					)}
				/>
				<Controller
					name="description"
					control={control}
					render={({ field }) => (
						<View>
							<Text>Opis</Text>
							<Input
								placeholder="Podijelite vaše mišljenje"
								value={field.value ?? ""}
								onChangeText={field.onChange}
							/>
						</View>
					)}
				/>
				<Button
					title="Objavi"
					loading={isPending}
					disabled={!isDirty || isPending}
					hasShadow
					onPress={handleSubmit(onSubmit)}
				/>
			</View>
		</View>
	);
};

export default CreatePage;

const styles = StyleSheet.create({
	container: {
		padding: 16,
		gap: 16,
	},
	post: {
		textAlign: "center",
		fontSize: 36,
		fontWeight: theme.fonts.bold,
		paddingVertical: 12,
	},
	imageUpload: {
		width: "100%",
		height: 200,
		backgroundColor: theme.colors.white,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
		borderColor: theme.colors.neutral350,
		borderWidth: 1,
	},
});
