import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers";

const UserLayout = () => {
	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
		</Stack>
	);
};

export default UserLayout;
