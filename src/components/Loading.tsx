import { ActivityIndicator, View } from "react-native";
import { theme } from "../constants/theme";

type LoadingProps = {
	size?: "small" | "large" | number;
	color?: string;
};

const Loading = ({
	size = "large",
	color = theme.colors.primary,
}: LoadingProps) => {
	return (
		<View style={{ justifyContent: "center", alignItems: "center" }}>
			<ActivityIndicator size={size} color={color} />
		</View>
	);
};

export default Loading;
