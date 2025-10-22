import { Stack } from "expo-router";

const ModalsLayout = () => {
	return (
		<Stack>
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
		</Stack>
	);
};

export default ModalsLayout;
