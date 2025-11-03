import { Stack } from "expo-router";

const ModalsLayout = () => {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				presentation: "modal",
			}}
		>
			<Stack.Screen
				name="profile-other/[id]"
				options={{
					headerTitle: "Profil",
					headerBackTitle: "Nazad",
					presentation: "modal",
					animation: "slide_from_bottom",
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="post-view/[id]"
				options={{
					headerTitle: "Objava",
					headerBackTitle: "Nazad",
					presentation: "modal",
					animation: "slide_from_bottom",
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="followed-users/followed"
				options={{
					presentation: "modal",
					animation: "slide_from_bottom",
				}}
			/>
		</Stack>
	);
};

export default ModalsLayout;
