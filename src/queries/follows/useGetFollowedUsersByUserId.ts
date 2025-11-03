import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import type { Tables } from "@/src/types/database.types";

type FollowedUser = Tables<"users"> & { followedAt: string };

const useGetFollowedUsersByUserId = (userId: string) => {
	return useQuery<FollowedUser[]>({
		queryKey: ["followedUsers", userId],
		queryFn: async () => {
			const { data: followsData, error: followsError } = await supabase
				.from("follows")
				.select("following_id, created_at")
				.eq("follower_id", userId);

			if (followsError) {
				throw new Error(followsError.message);
			}

			if (!followsData || followsData.length === 0) {
				return [];
			}

			const followingIds = followsData.map(f => f.following_id);

			const { data: usersData, error: usersError } = await supabase
				.from("users")
				.select("*")
				.in("id", followingIds);

			if (usersError) {
				throw new Error(usersError.message);
			}

			// Map created_at to each user
			const followedUsers: FollowedUser[] = usersData.map(user => {
				const followData = followsData.find(f => f.following_id === user.id);
				return {
					...user,
					followedAt: followData?.created_at || "",
				};
			});

			return followedUsers;
		},
		enabled: !!userId,
	});
};

export { useGetFollowedUsersByUserId };