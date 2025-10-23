import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import type { TPostWithUserAndComments } from "@/src/types";

const useGetPosts = () => {
	return useQuery<TPostWithUserAndComments[]>({
		queryKey: ["posts"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("posts")
				.select("*, users(*), comments(*, users(*))")
				.order("created_at", { ascending: false });

			if (error) {
				throw new Error(error.message);
			}

			return data as TPostWithUserAndComments[];
		},
		initialData: [],
	});
};

export { useGetPosts };
