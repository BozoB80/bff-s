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
		dark: "#2f2e2eff",
		darkLight: "#E1E1E1",
		gray: "#e3e3e3",
		text: "#292524",
		white: "#fff",
		black: "#000",
		textDark: "#161616ff",
		neutral50: "#fafaf9",
		neutral100: "#f5f5f4",
		neutral200: "#e7e5e4",
		neutral300: "#d6d3d1",
		neutral350: "#CCCCCC",
		neutral400: "#a8a29e",
		neutral500: "#78716c",
		neutral600: "#57534e",
		neutral700: "#44403c",
		neutral800: "#292524",
		neutral900: "#1c1917",
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
