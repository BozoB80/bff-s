import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Header, NotificationDetails } from "@/src/components";
import { theme } from "@/src/constants/theme";
import { useRefreshOnFocus } from "@/src/hooks";
import { useAuth } from "@/src/providers";
import { useGetNotificationInfinite } from "@/src/queries/notifications";

const Notifications = () => {
	const { user: currentUser } = useAuth();
	const { data, fetchNextPage, hasNextPage, isFetching, isLoading, refetch } =
		useGetNotificationInfinite(currentUser?.id || null);

	useRefreshOnFocus(refetch);

	const allNotifications = data?.pages.flat() || [];

	if (isLoading) {
		return (
			<View style={styles.centerContainer}>
				<Header />
				<ActivityIndicator size="large" color={theme.colors.primary} />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Header />
			{allNotifications.length === 0 ? (
				<View style={styles.emptyContainer}>
					<Text style={styles.emptyText}>Nemate notifikacija</Text>
				</View>
			) : (
				<FlashList
					data={allNotifications}
					renderItem={({ item }) => <NotificationDetails item={item} />}
					keyExtractor={(item) => item.id}
					onEndReached={() => {
						if (hasNextPage && !isFetching) {
							fetchNextPage();
						}
					}}
					onEndReachedThreshold={0.5}
					ListFooterComponent={
						isFetching ? (
							<ActivityIndicator
								size="small"
								color={theme.colors.primary}
								style={styles.footerLoader}
							/>
						) : null
					}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.neutral50,
	},
	centerContainer: {
		flex: 1,
		backgroundColor: theme.colors.neutral50,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyText: {
		fontSize: 16,
		color: theme.colors.neutral400,
	},
	footerLoader: {
		paddingVertical: 16,
	},
});

export default Notifications;
