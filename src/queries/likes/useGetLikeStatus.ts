import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";

const useGetLikeStatus = (
	postId: number,
	userId: string,
	enabled: boolean = false,
) => {
	return useQuery<boolean>({
		queryKey: ["likeStatus", userId, postId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("likes")
				.select("id")
				.eq("user_id", userId)
				.eq("post_id", postId)
				.limit(1);

			if (error) {
				throw new Error(error.message);
			}

			return data && data.length > 0;
		},
		enabled: enabled && !!userId,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};

export { useGetLikeStatus };
