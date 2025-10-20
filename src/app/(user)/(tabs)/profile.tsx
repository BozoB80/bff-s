import { Feather } from "@expo/vector-icons";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
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
	const [localAvatar, setLocalAvatar] = useState<string | null>(null);

	const pickBackgroundImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			setLocalImage(result.assets[0].uri);
		}
	};

	const pickAvatar = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled) {
			setLocalAvatar(result.assets[0].uri);
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
		avatar: z.string().nullable().optional(),
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
		let avatarPath = value.avatar;

		if (localImage) {
			imagePath = await uploadImage(localImage, supabase, "images");
		}

		if (localAvatar) {
			avatarPath = await uploadImage(localAvatar, supabase, "avatars");
		}

		updateUser({ ...value, image: imagePath, avatar: avatarPath });
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
				{/* Avatar Section */}
				<View style={styles.avatarContainer}>
					<View style={styles.avatarWrapper}>
						{localAvatar ? (
							<View style={styles.avatarRelative}>
								<Image source={{ uri: localAvatar }} style={styles.avatar} />
								<Pressable onPress={pickAvatar} style={styles.avatarEditButton}>
									<Feather name="plus" size={20} color="white" />
								</Pressable>
							</View>
						) : userData?.avatar ? (
							<View style={styles.avatarRelative}>
								<SupabaseImage
									path={userData.avatar}
									bucket="avatars"
									style={styles.avatar}
								/>
								<Pressable onPress={pickAvatar} style={styles.avatarEditButton}>
									<Feather name="plus" size={20} color="black" />
								</Pressable>
							</View>
						) : (
							<Pressable onPress={pickAvatar} style={styles.avatarPlaceholder}>
								<Feather name="plus" size={20} color="black" />
								{!(userData?.avatar || localAvatar) && (
									<Text style={styles.avatarText}>Profilna slika</Text>
								)}
							</Pressable>
						)}
					</View>
				</View>

				{/* Background Image Section */}
				<View style={styles.backgroundImageContainer}>
					{userData?.image || localImage ? (
						<View style={styles.imageContainer}>
							{localImage ? (
								<Image
									source={{ uri: localImage }}
									style={styles.backgroundImage}
								/>
							) : userData?.image ? (
								<SupabaseImage
									path={userData.image}
									style={styles.backgroundImage}
								/>
							) : null}
							<Pressable
								onPress={pickBackgroundImage}
								style={styles.editImageButton}
							>
								<Feather name="plus" size={20} color="white" />
							</Pressable>
						</View>
					) : (
						<Pressable onPress={pickBackgroundImage} style={styles.imageUpload}>
							<Text>Postavite pozadinsku sliku</Text>
						</Pressable>
					)}
				</View>
				<Controller
					name="name"
					control={control}
					render={({ field }) => (
						<View style={styles.userInput}>
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
	avatarContainer: {
		position: "absolute",
		top: 160,
		left: 50,
		zIndex: 10,
	},
	avatarWrapper: {
		marginBottom: 8,
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: "white",
	},
	avatarPlaceholder: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: "#f0f0f0",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: theme.colors.primary,
		borderStyle: "dashed",
	},
	avatarText: {
		fontSize: 14,
		color: theme.colors.text,
		fontWeight: "500",
		zIndex: 100,
	},
	avatarRelative: {
		position: "relative",
	},
	avatarEditButton: {
		position: "absolute",
		bottom: 0,
		right: -10,
		backgroundColor: theme.colors.primary,
		width: 36,
		height: 36,
		borderRadius: 18,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	backgroundImageContainer: {
		marginBottom: 16,
		position: "relative",
	},
	imageContainer: {
		position: "relative",
	},
	backgroundImage: {
		width: "100%",
		height: 200,
		borderRadius: 10,
	},
	editImageButton: {
		position: "absolute",
		bottom: 12,
		right: 12,
		backgroundColor: theme.colors.primary,
		width: 36,
		height: 36,
		borderRadius: 18,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	imageUpload: {
		width: "100%",
		height: 200,
		backgroundColor: "#f0f0f0",
		borderWidth: 1,
		borderColor: theme.colors.dark,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	userInput: {
		marginTop: 25,
	},
});
