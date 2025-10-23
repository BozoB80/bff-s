import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { supabase } from "@/src/lib/supabase";
import type { TablesInsert } from "@/src/types/database.types";

interface AddCommentParams {
	post_id: number;
	user_id: string;
	body: string;
	parent_id?: number | null;
}

const useAddComment = (postId: number) => {
	const queryClient = useQueryClient();

	return useMutation<TablesInsert<"comments">, Error, AddCommentParams>({
		mutationFn: async (params) => {
			const { data, error } = await supabase
				.from("comments")
				.insert({
					body: params.body,
					post_id: params.post_id,
					user_id: params.user_id,
					parent_id: params.parent_id || null,
				})
				.select()
				.single();

			if (error) throw error;

			return data;
		},
		onSuccess: () => {
			toast.success("Komentar je uspješno dodan.");
			queryClient.invalidateQueries({
				queryKey: ["posts"],
			});
			queryClient.invalidateQueries({
				queryKey: ["post", postId],
			});
		},
	});
};

export { useAddComment };
