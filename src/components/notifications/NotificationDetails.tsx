import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/src/constants/theme";
import { useRelativeTime } from "@/src/hooks";
import { useMarkAsRead } from "@/src/queries/notifications";
import { useGetUser } from "@/src/queries/users";
import type { TNotificationWithUsers } from "@/src/types";
import { Avatar } from "../Avatar";

interface NotificationDetailsProps {
	item: TNotificationWithUsers;
	onPress?: () => void;
}

const NotificationDetails = ({ item, onPress }: NotificationDetailsProps) => {
	const formatRelativeTime = useRelativeTime();
	const { mutate: markAsRead } = useMarkAsRead();

	const followingId =
		typeof item.data === "object" &&
		item.data !== null &&
		"following_id" in item.data
			? ((item.data as { following_id?: string }).following_id ?? "")
			: "";
	const { data: user } = useGetUser(followingId);

	const getNotificationMessage = (
		notification: TNotificationWithUsers,
	): string => {
		switch (notification.type) {
			case "like":
				return "sviđa se tvoja objava";
			case "comment":
				return "komentira tvoju objavu";
			case "followed":
				return "te prati";
			case "unfollowed":
				return "te je prestao pratiti";
			case "you_followed":
				return "pratiš";
			default:
				return "poslao ti obavijest";
		}
	};

	const handlePress = () => {
		if (!item.is_read) {
			markAsRead(item.id);
		}
		if (item.post_id) {
			router.push({
				pathname: "/(modals)/post-view/[id]",
				params: { id: item.post_id },
			});
		} else if (item.type === "follow") {
			router.push({
				pathname: "/(modals)/profile-other/[id]",
				params: { id: item.actor_id },
			});
		}
		onPress?.();
	};

	return (
		<Pressable
			style={[
				styles.notificationContainer,
				!item.is_read && styles.unreadNotification,
			]}
			onPress={handlePress}
		>
			<Avatar path={item.users?.avatar} bucket="avatars" size="sm" />
			<View style={styles.contentContainer}>
				<Text style={styles.username}>{item.users?.name}</Text>
				<Text style={styles.message}>
					{getNotificationMessage(item)}{" "}
					{item.type === "you_followed" && user?.name}
				</Text>
				<Text style={styles.timestamp}>
					{formatRelativeTime(new Date(item.created_at))}
				</Text>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	notificationContainer: {
		flexDirection: "row",
		alignItems: "center",
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.neutral200,
		gap: 12,
	},
	unreadNotification: {
		backgroundColor: `${theme.colors.primaryLight}20`,
	},
	contentContainer: {
		flex: 1,
		gap: 4,
	},
	username: {
		fontSize: 14,
		fontWeight: "600",
		color: theme.colors.text,
	},
	message: {
		fontSize: 13,
		color: theme.colors.neutral500,
	},
	timestamp: {
		fontSize: 12,
		color: theme.colors.neutral400,
	},
});

export { NotificationDetails };
