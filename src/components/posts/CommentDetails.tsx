import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/src/constants/theme";
import { useRelativeTime } from "@/src/hooks";
import type { TCommentWithUser } from "@/src/types";
import { Avatar } from "../Avatar";

type TCommentDetailsProps = {
	comment: TCommentWithUser;
};

const CommentDetails = ({ comment }: TCommentDetailsProps) => {
	const formatRelativeTime = useRelativeTime();

	return (
		<View style={styles.container}>
			<Avatar
				name={comment.users?.name}
				path={comment.users?.avatar}
				size="sm"
			/>
			<View>
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
				<Text>{comment.body}</Text>
			</View>
		</View>
	);
};

export default CommentDetails;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
		gap: 12,
	},
	nameContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
});
