import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";

const useLoginUser = (handleOnSuccess: () => void) => {
	return useMutation({
		mutationFn: async ({
			email,
			password,
		}: {
			email: string;
			password: string;
		}) => {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				throw error;
			}

			return data;
		},
		onSuccess: handleOnSuccess,
	});
};

export { useLoginUser };
