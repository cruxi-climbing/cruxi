import { Pressable, Text, View } from "react-native";
import { authClient } from "@/auth-client";

export default function Profile() {
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Pressable onPress={() => authClient.signOut()}>
				<Text>Sign Out</Text>
			</Pressable>
		</View>
	);
}
