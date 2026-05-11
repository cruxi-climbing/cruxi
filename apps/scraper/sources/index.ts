import cliProgress from "cli-progress";
import { isNull } from "drizzle-orm";
import playwright from "playwright";
import { type Database, database } from "../database/index.js";
import { routesTable } from "../database/schema.js";
import { source as bleauInfoSource } from "./bleau-info/index.js";

export type SourceContext = {
	page: playwright.Page;
	progressBar: cliProgress.SingleBar;
	database: Database;
	forceUpdate?: boolean;
};

export type Source = {
	name: string;
	baseUrl: string;
	scrapAndStoreRouteUrls: (context: SourceContext) => Promise<void>;
	// scrapAndStoreRoutes: (context: SourceContext) => Promise<void>;
	scrapAndUpsertRoute: (
		url: string,
		context: SourceContext,
	) => Promise<unknown>;
};

const sources: Map<string, Source> = new Map();

function registerSource(source: Source) {
	sources.set(source.name, source);
}
registerSource(bleauInfoSource);

export async function scrapRouteUrls(): Promise<void> {
	const browser = await playwright.chromium.launch({ headless: true });

	const progressBar = new cliProgress.MultiBar(
		{
			format: `Scraping URLs | {bar} | {percentage}% || {value}/{total} || ETA: {eta_formatted}`,
		},
		cliProgress.Presets.shades_classic,
	);

	await Promise.all(
		Array.from(sources.values()).map((source) =>
			scrapAndStoreRouteUrlsForSource(
				source,
				database,
				browser,
				progressBar.create(0, 0),
			),
		),
	);

	progressBar.stop();

	await browser.close();
}

export async function scrapRoutes({
	forceUpdate = false,
}: {
	forceUpdate?: boolean;
}): Promise<void> {
	const browser = await playwright.chromium.launch({ headless: true });

	const routes = forceUpdate
		? await database.select().from(routesTable)
		: await database.select().from(routesTable).where(isNull(routesTable.name));

	const progressBar = new cliProgress.SingleBar(
		{
			format: `Scraping routes details | {bar} | {percentage}% || {value}/{total} || ETA: {eta_formatted}`,
		},
		cliProgress.Presets.shades_classic,
	);
	let index = 0;
	progressBar.start(routes.length, index);

	const context = await browser.newContext();

	const promises = routes.map((route) => async () => {
		if (route.name && !forceUpdate) return;

		const source = getRouteSource(route.url);
		if (!source) {
			console.warn(`No source found for route URL: ${route.url}`);
			return;
		}

		const page = await context.newPage();
		await optimizePageRouting(page);

		await source.scrapAndUpsertRoute(route.url, {
			page,
			progressBar: progressBar,
			database,
			forceUpdate: forceUpdate,
		});
		index++;
		progressBar.update(index);
		page.close();
	});

	const batchSize = 50;
	await promiseBatching(promises, batchSize);

	progressBar.stop();
	await context.close();
	await browser.close();
}

function getRouteSource(routeUrl: string): Source | undefined {
	for (const source of sources.values()) {
		if (routeUrl.startsWith(source.baseUrl)) return source;
	}
	return undefined;
}

async function scrapAndStoreRouteUrlsForSource(
	source: Source,
	database: Database,
	browser: playwright.Browser,
	progressBar: cliProgress.SingleBar,
) {
	const context = await browser.newContext();
	const page = await context.newPage();
	await optimizePageRouting(page);

	await source.scrapAndStoreRouteUrls({ page, progressBar, database });
}

async function optimizePageRouting(page: playwright.Page) {
	await page.route("**/*", async (route, request) => {
		const requestingHTML = request.resourceType() === "document";
		if (!requestingHTML) return await route.abort();

		let url: URL, pageHost: string;
		try {
			url = new URL(request.url());
			pageHost = new URL(page.url()).hostname;
		} catch {
			return route.continue();
		}

		// Rough "same site" check
		const base = (h: string) => h.split(".").slice(-2).join(".");
		const isThirdParty = base(url.hostname) !== base(pageHost);
		if (!isThirdParty) return route.continue();

		// Known tracker hosts / domains (keep short + boring)
		const blocked = [
			"google-analytics.com",
			"googletagmanager.com",
			"doubleclick.net",
			"facebook.net",
			"hotjar.com",
			"segment.com",
		];

		if (
			blocked.some((d) => url.hostname === d || url.hostname.endsWith(`.${d}`))
		) {
			return route.abort();
		}

		return await route.continue();
	});

	// --- 2) Disable animations ---------------------------------------------------
	// Avoid flaky waits + reduce some page work.
	// Note: addStyleTag affects the current document, and Playwright applies it
	// after navigation unless you use addInitScript. We'll use addInitScript
	// so it runs on every navigation *before* the page paints.
	await page.addInitScript(() => {
		const style = document.createElement("style");
		style.textContent = `
    *, *::before, *::after {
      transition: none !important;
      animation: none !important;
      scroll-behavior: auto !important;
    }
  `;
		document.documentElement.appendChild(style);
	});
}

async function promiseBatching<T>(
	tasks: (() => Promise<T>)[],
	batchSize: number,
) {
	const results = [];
	for (let i = 0; i < tasks.length; i += batchSize) {
		const batch = tasks.slice(i, i + batchSize).map((task) => task());
		results.push(...(await Promise.allSettled(batch)));
	}
	return results;
}
