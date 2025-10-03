import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";

const useGetUser = (userId: string) => {
	return useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("users")
				.select("*")
				.eq("id", userId)
				.single();

			if (error) {
				return { success: false, msg: error.message };
			}

			return data;
		},
		placeholderData: keepPreviousData,
	});
};

export { useGetUser };
