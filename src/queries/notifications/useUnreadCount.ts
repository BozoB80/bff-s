import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/src/lib/supabase";

async function fetchUnreadCount(userId: string) {
	const { count, error } = await supabase
		.from("notifications")
		.select("id", { count: "exact", head: true })
		.eq("user_id", userId)
		.eq("is_read", false);

	if (error) throw error;
	return count ?? 0;
}

export function useUnreadCount(userId: string | null) {
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: ["notifications", "unreadCount", userId],
		queryFn: async () => {
			if (!userId) return 0;
			return fetchUnreadCount(userId);
		},
		enabled: !!userId,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		if (!userId) return;

		const channel = supabase.channel(`user:${userId}:notifications`, {
			config: { private: true },
		});

		// Expect your triggers/broadcast to send proper events; we respond to insert/update
		channel.on("broadcast", { event: "INSERT" }, () => {
			// new notification created -> increment unread count optimistically
			queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
			queryClient.invalidateQueries({ queryKey: ["unreadCount", userId] });
		});

		channel.on("broadcast", { event: "UPDATE" }, (payload) => {
			// if notification was marked read -> invalidate
			// payload should contain new row with is_read flag if your broadcast includes it
			queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
		});

		channel.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [userId, queryClient]);

	return {
		...query,
		unreadCount: query.data ?? 0,
	};
}
