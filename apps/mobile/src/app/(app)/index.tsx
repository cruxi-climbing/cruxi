import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { authClient } from "@/auth-client";

export default function Index() {
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Link href="/projects">Projects</Link>
			<Pressable onPress={() => authClient.signOut()}>
				<Text>Sign Out</Text>
			</Pressable>
		</View>
	);
}
