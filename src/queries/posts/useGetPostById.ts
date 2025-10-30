import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import type { TPostWithUserAndComments } from "@/src/types";

const useGetPostById = (postId: number, includeComments = false) => {
	const queryClient = useQueryClient();

	return useQuery<TPostWithUserAndComments>({
		queryKey: ["postById", postId, includeComments],
		queryFn: async () => {
			let query = supabase.from("posts").select("*, users(*)").eq("id", postId);

			if (includeComments) {
				query = supabase
					.from("posts")
					.select("*, users(*), comments(*, users(*))")
					.eq("id", postId);
			}

			const { data, error } = await query.single();

			if (error) {
				throw error;
			} else {
				return data;
			}
		},
		initialData: () => {
			// Try to get the post from the main posts query cache
			const allPosts = queryClient.getQueryData<TPostWithUserAndComments[]>([
				"posts",
			]);
			if (allPosts) {
				return allPosts.find((post) => post.id === postId);
			}

			// Try to get from user posts cache
			const userPosts = queryClient.getQueryData<TPostWithUserAndComments[]>([
				"posts",
				"user",
			]);
			if (userPosts) {
				return userPosts.find((post) => post.id === postId);
			}

			return undefined;
		},
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};

export { useGetPostById };
