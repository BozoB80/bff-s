import { Feather } from "@expo/vector-icons";
import type { TrueSheet } from "@lodev09/react-native-true-sheet";
import { router } from "expo-router";
import { useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { toast } from "sonner-native";
import { useRelativeTime } from "@/src/hooks";
import { useAuth } from "@/src/providers";
import {
	useDeletePost,
	useGetEmotions,
	useGetPostById,
} from "@/src/queries/posts";
import { useGetUser } from "@/src/queries/users";
import { Button } from "../Button";
import { NativeSheet } from "../NativeSheet";
import { SupabaseImage } from "../SupabaseImage";
import { Avatar } from "../ui";

type PostProps = {
	postId: number;
};

const Post = ({ postId }: PostProps) => {
	const { data: post } = useGetPostById(postId);
	const { data: user } = useGetUser(post?.userId ?? "");
	const { user: currentUser } = useAuth();
	const formatRelativeTime = useRelativeTime();
	const sheetRef = useRef<TrueSheet>(null);
	const deleteRef = useRef<TrueSheet>(null);

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
						<Text style={styles.userName}>{user.name}</Text>
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
					title="Uredi post"
					onPress={() => {
						router.push(`/post/${postId}`);
						sheetRef.current?.dismiss();
					}}
				/>
				<Button
					iconName="trash-2"
					title="Izbriši post"
					onPress={() => deleteRef.current?.present()}
				/>
			</NativeSheet>
			<NativeSheet
				ref={deleteRef}
				title="Brisanje posta"
				description="Jeste li sigurni da želite izbrisati ovaj post?"
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
		fontWeight: "500",
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
