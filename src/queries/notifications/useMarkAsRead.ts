import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers";

const useMarkAsRead = () => {
	const { user: currentUser } = useAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (notificationId: number | string) => {
			if (!currentUser?.id) throw new Error("No authenticated user");

			const { error } = await supabase.rpc("mark_notification_read", {
				_notification_id: notificationId,
				_current_user: currentUser?.id,
			});

			if (error) throw error;

			return;
		},
		onMutate: async (notificationId) => {
			// Optimistically update the notifications cache
			await queryClient.cancelQueries({
				queryKey: ["notifications", "infinite", currentUser?.id],
			});

			const previousData = queryClient.getQueryData([
				"notifications",
				"infinite",
				currentUser?.id,
			]);

			// Update cache optimistically
			queryClient.setQueryData(
				["notifications", "infinite", currentUser?.id],
				(old: unknown) => {
					if (!old) return old;
					const oldData = old as {
						pages: Array<Array<Record<string, unknown>>>;
					};
					return {
						...oldData,
						pages: oldData.pages.map((page) =>
							page.map((notification) =>
								notification.id === notificationId
									? { ...notification, is_read: true }
									: notification,
							),
						),
					};
				},
			);

			// Update unread count
			queryClient.setQueryData(
				["notifications", "unreadCount", currentUser?.id],
				(old: unknown) => {
					const count = (old as number) || 0;
					return count > 0 ? count - 1 : 0;
				},
			);

			return { previousData };
		},
		onError: (_err, _variables, context) => {
			// Rollback on error
			if (context?.previousData) {
				queryClient.setQueryData(
					["notifications", "infinite", currentUser?.id],
					context.previousData,
				);
			}
		},
	});
};

export { useMarkAsRead };
