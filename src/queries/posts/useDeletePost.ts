import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";

const useDeletePost = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (postId: number) => {
			const { error } = await supabase.from("posts").delete().eq("id", postId);

			if (error) {
				throw new Error(error.message);
			}
		},
		onSuccess: () => {
			handleSuccess();
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});
};

export { useDeletePost };
