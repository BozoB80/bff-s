import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers";
import type { Tables } from "@/src/types/database.types";

const useGetFollowedUsers = () => {
	const { user } = useAuth();

	return useQuery<Tables<"users">[]>({
		queryKey: ["followedUsers", user?.id],
		queryFn: async () => {
			const { data: followsData, error: followsError } = await supabase
				.from("follows")
				.select("following_id")
				.eq("follower_id", user?.id);

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

			return usersData as Tables<"users">[];
		},
		enabled: !!user?.id,
	});
};

export { useGetFollowedUsers };