import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";
import { orpc } from "@/query";

export default function Index() {
	const { data } = useQuery(
		orpc.example.queryOptions({ input: { name: "Test" } }),
	);
	return (
		<View style={styles.container}>
			<Text>Edit src/app/index.tsx to edit this screen.</Text>
			<Text>{data?.greeting}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});
