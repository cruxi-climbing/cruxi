import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { authClient } from "@/auth-client";

export default function SignUp() {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");

	const { mutateAsync, error } = useMutation({
		mutationKey: ["signUp"],
		mutationFn: async () => {
			const result = await authClient.signUp.email({
				email,
				password,
				name,
			});
			return result;
		},
		onSuccess: (response) => {
			if (response.error) throw response.error;

			router.replace("/projects");
		},
	});

	const handleSignUp = async () => {
		await mutateAsync();
	};

	return (
		<View>
			<TextInput placeholder="Name" value={name} onChangeText={setName} />
			<TextInput
				autoCapitalize="none"
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
			/>
			<TextInput
				secureTextEntry
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
			/>
			{error && (
				<View>
					<Text style={{ color: "red" }}>{error.message}</Text>
				</View>
			)}
			<Button title="Sign Up" onPress={handleSignUp} />
		</View>
	);
}
