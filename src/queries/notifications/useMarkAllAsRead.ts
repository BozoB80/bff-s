import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers";

const useMarkAllAsRead = () => {
	const { user: currentUser } = useAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			if (!currentUser?.id) throw new Error("No authenticated user");
			const { error } = await supabase.rpc("mark_all_notifications_read", {
				_current_user: currentUser.id,
			});

			if (error) throw error;

			return;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["notifications", "infinite", currentUser?.id],
			});
			queryClient.invalidateQueries({
				queryKey: ["notifications", "unreadCount", currentUser?.id],
			});
		},
	});
};

export { useMarkAllAsRead };
