import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import type { TPostWithUserAndComments } from "@/src/types";

const useGetPostsByUser = (userId: string) => {
	return useQuery<TPostWithUserAndComments[]>({
		queryKey: ["posts", "user", userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("posts")
				.select("*, users(*), comments(*, users(*))")
				.eq("user_id", userId)
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
