import { useQuery } from "@tanstack/react-query";
import { FlatList, Text, View } from "react-native";
import { orpc } from "@/query";

export default function Projects() {
	const { data: projects = [], error } = useQuery(
		orpc.projects.list.queryOptions(),
	);

	if (error)
		console.log("Error fetching projects:", JSON.stringify(error, null, 2));

	return (
		<View
			style={{ flex: 1, paddingTop: 56, paddingLeft: 16, paddingRight: 16 }}
		>
			<Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12 }}>
				Mes projets
			</Text>
			<FlatList
				data={projects}
				keyExtractor={(project) => project.id.toString()}
				renderItem={({ item }) => (
					<Text style={{ marginBottom: 8 }}>
						{item.name} - {item.gradeIndex}
					</Text>
				)}
				ListEmptyComponent={<Text>No projects available.</Text>}
			/>
		</View>
	);
}
