import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Header, Post } from "@/src/components";
import Comments from "@/src/components/posts/Comments";
import { useAuth } from "@/src/providers";
import { useGetPostById } from "@/src/queries/posts";

const ViewPost = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data: post } = useGetPostById(Number(id));
	const { user: currentUser } = useAuth();

	return (
		<View style={{ flex: 1 }}>
			<Header showBackButton />
			{post && <Post post={post} />}
			{post && (
				<Comments
					data={post}
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
