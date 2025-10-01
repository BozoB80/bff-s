import { ImageBackground } from "expo-image";
import {
	Dimensions,
	Platform,
	StatusBar,
	View,
	type ViewStyle,
} from "react-native";
import { theme } from "../constants/theme";

type ScreenWrapperProps = {
	style?: ViewStyle;
	children: React.ReactNode;
	isModal?: boolean;
	showPattern?: boolean;
	bgOpacity?: number;
};

const { height } = Dimensions.get("window");

const ScreenWrapper = ({
	style,
	children,
	bgOpacity,
	isModal,
	showPattern,
}: ScreenWrapperProps) => {
	let paddingTop = Platform.OS === "ios" ? height * 0.06 : 40;
	let paddingBottom = 0;

	if (isModal) {
		paddingTop = Platform.OS === "ios" ? height * 0.02 : 45;
		paddingBottom = height * 0.02;
	}

	return (
		<ImageBackground
			style={{
				flex: 1,
				backgroundColor: isModal ? theme.colors.white : theme.colors.neutral100,
				padding: 10,
			}}
			imageStyle={{ opacity: showPattern ? bgOpacity : 0 }}
			source={require("@/assets/images/background.png")}
		>
			<View style={[{ paddingTop, paddingBottom, flex: 1 }, style]}>
				<StatusBar barStyle={"light-content"} backgroundColor={"transparent"} />
				{children}
			</View>
		</ImageBackground>
	);
};

export { ScreenWrapper };
