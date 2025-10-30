import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Header, Post } from "@/src/components";
import Comments from "@/src/components/posts/Comments";
import { useAuth } from "@/src/providers";
import { useGetPostById } from "@/src/queries/posts";

const ViewPost = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [shouldLoadComments, setShouldLoadComments] = useState(false);

	// First load: get post without comments for faster modal animation
	const { data: post } = useGetPostById(Number(id), false);

	// Second load: get comments after a short delay to avoid blocking animation
	const { data: postWithComments } = useGetPostById(
		Number(id),
		shouldLoadComments,
	);

	const { user: currentUser } = useAuth();

	// Defer loading comments until after modal animation (300ms typical)
	useEffect(() => {
		const timer = setTimeout(() => {
			setShouldLoadComments(true);
		}, 300);

		return () => clearTimeout(timer);
	}, []);

	// Use the post with comments if loaded, otherwise use the basic post
	const displayPost = postWithComments || post;

	return (
		<View style={{ flex: 1 }}>
			<Header showBackButton />
			{displayPost && <Post post={displayPost} />}
			{displayPost && (
				<Comments
					data={displayPost}
					user={currentUser}
					containerStyle={{
						paddingHorizontal: 16,
						paddingBottom: 16,
					}}
				/>
			)}
		</View>
	);
};

export default ViewPost;
