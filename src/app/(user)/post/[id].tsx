import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import {
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { toast } from "sonner-native";
import z from "zod";
import {
	Button,
	Input,
	ScreenWrapper,
	Select,
	SupabaseImage,
} from "@/src/components";
import { theme } from "@/src/constants/theme";
import { useImagePicker } from "@/src/hooks";
import { newEmotionIcons } from "@/src/mappers";
import { useAuth } from "@/src/providers";
import {
	useGetCategories,
	useGetEmotions,
	useGetPostById,
	useUpdatePost,
} from "@/src/queries/posts";

const editPostSchema = z.object({
	categoryId: z.number().nullable().optional(),
	image: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	emotionId: z.number().nullable().optional(),
	emotionName: z.string().nullable().optional(),
});

const EditPost = () => {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { user } = useAuth();
	const { data: post } = useGetPostById(Number(id));
	const { data: categories } = useGetCategories();
	const { data: emotions } = useGetEmotions();
	const { mutate: updatePost, isPending } = useUpdatePost(() => {
		toast.success("Objava uspješno ažurirana");
		router.back();
	});

	const {
		pickImage,
		uploading,
		imagePath,
		hasChanged: imageChanged,
	} = useImagePicker(post?.image ?? "");

	const {
		control,
		handleSubmit,
		formState: { isDirty },
	} = useForm<z.infer<typeof editPostSchema>>({
		resolver: zodResolver(editPostSchema),
		values: post,
	});

	const onSubmit: SubmitHandler<z.infer<typeof editPostSchema>> = (data) => {
		updatePost({
			postId: Number(id),
			postDetails: {
				...data,
				user_id: user?.id,
				image: imagePath,
				emotionName:
					emotions?.find((e) => e.id === data.emotionId)?.title ?? null,
			},
		});
	};

	return (
		<ScreenWrapper showPattern isModal bgOpacity={0.2}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={100}
			>
				<ScrollView style={{ flex: 1 }}>
					<View style={styles.container}>
						<Controller
							control={control}
							name="categoryId"
							render={({ field: { onChange, value } }) => (
								<View>
									<Text>Kategorija</Text>
									<Select
										value={value ?? undefined}
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
										title="Emocije"
										description="Izrazite osjećaje povezane s vašom objavom"
										value={value ?? undefined}
										onChange={onChange}
										placeholder="Kako se osjećate?"
										useColorGroups
										options={(emotions || []).map((emotion) => ({
											id: emotion.id,
											name: emotion.title ?? "",
											icon: newEmotionIcons()[emotion.id],
										}))}
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
							title="Ažuriraj objavu"
							onPress={handleSubmit(onSubmit)}
							loading={isPending}
							disabled={!isDirty && !imageChanged}
						/>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</ScreenWrapper>
	);
};

export default EditPost;

const styles = StyleSheet.create({
	container: {
		padding: 16,
		gap: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
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
