import type { TabTriggerSlotProps } from "expo-router/ui";
import { Pressable, StyleSheet, Text } from "react-native";

import { type TabIconName, TabIcons } from "./icons/TabIcons";

export type TabButtonProps = TabTriggerSlotProps & {
	icon: TabIconName;
	// ref: Ref<View>;
};
export function TabButton({
	icon,
	children,
	isFocused,
	...props
}: TabButtonProps) {
	// Je récupère le bon composant d’icône selon la valeur de icon
	const IconComponent = TabIcons[icon][isFocused ? "fill" : "outline"];

	return (
		<Pressable {...props} style={[styles.container]}>
			<IconComponent
				width={22}
				height={22}
				color={isFocused ? "#DC6955" : "#212121"}
			/>

			<Text style={[styles.label, isFocused && styles.labelFocused]}>
				{children}
			</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
		gap: 4,
		padding: 10,
		// backgroundColor: "black",
	},

	label: {
		fontSize: 12,
		color: "#999",
	},

	labelFocused: {
		color: "#DC6955",
		fontWeight: "500",
	},
});
