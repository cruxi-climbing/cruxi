import { useState } from "react";
import { Button, TextInput, View } from "react-native";
import { authClient } from "@/auth-client";

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async () => {
		try {
			const result = await authClient.signIn.email({
				email,
				password,
			});
			console.log("Login successful:", result);
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	return (
		<View>
			<TextInput placeholder="Email" value={email} onChangeText={setEmail} />
			<TextInput
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
			/>
			<Button title="Login" onPress={handleLogin} />
		</View>
	);
}
