import { FlatList, Text, View } from "react-native";
import { Header } from "@/src/components";
import { useGetPosts } from "@/src/queries/posts";

const Home = () => {
	const { data: posts } = useGetPosts();

	console.log(posts);

	return (
		<View>
			<Header />
			<FlatList
				data={posts}
				renderItem={({ item }) => (
					<View>
						<Text>{item.title}</Text>
						<Text>{item.description}</Text>
					</View>
				)}
				ListEmptyComponent={() => <Text>Nema objava</Text>}
			/>
		</View>
	);
};

export default Home;
