import { theme } from "@/src/constants/theme";
import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabsLayout = () => {
	const insets = useSafeAreaInsets();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: theme.colors.primary,
				tabBarInactiveTintColor: "#657786",
				tabBarStyle: {
					backgroundColor: "#fff",
					borderTopWidth: 1,
					borderTopColor: "#E1E8ED",
					height: 50 + insets.bottom,
					paddingTop: 6,
				},
				headerShown: false,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "",
					tabBarIcon: ({ color, size }) => (
						<Feather name="home" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="search"
				options={{
					title: "",
					tabBarIcon: ({ color, size }) => (
						<Feather name="search" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="messages"
				options={{
					title: "",
					tabBarIcon: ({ color, size }) => (
						<Feather name="mail" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "",
					tabBarIcon: ({ color, size }) => (
						<Feather name="user" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
};

export default TabsLayout;
