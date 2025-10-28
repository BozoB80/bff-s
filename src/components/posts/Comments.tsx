import { FontAwesome } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { theme } from "@/src/constants/theme";
import { useAddComment } from "@/src/queries/comments";
import type { TCommentWithUser, TPostWithUserAndComments } from "@/src/types";
import type { Tables } from "@/src/types/database.types";
import { Input } from "../Input";
import CommentDetails from "./CommentDetails";

type TCommentsProps = {
	data: TPostWithUserAndComments;
	user: Tables<"users"> | null;
	containerStyle?: ViewStyle;
};

const Comments = ({ data, user, containerStyle }: TCommentsProps) => {
	const [commentText, setCommentText] = useState("");
	const [replyTo, setReplyTo] = useState<number | null>(null);
	const { mutate: addComment } = useAddComment(data.id);

	const onSubmitComment = (body: string) => {
		addComment({
			post_id: data.id,
			user_id: user?.id || "",
			body,
			parent_id: replyTo,
		});
		setCommentText("");
		setReplyTo(null);
	};

	const onReply = (parentId: number) => {
		setReplyTo(parentId);
	};

	const buildCommentTree = (comments?: TCommentWithUser[]) => {
		if (!comments) return [];
		const commentMap = new Map<number, TCommentWithUser>();
		const roots: TCommentWithUser[] = [];

		comments.forEach((comment) => {
			comment.replies = [];
			commentMap.set(comment.id, comment);
		});

		comments.forEach((comment) => {
			if (comment.parent_id) {
				const parent = commentMap.get(comment.parent_id);
				if (parent?.replies) {
					parent.replies.push(comment);
				}
			} else {
				roots.push(comment);
			}
		});

		roots.sort(
			(a, b) =>
				new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
		);
		roots.forEach((root) => {
			if (root.replies) {
				root.replies.sort(
					(a, b) =>
						new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
				);
			}
		});

		return roots;
	};

	const nestedComments = buildCommentTree(data.comments);

	return (
		<View
			style={[
				{
					flex: 1,
					flexDirection: "column",
				},
				containerStyle,
			]}
		>
			<FlashList
				data={nestedComments}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<CommentDetails comment={item} onReply={onReply} user={user} />
				)}
				scrollEnabled={true}
				ListEmptyComponent={
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Text>Nema komentara</Text>
					</View>
				}
			/>
			<Input
				icon={
					replyTo ? (
						<RectButton
							onPress={() => setReplyTo(null)}
							style={styles.iconButton}
						>
							<FontAwesome
								name="times"
								size={24}
								color={theme.colors.primary}
							/>
						</RectButton>
					) : undefined
				}
				iconRight={
					<RectButton
						onPress={() => onSubmitComment(commentText)}
						style={styles.iconButton}
					>
						<FontAwesome name="send" size={24} color={theme.colors.primary} />
					</RectButton>
				}
				placeholder={replyTo ? "Odgovori na komentar..." : "Komentiraj..."}
				value={commentText}
				onChangeText={setCommentText}
			/>
		</View>
	);
};

export default Comments;

const styles = StyleSheet.create({
	iconButton: {
		padding: 8,
		justifyContent: "center",
		alignItems: "center",
	},
});
