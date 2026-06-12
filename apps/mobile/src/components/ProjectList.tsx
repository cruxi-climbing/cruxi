import { useQuery } from "@tanstack/react-query";
import { FlatList } from "react-native";
import { orpc } from "@/query";
import { ProjectItem } from "./Items/ProjectItem";

export function ProjectList() {
	const { data: projects = [] } = useQuery(orpc.projects.list.queryOptions());
	return (
		<FlatList
			data={projects}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => <ProjectItem project={item} />}
		/>
	);
}
