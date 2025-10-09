import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import type { Tables } from "@/src/types/database.types";

const useGetPosts = () => {
	return useQuery<Tables<"posts">[]>({
		queryKey: ["posts"],
		queryFn: async () => {
			const { data, error } = await supabase.from("posts").select("*");

			if (error) {
				throw new Error(error.message);
			}

			return data;
		},
		initialData: [],
	});
};

export { useGetPosts };
