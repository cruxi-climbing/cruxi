import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, testUtils } from "better-auth/plugins";
import { database } from "@/database";
import { accounts, sessions, users, verifications } from "@/database/schema";

export const auth = betterAuth({
	appName: "Cruxi",
	baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
	database: drizzleAdapter(database, {
		provider: "pg",
		usePlural: true,
		schema: {
			users,
			accounts,
			sessions,
			verifications,
		},
	}),
	user: {
		additionalFields: {
			biography: {
				type: "string",
				required: false,
				defaultValue: null,
				input: true,
			},
			height: {
				type: "number",
				required: false,
				defaultValue: null,
				input: true,
			},
			wingspan: {
				type: "number",
				required: false,
				defaultValue: null,
				input: true,
			},
			birthday: {
				type: "string",
				required: false,
				defaultValue: null,
				input: true,
			},
			startedClimbingAt: {
				type: "string",
				required: false,
				defaultValue: null,
				input: true,
			},
		},
	},
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: googleProvider(),
	},
	trustedOrigins: [
		"cruxi://*",
		// Development mode - Expo's exp:// scheme with local IP ranges
		...(process.env.NODE_ENV === "development"
			? [
					"exp://", // Trust all Expo URLs (prefix matching)
					"exp://**", // Trust all Expo URLs (wildcard matching)
					"exp://192.168.*.*:*/**", // Trust 192.168.x.x IP range with any port and path
				]
			: []),
	],
	advanced: {
		database: {
			generateId: false,
		},
		cookiePrefix: "cruxi",
	},
	plugins: [expo(), admin(), testUtils()],
});

function googleProvider() {
	if (process.env.GOOGLE_PROVIDER_ENABLED !== "true") return;

	return {
		clientId: process.env.GOOGLE_CLIENT_ID as string,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
	};
}
