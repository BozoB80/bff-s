import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import type { TablesInsert } from "../../types/database.types";

const useCreatePost = (onSuccess: () => void) => {
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
		onSuccess,
	});
};

export { useCreatePost };
