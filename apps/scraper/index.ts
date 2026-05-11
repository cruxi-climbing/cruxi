import { select } from "@inquirer/prompts";
import { database } from "./database/index.js";
import { routesTable } from "./database/schema.js";
import { scrapRoutes, scrapRouteUrls } from "./sources/index.js";

const choiceValues = [
	"full-refresh",
	"check-new-urls",
	"update-all-routes",
	"update-incomplete-routes",
] as const;

type ChoiceValue = (typeof choiceValues)[number];

const answer = await select<ChoiceValue>({
	message: "Choose a way to scrap routes",
	choices: [
		{
			name: "Full refresh",
			value: "full-refresh",
			description: "Perform a full refresh of all routes (urls and details)",
		},
		{
			name: "Check for new urls",
			value: "check-new-urls",
			description: "Check for new route URLs",
		},
		{
			name: "Update all routes",
			value: "update-all-routes",
			description: "Update details of existing routes",
		},
		{
			name: "Update incomplete routes",
			value: "update-incomplete-routes",
			description: "Update details of incomplete routes",
		},
	],
});

if (answer === "full-refresh") {
	await database.delete(routesTable);
	await scrapRouteUrls();
	await scrapRoutes({ forceUpdate: true });
}

if (answer === "check-new-urls") {
	await scrapRouteUrls();
}

if (answer === "update-all-routes") {
	await scrapRoutes({ forceUpdate: true });
}

if (answer === "update-incomplete-routes") {
	await scrapRoutes({ forceUpdate: false });
}
