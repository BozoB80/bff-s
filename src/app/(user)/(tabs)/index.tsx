import { FlatList, Text, View } from "react-native";
import { Header, Post } from "@/src/components";
import { useRefreshOnFocus } from "@/src/hooks";
import { useGetPosts } from "@/src/queries/posts";

const Home = () => {
	const { data: posts, refetch } = useGetPosts();

	useRefreshOnFocus(refetch);

	return (
		<View>
			<Header />
			<FlatList
				data={posts}
				renderItem={({ item }) => (
					<Post
						key={item.id}
						image={item.image ?? ""}
						title={item.title ?? ""}
						description={item.description ?? ""}
						userId={item.userId ?? ""}
						createdAt={item.created_at ?? undefined}
					/>
				)}
				contentContainerStyle={{ gap: 4 }}
				ListEmptyComponent={() => <Text>Nema objava</Text>}
			/>
		</View>
	);
};

export default Home;
