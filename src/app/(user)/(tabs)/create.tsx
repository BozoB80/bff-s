import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { toast } from "sonner-native";
import z from "zod";
import { Button, Header, Input, Select, SupabaseImage } from "@/src/components";
import { theme } from "@/src/constants/theme";
import { useImagePicker } from "@/src/hooks";
import { newEmotionIcons } from "@/src/mappers";
import { useAuth } from "@/src/providers";
import {
	useCreatePost,
	useGetCategories,
	useGetEmotions,
} from "@/src/queries/posts";

const createPostSchema = z.object({
	categoryId: z.number().optional(),
	image: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	emotionId: z.number().optional(),
	emotionName: z.string().optional(),
});

const CreatePage = () => {
	const router = useRouter();
	const {
		pickImage,
		uploading,
		imagePath,
		reset: resetImage,
	} = useImagePicker();

	const { user } = useAuth();
	const { data: categories } = useGetCategories();
	const { data: emotions } = useGetEmotions();
	const { mutate: createPost, isPending } = useCreatePost(() => {
		toast.success("Objava uspješno kreirana");
		reset();
		resetImage();
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
			emotionName: undefined,
		},
	});

	const onSubmit: SubmitHandler<z.infer<typeof createPostSchema>> = (data) => {
		createPost({
			title: data.title ?? "",
			description: data.description ?? "",
			image: imagePath ?? "",
			categoryId: data?.categoryId ?? null,
			emotionId: data?.emotionId ?? null,
			user_id: user?.id,
			emotionName:
				emotions?.find((e) => e.id === data.emotionId)?.title ?? null,
		});
	};

	return (
		<View style={{ flex: 1 }}>
			<Header />
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={
					Platform.OS === "ios"
						? /* header height */ 50
						: (StatusBar.currentHeight ?? 0)
				}
			>
				<ScrollView style={{ flex: 1 }} scrollIndicatorInsets={{ bottom: -4 }}>
					<Text style={styles.post}>Kreiraj objavu</Text>
					<View style={styles.container}>
						<Controller
							name={"categoryId"}
							control={control}
							render={({ field: { onChange, value } }) => (
								<View>
									<Text>Kategorija</Text>
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
							) : imagePath ? (
								<SupabaseImage
									path={imagePath}
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
									<Text>Osjećam se...</Text>
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
										useColorGroups
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
										multiline
										numberOfLines={4}
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
				</ScrollView>
			</KeyboardAvoidingView>
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
