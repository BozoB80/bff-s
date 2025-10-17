import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";

const useGetPostById = (postId: number) => {
	return useQuery({
		queryKey: ["postById"],
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
