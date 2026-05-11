import { routesTable } from "../../database/schema.js";
import type { Source, SourceContext } from "../index.js";

const baseUrl = "https://bleau.info";

export const source: Source = {
	name: "bleau-info",
	baseUrl,
	scrapAndStoreRouteUrls,
	scrapAndUpsertRoute,
};

const defaultGotoOptions = {
	waitUntil: "domcontentloaded",
	timeout: 30_000,
} as const;

async function scrapAndStoreRouteUrls(context: SourceContext) {
	await context.page.goto(baseUrl, defaultGotoOptions);
	const areaUrls = await getAreaUrlPaths(context);
	let index = 0;
	context.progressBar.start(areaUrls.length, index);

	for (const areaUrl of areaUrls) {
		index += 1;
		context.progressBar.update(index);
		const urls = await getBoulderUrlsByAreaUrl(areaUrl, context);
		if (urls.length === 0) continue;
		const partialRoutes = urls.map((url) => ({
			url,
			areaUrl: url.substring(0, url.lastIndexOf("/")),
		}));
		await context.database
			.insert(routesTable)
			.values(partialRoutes)
			.onConflictDoNothing();
	}
	context.progressBar.stop();
}

async function scrapAndUpsertRoute(url: string, context: SourceContext) {
	const routeInformations = await getBoulderInformationsByUrl(url, context);
	await context.database
		.insert(routesTable)
		.values({ ...routeInformations, url })
		.onConflictDoUpdate({
			target: routesTable.url,
			set: {
				url: url,
				name: routeInformations.name,
				grade: routeInformations.grade,
				areaName: "Fontainebleau",
				sectorName: routeInformations.sectorName,
				sectorUrl: routeInformations.sectorUrl,
			},
		});
}

async function getBoulderUrlsByAreaUrl(
	areaUrl: string,
	context: SourceContext,
) {
	try {
		await context.page.goto(`${areaUrl}?sort=rating`, defaultGotoOptions);
		const urls: string[] = await context.page.$$eval("div.vsr a", (links) =>
			links.map((link) => link.href),
		);
		return urls;
	} catch (e) {
		throw new Error(`Something went wrong with area ${areaUrl}: ${e}`);
	}
}

async function getAreaUrlPaths(context: SourceContext) {
	await context.page.goto(`${baseUrl}/areas`, defaultGotoOptions);
	const urlPaths: string[] = await context.page.$$eval(
		"a:has(+ small)",
		(links) => links.map((link) => link.href),
	);
	return urlPaths;
}

async function getBoulderInformationsByUrl(
	url: string,
	context: SourceContext,
) {
	await context.page.goto(url, defaultGotoOptions);

	const { name, grade, sectorName } = await context.page.$eval(
		"div.btitle h3",
		(h3) => {
			// Get only direct text nodes of the h3 (excluding children like <em>)
			const name = Array.from(h3.childNodes)
				.filter((node) => node.nodeType === Node.TEXT_NODE)
				.map((node) => node.textContent?.trim())
				.join("");

			const em = h3.querySelector("em");
			const grade = em
				? Array.from(em.childNodes)
						.filter((node) => node.nodeType === Node.TEXT_NODE)
						.map((node) => node.textContent?.trim())
						.join("")
				: "";

			const a = h3.querySelector("a");
			const sectorName = a?.textContent.trim();
			return { name, grade, sectorName };
		},
	);

	const images = await context.page
		.$$eval("ul.slides li img", (imgs) =>
			imgs.map((img) => img.getAttribute("src")),
		)
		.catch(() => [] as string[]);

	const singleImage = await context.page
		.$eval("a.fancybox img", (img) => img.src)
		.catch(() => undefined);

	if (singleImage) images.push(singleImage as string);

	const rating = await context.page
		.$eval("div.bdetails div:nth-child(1) ul li:nth-child(3)", (el) =>
			el.textContent.replace("Étoiles", "").replace(",", ".").trim(),
		)
		.catch(() => undefined);

	const ratingsCount = await context.page
		.$eval("div.bdetails div:nth-child(1) ul li:nth-child(4)", (el) =>
			el.textContent.replace("(", "").replace("au total)", "").trim(),
		)
		.catch(() => undefined);

	return {
		name,
		url,
		grade,
		images,
		rating,
		ratingsCount,
		sectorUrl: url.substring(0, url.lastIndexOf("/")),
		sectorName,
	};
}
