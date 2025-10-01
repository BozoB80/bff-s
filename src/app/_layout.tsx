import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<StatusBar barStyle={"light-content"} backgroundColor={"transparent"} />
			<Stack screenOptions={{ headerShown: false }} />
		</QueryClientProvider>
	);
}
