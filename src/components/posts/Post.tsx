import { Feather, Ionicons } from "@expo/vector-icons";
import type { TrueSheet } from "@lodev09/react-native-true-sheet";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { toast } from "sonner-native";
import { theme } from "@/src/constants/theme";
import { useRelativeTime } from "@/src/hooks";
import { useAuth } from "@/src/providers";
import {
	useAddLike,
	useGetLikeStatus,
	useRemoveLike,
} from "@/src/queries/likes";
import { useDeletePost } from "@/src/queries/posts";
import type { TPostWithUserAndComments } from "@/src/types";
import { Button } from "../Button";
import { NativeSheet } from "../NativeSheet";
import { SupabaseImage } from "../SupabaseImage";
import { Avatar } from "../ui";
import Comments from "./Comments";

type PostProps = {
	post: TPostWithUserAndComments;
};

const Post = ({ post }: PostProps) => {
	const formatRelativeTime = useRelativeTime();
	const sheetRef = useRef<TrueSheet>(null);
	const deleteRef = useRef<TrueSheet>(null);
	const commentRef = useRef<TrueSheet>(null);
	const [showLikeIcon, setShowLikeIcon] = useState(false);
	const [optimisticLike, setOptimisticLike] = useState<boolean | null>(null);

	const user = post.users;
	const { user: currentUser } = useAuth();
	const { mutate: deletePost } = useDeletePost(() => {
		sheetRef.current?.dismiss();
		toast.success("Post je uspješno izbrisan.");
	});

	const isOwnPost = post.userId === currentUser?.id;
	const { data: isLiked } = useGetLikeStatus(
		post.id,
		currentUser?.id ?? "",
		!isOwnPost,
	);

	const { mutate: addLike } = useAddLike(post.id, currentUser?.id ?? "");
	const { mutate: removeLike } = useRemoveLike(post.id, currentUser?.id ?? "");

	const handleLikePress = () => {
		if (post.userId === currentUser?.id) {
			toast.error("Nije moguće lajkati vlastitu objavu.");
			return;
		}

		const newLikeState = optimisticLike !== null ? optimisticLike : isLiked;
		setOptimisticLike(!newLikeState);

		if (!showLikeIcon) {
			setShowLikeIcon(true);
		}

		if (!newLikeState) {
			addLike();
		} else {
			removeLike();
		}
	};

	const displayLiked = optimisticLike !== null ? optimisticLike : isLiked;

	return (
		<View style={styles.container}>
			{user && (
				<View style={styles.userContainer}>
					<Avatar src={user.avatar ?? ""} />
					<Pressable
						onPress={() => {
							router.push(`/profile-other/${user.id}`);
						}}
					>
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
					</Pressable>
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
			<View style={styles.likesContainer}>
				<View style={styles.likesBar}>
					<Ionicons
						onPress={handleLikePress}
						name={displayLiked ? "heart" : "heart-outline"}
						size={24}
						color={displayLiked ? theme.colors.primary : theme.colors.black}
					/>
					<Text>{post?.likes_count ?? 0}</Text>
				</View>
				<Pressable
					onPress={() => commentRef.current?.present()}
					style={styles.likesBar}
				>
					<Ionicons
						name="chatbubble-outline"
						size={24}
						color={theme.colors.black}
					/>
					<Text>Komentara: {post?.total_comments_count ?? 0}</Text>
				</Pressable>
			</View>
			<NativeSheet ref={sheetRef} disableBackAction={true}>
				<Button
					variant="outline"
					iconName="edit-3"
					title="Uredi objavu"
					onPress={() => {
						router.push(`/post/${post.id}`);
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
						onPress={() => deletePost(post.id)}
					/>
				</View>
			</NativeSheet>
			<NativeSheet ref={commentRef} title="Komentari" disableBackAction>
				<Comments data={post ?? []} user={currentUser} />
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
	likesContainer: {
		marginTop: 8,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	likesBar: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
});
