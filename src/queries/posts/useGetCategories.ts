import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";

const useGetCategories = () => {
	return useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("categories")
				.select("*")
				.order("name", { ascending: true });

			if (error) {
				return error.message;
			}

			return data;
		},
	});
};

export { useGetCategories };
