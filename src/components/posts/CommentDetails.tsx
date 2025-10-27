import type { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { theme } from "@/src/constants/theme";
import { useRelativeTime } from "@/src/hooks";
import { useAuth } from "@/src/providers";
import { useDeleteComment } from "@/src/queries/comments/useDeleteComment";
import type { TCommentWithUser } from "@/src/types";
import type { Tables } from "@/src/types/database.types";
import { Avatar } from "../Avatar";
import { Button } from "../Button";
import { NativeSheet } from "../NativeSheet";

type TCommentDetailsProps = {
	comment: TCommentWithUser;
	onReply?: (parentId: number) => void;
	user: Tables<"users"> | null;
};

const CommentDetails = ({ comment, onReply, user }: TCommentDetailsProps) => {
	const commentRef = useRef<TrueSheet>(null);
	const deleteRef = useRef<TrueSheet>(null);

	const formatRelativeTime = useRelativeTime();
	const { user: currentUser } = useAuth();
	const { mutate: deleteComment } = useDeleteComment();

	const showOptions = comment.user_id === currentUser?.id;

	return (
		<View>
			<View style={styles.container}>
				<Avatar
					name={comment.users?.name}
					path={comment.users?.avatar}
					size="sm"
				/>
				<View style={{ flex: 1 }}>
					<View style={styles.topBar}>
						<View style={styles.nameContainer}>
							<Text style={{ fontWeight: theme.fonts.bold }}>
								{comment.users?.name}
							</Text>
							<Text>•</Text>
							<Text>
								{comment?.created_at
									? formatRelativeTime(new Date(comment.created_at))
									: ""}
							</Text>
						</View>
						{showOptions && (
							<Button
								iconName="more-vertical"
								variant="icon"
								onPress={() => commentRef.current?.present()}
							/>
						)}
					</View>
					<Text>{comment.body}</Text>
					{onReply && !comment.parent_id && (
						<RectButton
							onPress={() => onReply(comment.id)}
							style={styles.replyButton}
						>
							<Text style={styles.replyText}>Odgovori</Text>
						</RectButton>
					)}
				</View>
			</View>
			{comment.replies && comment.replies.length > 0 && (
				<View style={styles.repliesContainer}>
					{comment.replies.map((reply) => (
						<CommentDetails key={reply.id} comment={reply} user={user} />
					))}
				</View>
			)}
			<NativeSheet ref={commentRef} disableBackAction={true}>
				<Button
					variant="outline"
					iconName="edit-3"
					title="Uredi komentar"
					onPress={() => {
						commentRef.current?.dismiss();
					}}
				/>
				<Button
					iconName="trash-2"
					title="Izbriši komentar"
					onPress={() => deleteRef.current?.present()}
				/>
			</NativeSheet>
			<NativeSheet
				ref={deleteRef}
				title="Brisanje komentara"
				description="Jeste li sigurni da želite izbrisati ovaj komentar?"
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
						onPress={() => deleteComment(comment.id)}
					/>
				</View>
			</NativeSheet>
		</View>
	);
};

export default CommentDetails;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "flex-start",
		paddingVertical: 8,
		gap: 12,
	},
	topBar: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	nameContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	replyButton: {
		marginTop: 4,
		paddingVertical: 4,
		paddingHorizontal: 8,
	},
	replyText: {
		color: theme.colors.primary,
		fontSize: 14,
	},
	repliesContainer: {
		marginLeft: 36, // Indent replies
		marginTop: 8,
	},
});
