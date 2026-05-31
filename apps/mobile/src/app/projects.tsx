import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/query";

export default function Projects() {
	const { data: projects = [] } = useQuery(
		orpc.users.me.projects.queryOptions(),
	);

	return (
		<div>
			<h1>Projects</h1>
			<ul>
				{projects.map((project) => (
					<li key={project.id}>
						{project.name} - {project.gradeIndex}
					</li>
				))}
			</ul>
		</div>
	);
}
