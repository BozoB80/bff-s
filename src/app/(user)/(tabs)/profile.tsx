import { Feather } from "@expo/vector-icons";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import z from "zod";
import { Button, Header, Input, SupabaseImage } from "@/src/components";
import { theme } from "@/src/constants/theme";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers";
import { useGetUser, useUpdateUser } from "@/src/queries/users";
import { uploadImage } from "@/src/utils/supabaseImages";
import type { TablesUpdate } from "../../../types/database.types";

const Profile = () => {
	const { user } = useAuth();
	const { data: userData } = useGetUser(user?.id ?? "");
	const { mutate: updateUser, isPending } = useUpdateUser(user?.id ?? "");

	const [localImage, setLocalImage] = useState<string | null>(null);

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			quality: 1,
		});

		console.log(result);

		if (!result.canceled) {
			setLocalImage(result.assets[0].uri);
		}
	};

	const onLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			Alert.alert("Signout", "Error signing out");
		}
	};

	const handleLogout = async () => {
		Alert.alert("Odjava", "Želite se odjaviti?", [
			{
				text: "Natrag",
				style: "cancel",
			},
			{
				text: "Odjava",
				style: "destructive",
				onPress: () => onLogout(),
			},
		]);
	};

	const profileSchema = z.object({
		id: z.string().optional(),
		created_at: z.string().optional(),
		image: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		bio: z.string().nullable().optional(),
		address: z.string().nullable().optional(),
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<TablesUpdate<"users">>({
		resolver: zodResolver(profileSchema),
		values: userData,
		mode: "onChange",
	});

	const onSubmit = async (value: TablesUpdate<"users">) => {
		let imagePath = value.image;
		if (localImage) {
			imagePath = await uploadImage(localImage, supabase);
		}
		updateUser({ ...value, image: imagePath });
	};

	return (
		<View>
			<Header
				showBackButton
				headerRight={
					<Feather
						name="log-out"
						size={24}
						color={theme.colors.primary}
						onPress={handleLogout}
					/>
				}
			/>
			<View style={styles.container}>
				<Pressable onPress={pickImage}>
					{userData?.image ? (
						<SupabaseImage
							path={userData.image}
							style={{ width: "100%", height: 200, borderRadius: 10 }}
						/>
					) : (
						<View style={styles.imageUpload}>
							<Text>Tap to upload profile image</Text>
						</View>
					)}
				</Pressable>
				<Controller
					name="name"
					control={control}
					render={({ field }) => (
						<View>
							<Text>Korisničko ime</Text>
							<Input
								placeholder="Vaše ime"
								value={field.value ?? ""}
								onChangeText={field.onChange}
							/>
							<ErrorMessage
								errors={errors}
								name="name"
								render={({ message }: { message: string }) => (
									<small className="text-red-500">{message}</small>
								)}
							/>
						</View>
					)}
				/>
				<Controller
					name="address"
					control={control}
					render={({ field }) => (
						<View>
							<Text>Vaša adresa</Text>
							<Input
								placeholder="Adresa"
								value={field.value ?? ""}
								onChangeText={field.onChange}
							/>
						</View>
					)}
				/>
				<Controller
					name="bio"
					control={control}
					render={({ field }) => (
						<View>
							<Text>Nešto o vama</Text>
							<Input
								placeholder="Vaša biografija"
								value={field.value ?? ""}
								onChangeText={field.onChange}
								multiline
								numberOfLines={4}
							/>
						</View>
					)}
				/>
				<Button
					title="Ažuriraj"
					loading={isPending}
					onPress={handleSubmit(onSubmit)}
				/>
			</View>
		</View>
	);
};

export default Profile;

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		gap: 16,
		padding: 16,
	},
	imageUpload: {
		width: "100%",
		height: 200,
		backgroundColor: "#f0f0f0",
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
	},
});
