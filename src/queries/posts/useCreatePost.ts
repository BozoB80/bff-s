import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import type { TablesInsert } from "../../types/database.types";

const useCreatePost = (handleOnSuccess: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (body: TablesInsert<"posts">) => {
			const { data, error } = await supabase
				.from("posts")
				.insert(body)
				.select();

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

export { useCreatePost };
