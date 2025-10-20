import { Stack } from "expo-router";

const UserLayout = () => {
	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen
				name="post/[id]"
				options={{
					headerTitle: "Uredi objavu",
					headerBackTitle: "Nazad",
					presentation: "modal",
					animation: "slide_from_bottom",
				}}
			/>
		</Stack>
	);
};

export default UserLayout;
