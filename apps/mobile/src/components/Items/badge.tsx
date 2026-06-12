import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/theme/theme";

type Project = {
	id: string;
	name: string;
	gradeIndex: number;
	sectorId: string;
	sectorName: string;
};

type Props = {
	project: Project;
};
export function BadgeGrade({ project }: Props) {
	return (
		<View style={styles.container}>
			<Text style={styles.label}>{project.gradeIndex}</Text>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: theme.colors.lightGrey,
		height: 35,
		width: 37,
		borderRadius: 42,
	},
	label: {
		fontSize: 14,
	},
});
