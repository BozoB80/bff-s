import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, ToastProvider } from "../providers";

export default function RootLayout() {
	const queryClient = new QueryClient();

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<AuthProvider>
				<ToastProvider>
					<QueryClientProvider client={queryClient}>
						<StatusBar
							barStyle={"light-content"}
							backgroundColor={"transparent"}
						/>
						<Stack screenOptions={{ headerShown: false }} />
					</QueryClientProvider>
				</ToastProvider>
			</AuthProvider>
		</GestureHandlerRootView>
	);
}
