import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import type { TNotificationWithUsers } from "@/src/types";

export const fetchNotifications = async (
	{ limit = 10, offset = 0 }: { limit?: number; offset?: number },
	userId: string,
) => {
	const { data, error } = await supabase
		.from("notifications")
		.select(
			`*,
			users!actor_id (id, name, avatar)
		`,
		)
		.eq("user_id", userId)
		.order("created_at", { ascending: false })
		.range(offset, offset + limit - 1);

	if (error) {
		throw error;
	} else {
		return data as TNotificationWithUsers[];
	}
};

const useGetNotificationInfinite = (userId: string | null) => {
	return useInfiniteQuery<TNotificationWithUsers[], Error>({
		queryKey: ["notifications", "infinite", userId],
		queryFn: ({ pageParam }) => {
			if (!userId) return Promise.resolve([]);
			return fetchNotifications(
				pageParam as { limit?: number; offset?: number },
				userId,
			);
		},
		initialPageParam: { limit: 10, offset: 0 },
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length < 10) {
				return undefined;
			}
			return {
				limit: 10,
				offset: allPages.length * 10,
			};
		},
		enabled: !!userId,
	});
};

export { useGetNotificationInfinite };
