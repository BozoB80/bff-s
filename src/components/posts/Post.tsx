import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useRelativeTime } from "@/src/hooks";
import { useGetUser } from "@/src/queries/users";
import { Button } from "../Button";
import { SupabaseImage } from "../SupabaseImage";
import { Avatar } from "../ui";

type PostProps = {
	image?: string;
	title?: string;
	description?: string;
	userId?: string;
	createdAt?: string;
};

const Post = ({ image, title, description, userId, createdAt }: PostProps) => {
	const { data: user } = useGetUser(userId ?? "");
	const formatRelativeTime = useRelativeTime();

	return (
		<View style={styles.container}>
			{user && (
				<View style={styles.userContainer}>
					<Avatar src={user.avatar ?? ""} />
					<View>
						<Text style={styles.userName}>{user.name}</Text>
						<Text>
							{createdAt ? formatRelativeTime(new Date(createdAt)) : ""}
						</Text>
					</View>
					<Feather name="edit" style={{ marginLeft: "auto" }} />
				</View>
			)}

			<Text style={styles.title}>{title}</Text>
			<Text>{description}</Text>
			{image && <SupabaseImage path={image} style={styles.image} />}
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
