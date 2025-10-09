import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { toast } from "sonner-native";
import z from "zod";
import { Button, Header, Input, Select } from "@/src/components";
import { theme } from "@/src/constants/theme";
import { useAuth } from "@/src/providers";
import {
	useCreatePost,
	useGetCategories,
	useGetPosts,
} from "@/src/queries/posts";

const createPostSchema = z.object({
	categoryId: z.number().optional(),
	image: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
});

const CreatePage = () => {
	const router = useRouter();

	const { user } = useAuth();
	const { data: categories } = useGetCategories();
	const { data: posts } = useGetPosts();
	const { mutate: createPost, isPending } = useCreatePost(() => {
		toast.success("Objava uspješno kreirana");
		reset();
		router.replace("/(user)/(tabs)");
	});

	const {
		control,
		handleSubmit,
		reset,
		formState: { isDirty },
	} = useForm<z.infer<typeof createPostSchema>>({
		resolver: zodResolver(createPostSchema),
		values: posts?.length
			? {
					categoryId: posts[0].categoryId ?? undefined,
					image: posts[0].image ?? undefined,
					title: posts[0].title ?? undefined,
					description: posts[0].description ?? undefined,
				}
			: {},
	});

	const onSubmit: SubmitHandler<z.infer<typeof createPostSchema>> = (data) => {
		createPost({
			title: data.title ?? "",
			description: data.description ?? "",
			image: data.image ?? null,
			categoryId: data?.categoryId ?? null,
			userId: user?.id,
		});
		reset();
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
		padding: 8,
		gap: 12,
	},
	post: {
		textAlign: "center",
		fontSize: 36,
		fontWeight: theme.fonts.bold,
		paddingVertical: 12,
	},
});
