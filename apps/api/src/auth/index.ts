import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { database } from "@/database";
import { accounts, sessions, users, verifications } from "@/database/schema";

export const auth = betterAuth({
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
	emailAndPassword: {
		enabled: true,
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
	plugins: [expo()],
});

console.log("NODE_ENV:", process.env.NODE_ENV);
