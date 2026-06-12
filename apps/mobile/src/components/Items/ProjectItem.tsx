import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/theme/theme";
import { BadgeGrade } from "./badge";

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

export function ProjectItem({ project }: Props) {
	return (
		<View style={styles.container}>
			<View>
				<BadgeGrade project={project}></BadgeGrade>
			</View>

			<View>
				<Text>{project.name}</Text>
				<Text style={styles.subTitle}>{project.sectorName}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "auto",
		backgroundColor: theme.colors.white,
		height: 84,
		padding: 16,
		marginBottom: 12,
		borderRadius: 22,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: 14,
	},
	title: {
		fontSize: 16,
	},
	subTitle: {
		fontSize: 14,
		color: theme.colors.subtitle,
	},
});
