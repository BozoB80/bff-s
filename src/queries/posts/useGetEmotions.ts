import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import type { Tables } from "@/src/types/database.types";

const useGetEmotions = () => {
	return useQuery<Tables<"emotions">[]>({
		queryKey: ["emotions"],
		queryFn: async () => {
			const { data, error } = await supabase.from("emotions").select("*");

			if (error) {
				throw new Error(error.message);
			}

			return data;
		},
	});
};

export { useGetEmotions };
