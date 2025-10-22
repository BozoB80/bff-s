import { Feather } from "@expo/vector-icons";
import type { TrueSheet } from "@lodev09/react-native-true-sheet";
import { router } from "expo-router";
import { useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { toast } from "sonner-native";
import { theme } from "@/src/constants/theme";
import { useRelativeTime } from "@/src/hooks";
import { useAuth } from "@/src/providers";
import { useDeletePost, useGetPostById } from "@/src/queries/posts";
import { useGetUser } from "@/src/queries/users";
import { Button } from "../Button";
import { NativeSheet } from "../NativeSheet";
import { SupabaseImage } from "../SupabaseImage";
import { Avatar } from "../ui";

type PostProps = {
	postId: number;
};

const Post = ({ postId }: PostProps) => {
	const formatRelativeTime = useRelativeTime();
	const sheetRef = useRef<TrueSheet>(null);
	const deleteRef = useRef<TrueSheet>(null);

	const { data: post } = useGetPostById(postId);
	const { data: user } = useGetUser(post?.userId ?? "");
	const { user: currentUser } = useAuth();
	const { mutate: deletePost } = useDeletePost(() => {
		sheetRef.current?.dismiss();
		toast.success("Post je uspješno izbrisan.");
	});

	return (
		<View style={styles.container}>
			{user && (
				<View style={styles.userContainer}>
					<Avatar src={user.avatar ?? ""} />
					<View>
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<Text style={styles.userName}>{user.name} </Text>
							{post?.emotionName && (
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<Text>se osjeća </Text>
									<Text style={styles.emotions}>{post?.emotionName}</Text>
								</View>
							)}
						</View>
						<Text>
							{post?.created_at
								? formatRelativeTime(new Date(post.created_at))
								: ""}
						</Text>
					</View>
					{post?.userId === currentUser?.id && (
						<Pressable
							style={{ marginLeft: "auto" }}
							onPress={() => sheetRef.current?.present()}
						>
							<Feather name="more-vertical" size={18} />
						</Pressable>
					)}
				</View>
			)}

			<Text style={styles.title}>{post?.title}</Text>
			<Text>{post?.description}</Text>
			{post?.image && <SupabaseImage path={post.image} style={styles.image} />}
			<NativeSheet ref={sheetRef} disableBackAction={true}>
				<Button
					variant="outline"
					iconName="edit-3"
					title="Uredi objavu"
					onPress={() => {
						router.push(`/post/${postId}`);
						sheetRef.current?.dismiss();
					}}
				/>
				<Button
					iconName="trash-2"
					title="Izbriši objavu"
					onPress={() => deleteRef.current?.present()}
				/>
			</NativeSheet>
			<NativeSheet
				ref={deleteRef}
				title="Brisanje objave"
				description="Jeste li sigurni da želite izbrisati ovu objavu?"
			>
				<View style={{ flexDirection: "row", gap: 8 }}>
					<Button
						variant="outline"
						iconName="x"
						title="Otkaži"
						buttonStyle={{ flex: 1 }}
						onPress={() => deleteRef.current?.dismiss()}
					/>
					<Button
						iconName="check"
						title="Izbriši"
						buttonStyle={{ flex: 1 }}
						onPress={() => deletePost(postId)}
					/>
				</View>
			</NativeSheet>
		</View>
	);
};

export { Post };

const styles = StyleSheet.create({
	container: {
		padding: 16,
		gap: 4,
		backgroundColor: "white",
	},
	userContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	userName: {
		fontWeight: theme.fonts.bold,
	},
	emotions: {
		fontWeight: theme.fonts.bold,
		fontVariant: ["small-caps"],
	},
	image: {
		width: "100%",
		height: 200,
		borderRadius: 10,
	},
	title: {
		fontWeight: "bold",
		fontSize: 16,
	},
});
