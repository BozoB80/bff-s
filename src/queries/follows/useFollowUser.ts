import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers";
import type { TablesInsert } from "@/src/types/database.types";

const useFollowUser = (targetId: string) => {
	const { user } = useAuth();
	const queryClient = useQueryClient();

	return useMutation<TablesInsert<"follows">>({
		mutationFn: async () => {
			const { data, error } = await supabase
				.from("follows")
				.insert([{ follower_id: user?.id, following_id: targetId }])
				.select();

			if (error) {
				throw new Error(error.message);
			}

			return data?.[0] as TablesInsert<"follows">;
		},
		onSuccess: () => {
			toast.success("Sada pratiš ovog korisnika!");
			queryClient.invalidateQueries({ queryKey: ["isFollowing", targetId] });
		},
	});
};

export { useFollowUser };
