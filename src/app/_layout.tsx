import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { Toaster } from "sonner-native";

export default function RootLayout() {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<Toaster />
			<StatusBar barStyle={"light-content"} backgroundColor={"transparent"} />
			<Stack screenOptions={{ headerShown: false }} />
		</QueryClientProvider>
	);
}
