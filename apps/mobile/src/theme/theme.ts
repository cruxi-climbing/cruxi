export const COLORS = {
	background: "#FFFBF4",
	subtitle: "#9C9C9C",
	yellow: "#F8C360",
	yellowDarken: "#FFB933",
	peach: "#DC6955",
	green: "#93CFAD",
	black: "#212121",
	white: "#ffffff",
	buttonGrey: "#EFEFEF",
	lightGrey: "#F6F6F6",
	linearGradientBot: "rgba(255, 255, 255, 0.88)",
	linearGradientTop: "rgba(255,255,255,0)",
} as const;

export const FONTS = {
	h1: "PlusJakartaSans",
	h2: "PlusJakartaSans",
	body: "Figtree",
	subtitle: "Figtree",
	button: "Figtree",
} as const;

export const SIZES = {
	h1: 32,
	h2: 24,
	body: 14,
	subtitle: 14,
	button: 16,
} as const;

// Objet global combiné
export const theme = {
	colors: COLORS,
	fonts: FONTS,
	sizes: SIZES,
} as const;

export type Theme = typeof theme;
export type ColorType = keyof typeof COLORS;
export type FontType = keyof typeof FONTS;
export type SizeType = keyof typeof SIZES;
