import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import type { TablesUpdate } from "@/src/types/database.types";

const useUpdatePost = (handleOnSuccess: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			postId,
			postDetails,
		}: {
			postId: number;
			postDetails: TablesUpdate<"posts">;
		}) => {
			const { data, error } = await supabase
				.from("posts")
				.update(postDetails)
				.eq("id", postId)
				.select()
				.single();

			if (error) {
				throw new Error(error.message);
			}

			return data;
		},
		onSuccess: () => {
			handleOnSuccess();
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});
};

export { useUpdatePost };
