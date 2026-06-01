import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { authClient } from "@/auth-client";

const queryClient = new QueryClient();

export default function RootLayout() {
	const { data: session } = authClient.useSession();
	const authenticated = Boolean(session);

	return (
		<QueryClientProvider client={queryClient}>
			<Stack>
				<Stack.Protected guard={!authenticated}>
					<Stack.Screen options={{ headerShown: false }} name="(public)" />
				</Stack.Protected>

				<Stack.Protected guard={authenticated}>
					<Stack.Screen options={{ headerShown: false }} name="(app)" />
				</Stack.Protected>
			</Stack>
		</QueryClientProvider>
	);
}
