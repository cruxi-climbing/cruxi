import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";
import { config } from "./config";

export const authClient = createAuthClient({
	baseURL: config.apiBaseUrl,
	plugins: [
		expoClient({
			scheme: "cruxi",
			storagePrefix: "cruxi",
			storage: SecureStore,
			cookiePrefix: "cruxi",
		}),
	],
});
