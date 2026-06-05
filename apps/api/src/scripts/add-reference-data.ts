import { addReferenceData } from "@/database";

try {
	await addReferenceData();
	console.info("Reference data successfully added");
	process.exit(0);
} catch (e) {
	console.error(e);
	process.exit(1);
}
