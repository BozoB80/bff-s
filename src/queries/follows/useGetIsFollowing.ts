import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers";

const useGetIsFollowing = (targetId: string) => {
	const { user } = useAuth();

	return useQuery({
		queryKey: ["isFollowing", targetId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("follows")
				.select("id", {
					count: "exact",
				})
				.eq("follower_id", user?.id)
				.eq("following_id", targetId)
				.limit(1);

			if (error) {
				throw new Error(error.message);
			}

			return (data?.length ?? 0) > 0;
		},
		enabled: user?.id !== targetId,
	});
};

export { useGetIsFollowing };
