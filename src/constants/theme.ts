type FontWeight =
	| "100"
	| "200"
	| "300"
	| "400"
	| "500"
	| "600"
	| "700"
	| "800"
	| "900"
	| "normal"
	| "bold";

export const theme = {
	colors: {
		primary: "#ef4444",
		primaryLight: "#f87171",
		dark: "#3E3E3E",
		darkLight: "#E1E1E1",
		gray: "#e3e3e3",
		text: "#494949",
		textLight: "#7C7C7C",
		textDark: "#1D1D1D",
	},
	fonts: {
		medlum: "500" as FontWeight,
		semibold: "600" as FontWeight,
		bold: "700" as FontWeight,
		extraBold: "800" as FontWeight,
	},
	radius: {
		xs: 10,
		sm: 12,
		md: 14,
		lg: 16,
		xl: 18,
		xxl: 22,
	},
};
