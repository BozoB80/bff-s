import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { memo, useCallback, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
} from "react-native";
import { TabBar, TabView } from "react-native-tab-view";
import { Avatar, Header, SupabaseImage } from "@/src/components";
import { Post } from "@/src/components/posts";
import { theme } from "@/src/constants/theme";
import { useGetPostsByUser } from "@/src/queries/posts";
import { useGetUser } from "@/src/queries/users";
import type { Tables } from "@/src/types/database.types";

const Info = memo(({ user }: { user: Tables<"users"> }) => (
	<View style={styles.container}>
		<ScrollView style={{ flex: 1 }}>
			{user.address && (
				<View>
					<Text style={styles.label}>Živim na adresi:</Text>
					<Text>{user.address}</Text>
				</View>
			)}
			{user.bio && (
				<View>
					<Text style={styles.label}>Nešto o meni:</Text>
					<Text>{user.bio}</Text>
				</View>
			)}
		</ScrollView>
	</View>
));

const Objave = memo(({ userId }: { userId: string }) => {
	const { data: posts } = useGetPostsByUser(userId);

	return (
		<ScrollView style={{ flex: 1 }}>
			{posts?.map((post) => (
				<Post key={post.id} postId={post.id} />
			))}
		</ScrollView>
	);
});

const routes: {
	key: string;
	title: string;
	icon: React.ComponentProps<typeof Feather>["name"];
}[] = [
	{ key: "info", title: "Info", icon: "info" },
	{ key: "objave", title: "Objave", icon: "grid" },
	{ key: "prijatelji", title: "Prijatelji", icon: "users" },
];

const OtherProfile = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const layout = useWindowDimensions();
	const [index, setIndex] = useState(0);

	const { data: userData } = useGetUser(id);

	const renderScene = useCallback(
		({ route }: { route: { key: string } }) => {
			switch (route.key) {
				case "info":
					return userData ? <Info user={userData} /> : null;
				case "objave":
					return <Objave userId={id} />;
				default:
					return null;
			}
		},
		[userData, id],
	);

	return (
		<View style={{ flex: 1 }}>
			<Header showBackButton />
			<View>
				<View style={styles.container}>
					<View style={styles.avatarContainer}>
						<View style={styles.avatarWrapper}>
							<Avatar
								name={userData?.name}
								path={userData?.avatar}
								bucket="avatars"
								size={120}
							/>
						</View>
					</View>
					<View style={styles.backgroundImageContainer}>
						{userData?.image && (
							<View style={styles.imageContainer}>
								{userData?.image ? (
									<SupabaseImage
										path={userData.image}
										style={styles.backgroundImage}
									/>
								) : null}
							</View>
						)}
					</View>
					<Text style={styles.userName}>{userData?.name}</Text>
				</View>
			</View>
			<View style={{ flex: 1 }}>
				<TabView
					navigationState={{ index, routes }}
					renderScene={renderScene}
					renderTabBar={(props) => (
						<TabBar
							contentContainerStyle={{
								backgroundColor: theme.colors.neutral50,
							}}
							indicatorStyle={{ backgroundColor: "white" }}
							activeColor={theme.colors.primary}
							inactiveColor={theme.colors.dark}
							pressColor={theme.colors.primaryLight}
							bounces
							tabStyle={{ flexDirection: "row", alignItems: "center" }}
							{...props}
						/>
					)}
					onIndexChange={setIndex}
					initialLayout={{ width: layout.width }}
					commonOptions={{
						icon: ({ route, color }) => (
							<Feather
								name={route.icon}
								color={color}
								size={18}
								style={{ marginBottom: 2 }}
							/>
						),
						labelStyle: {
							fontWeight: theme.fonts.bold,
						},
					}}
				/>
			</View>
		</View>
	);
};

export default OtherProfile;

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		gap: 16,
		padding: 16,
	},
	label: {
		fontSize: 16,
		fontWeight: theme.fonts.bold,
		marginBottom: 2,
	},
	avatarContainer: {
		position: "absolute",
		top: 140,
		left: 50,
		zIndex: 10,
	},
	avatarWrapper: {
		marginBottom: 8,
	},
	backgroundImageContainer: {
		marginBottom: 16,
		position: "relative",
	},
	imageContainer: {
		position: "relative",
	},
	backgroundImage: {
		width: "100%",
		height: 200,
		borderRadius: 10,
	},
	userName: {
		fontWeight: theme.fonts.bold,
		fontSize: 30,
		marginTop: 26,
	},
});
