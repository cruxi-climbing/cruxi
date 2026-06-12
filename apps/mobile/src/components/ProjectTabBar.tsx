import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/theme/theme";

export const projectTabs = ["À faire", "En cours", "Croix"] as const;
export type ProjectTab = (typeof projectTabs)[number];

type Props = {
	activeTab: string;
	onChange: (tab: ProjectTab, index: number) => void;
};

export function ProjectTabBar({ activeTab, onChange }: Props) {
	return (
		<View style={styles.container}>
			{projectTabs.map((tab, index) => {
				const isFocused = activeTab === tab;

				return (
					<Pressable
						key={tab}
						onPress={() => onChange(tab, index)}
						style={[styles.tab, isFocused && styles.activeTab]}
					>
						<Text style={[styles.label, isFocused && styles.activeLabel]}>
							{tab}
						</Text>
					</Pressable>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 16,
		height: 66,
		padding: 4,
		gap: 10,
	},

	tab: {
		backgroundColor: theme.colors.white,
		flex: 1,
		height: 38,
		padding: 8,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 20,
	},

	activeTab: {
		backgroundColor: theme.colors.peach,
	},

	label: {
		color: theme.colors.black,
		fontSize: theme.sizes.subtitle,
	},

	activeLabel: {
		color: theme.colors.white,
	},
});
