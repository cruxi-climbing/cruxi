export const ascentStyles = [
	"onsight",
	"flash",
	"redpoint",
	"top_rope",
	"send",
] as const;

export type AscentStyle = (typeof ascentStyles)[number];
