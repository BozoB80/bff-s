import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import type { Tables } from "@/src/types/database.types";

const useGetPostsByUser = (userId: string) => {
	return useQuery<Tables<"posts">[]>({
		queryKey: ["posts", "user", userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("posts")
				.select("*")
				.eq("userId", userId)
				.order("created_at", { ascending: false });

			if (error) {
				throw new Error(error.message);
			}

			return data;
		},
		enabled: !!userId,
		initialData: [],
	});
};

export { useGetPostsByUser };
