import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
//import { toast } from "sonner-native";
import { supabase } from "@/src/lib/supabase";

const useLoginUser = (email: string, password: string) => {
	return useMutation({
		mutationFn: async () => {
			const { error } = await supabase.auth.signInWithPassword({
				email: email,
				password: password,
			});

			if (!email || !password) {
				Alert.alert("Greška", "Molimo popunite sva polja");
			}

			if (error) Alert.alert(error.message);
		},
		//onSuccess: () => toast.success("Uspješna prijava!"),
	});
};

export { useLoginUser };
