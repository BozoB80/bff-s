import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { supabase } from "@/src/lib/supabase";
import type { Tables } from "@/src/types/database.types";

const useUpdateUser = (userId: string) => {
	return useMutation({
		mutationFn: async (data: Partial<Tables<"users">>) => {
			const { error } = await supabase
				.from("users")
				.update(data)
				.eq("id", userId)
				.select();

			if (error) {
				return { success: false, msg: error.message };
			}

			return { success: true, data };
		},
		onSuccess: () => toast.success("Profil ažuriran!"),
	});
};

export { useUpdateUser };
