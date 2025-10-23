import { FontAwesome } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { theme } from "@/src/constants/theme";
import { useAddComment } from "@/src/queries/comments";
import type { TPostWithUserAndComments } from "@/src/types";
import type { Tables } from "@/src/types/database.types";
import { Input } from "../Input";
import CommentDetails from "./CommentDetails";

type TCommentsProps = {
	data: TPostWithUserAndComments;
	user: Tables<"users"> | null;
};

const Comments = ({ data, user }: TCommentsProps) => {
	const [commentText, setCommentText] = useState("");
	const { mutate: addComment } = useAddComment(data.id);

	const onSubmitComment = (body: string) => {
		addComment({
			post_id: data.id,
			user_id: user?.id || "",
			body,
		});
		setCommentText("");
	};

	return (
		<View>
			<FlashList
				data={data.comments}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => <CommentDetails comment={item} />}
			/>
			<Input
				iconRight={
					<FontAwesome
						name="send"
						size={24}
						color={theme.colors.primary}
						onPress={() => onSubmitComment(commentText)}
					/>
				}
				placeholder="Komentiraj..."
				value={commentText}
				onChangeText={setCommentText}
			/>
		</View>
	);
};

export default Comments;

const styles = StyleSheet.create({});
