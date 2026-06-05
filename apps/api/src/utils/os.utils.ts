import os from "node:os";

export function getLocalIPAddress(): string {
	const interfaces = os.networkInterfaces();

	for (const interfaceName in interfaces) {
		const networkInterface = interfaces[interfaceName];

		if (!networkInterface) continue;

		for (const alias of networkInterface) {
			// We look for IPv4 and ensure it's not a loopback/internal address
			if (alias.family === "IPv4" && !alias.internal) {
				return alias.address;
			}
		}
	}

	return "localhost"; // Fallback if no network is found
}
