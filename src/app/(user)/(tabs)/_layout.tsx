import { Ionicons } from "@expo/vector-icons"; // Changed from Feather to Ionicons
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "@/src/constants/theme";

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
					height: 55 + insets.bottom,
					paddingTop: 6,
				},
				headerShown: false,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "",
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons
							name={focused ? "home" : "home-outline"}
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="search"
				options={{
					title: "",
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons
							name={focused ? "search" : "search-outline"}
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="create"
				options={{
					title: "",
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons
							name={focused ? "add-circle" : "add-circle-outline"}
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="messages"
				options={{
					title: "",
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons
							name={focused ? "mail" : "mail-outline"}
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "",
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons
							name={focused ? "person" : "person-outline"}
							size={size}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
};

export default TabsLayout;
