import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import type { TablesInsert } from "@/src/types/database.types";

const useRemoveLike = (postId: number, userId: string) => {
	const queryClient = useQueryClient();

	return useMutation<TablesInsert<"likes">>({
		mutationFn: async () => {
			const { data, error } = await supabase
				.from("likes")
				.delete()
				.match({ post_id: postId, user_id: userId })
				.select()
				.single();

			if (error) throw error;

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["likeStatus", userId, postId],
			});
			queryClient.invalidateQueries({
				queryKey: ["posts"],
			});
			queryClient.invalidateQueries({
				queryKey: ["post", postId],
			});
		},
	});
};

export { useRemoveLike };
