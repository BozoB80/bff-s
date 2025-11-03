import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Avatar, Header } from "@/src/components";
import { theme } from "@/src/constants/theme";
import { useGetFollowedUsers } from "@/src/queries/follows";

const FollowedUsers = () => {
	const { data: followedUsers } = useGetFollowedUsers();

	return (
		<View style={{ flex: 1 }}>
			<Header showBackButton />
			<ScrollView style={{ flex: 1 }}>
				<View style={styles.container}>
					<Text style={styles.title}>Korisnici koje pratim</Text>
					{followedUsers?.map((user) => (
						<Link key={user.id} href={`/profile-other/${user.id}`} asChild>
							<Pressable style={styles.userItem}>
								<Avatar
									name={user.name}
									path={user.avatar}
									bucket="avatars"
									size={50}
								/>
								<View style={styles.userInfo}>
									<Text style={styles.userName}>{user.name}</Text>
									{user.bio && <Text style={styles.userBio}>{user.bio}</Text>}
								</View>
							</Pressable>
						</Link>
					))}
					{followedUsers?.length === 0 && (
						<Text style={styles.noUsers}>Ne pratite nikoga</Text>
					)}
				</View>
			</ScrollView>
		</View>
	);
};

export default FollowedUsers;

const styles = StyleSheet.create({
	container: {
		padding: 16,
	},
	title: {
		fontSize: 20,
		fontWeight: theme.fonts.bold,
		marginBottom: 16,
		textAlign: "center",
	},
	userItem: {
		flexDirection: "row",
		alignItems: "center",
		padding: 12,
		backgroundColor: theme.colors.neutral50,
		borderRadius: 8,
		marginBottom: 8,
	},
	userInfo: {
		marginLeft: 12,
		flex: 1,
	},
	userName: {
		fontWeight: theme.fonts.bold,
		fontSize: 16,
	},
	userBio: {
		fontSize: 14,
		color: theme.colors.dark,
		marginTop: 2,
	},
	noUsers: {
		textAlign: "center",
		fontSize: 16,
		color: theme.colors.dark,
		marginTop: 20,
	},
});
