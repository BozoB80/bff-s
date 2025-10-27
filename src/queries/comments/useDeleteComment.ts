import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { supabase } from "@/src/lib/supabase";

const useDeleteComment = (postId?: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (commentId: number) => {
			const { error } = await supabase
				.from("comments")
				.delete()
				.eq("id", commentId);

			if (error) {
				throw new Error(error.message);
			}
		},
		onSuccess: () => {
			toast.success("Komentar je uspješno izbrisan.");
			queryClient.invalidateQueries({
				queryKey: ["posts"],
			});
			queryClient.invalidateQueries({
				queryKey: ["post", postId],
			});
		},
	});
};

export { useDeleteComment };
