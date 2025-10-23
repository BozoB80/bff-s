import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import type { Tables } from "@/src/types/database.types";

export type PostWithUser = Tables<"posts"> & {
	users: Tables<"users"> | null;
};

const useGetPostsByUser = (userId: string) => {
	return useQuery<PostWithUser[]>({
		queryKey: ["posts", "user", userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("posts")
				.select("*, users(*)")
				.eq("userId", userId)
				.order("created_at", { ascending: false });

			if (error) {
				throw new Error(error.message);
			}

			return data as PostWithUser[];
		},
		enabled: !!userId,
		initialData: [],
	});
};

export { useGetPostsByUser };
