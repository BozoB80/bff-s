import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers";
import type { TablesInsert } from "@/src/types/database.types";

const useUnfollowUser = (targetId: string) => {
	const { user } = useAuth();
	const queryClient = useQueryClient();

	return useMutation<TablesInsert<"follows">>({
		mutationFn: async () => {
			const { data, error } = await supabase
				.from("follows")
				.delete()
				.eq("follower_id", user?.id)
				.eq("following_id", targetId)
				.select();

			if (error) {
				throw new Error(error.message);
			}

			return data?.[0] as TablesInsert<"follows">;
		},
		onSuccess: () => {
			toast.success("Više ne pratiš ovog korisnika!");
			queryClient.invalidateQueries({ queryKey: ["isFollowing", targetId] });
		},
	});
};

export { useUnfollowUser };
