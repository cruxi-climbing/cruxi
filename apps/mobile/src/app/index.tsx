import { Link } from "expo-router";
import { Button, StyleSheet, View } from "react-native";

export default function Index() {
	return (
		<View style={styles.container}>
			<Link href="/sign-in" asChild>
				<Button title="Sign In" />
			</Link>
			<Link href="/sign-up" asChild>
				<Button title="Sign Up" />
			</Link>
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
