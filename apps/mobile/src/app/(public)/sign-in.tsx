import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { authClient } from "@/auth-client";

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { mutateAsync, error } = useMutation({
		mutationKey: ["signIn"],
		mutationFn: async () => {
			const result = await authClient.signIn.email({
				email,
				password,
			});
			return result;
		},
		onSuccess: (response) => {
			if (response.error) throw response.error;
		},
	});

	const handleLogin = async () => {
		await mutateAsync();
	};

	return (
		<View>
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

			<Button title="Login" onPress={handleLogin} />
		</View>
	);
}
