import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
	baseURL: process.env.API_BASE_URL || "http://localhost:3000",
	plugins: [
		expoClient({
			scheme: "cruxi",
			storagePrefix: "cruxi",
			storage: SecureStore,
		}),
	],
});
