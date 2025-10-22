import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import type { Tables } from "@/src/types/database.types";

const useGetPostById = (postId: number) => {
	return useQuery<Tables<"posts">>({
		queryKey: ["postById", postId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("posts")
				.select("*")
				.eq("id", postId)
				.single();

			if (error) {
				throw error;
			} else {
				return data;
			}
		},
	});
};

export { useGetPostById };
