import { useState } from "react";
import { Button, TextInput, View } from "react-native";
import { authClient } from "@/auth-client";

export default function SignUp() {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async () => {
		try {
			const response = await authClient.signUp.email({
				email,
				password,
				name,
			});
			console.log("Sign up successful:", response);
		} catch (e) {
			console.error("Sign up failed:", e);
		}
	};

	return (
		<View>
			<TextInput placeholder="Name" value={name} onChangeText={setName} />
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
