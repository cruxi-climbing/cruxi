import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const routesTable = sqliteTable("climbing_routes", {
	url: text("url").primaryKey(),
	name: text("name"),
	description: text("description"),
	grade: text("grade"),
	areaName: text("area_name"),
	areaUrl: text("area_url"),
	sectorName: text("sector_name"),
	sectorDescription: text("sector_description"),
	sectorUrl: text("sector_url"),
	countryName: text("country_name"),
	latitude: real("latitude"),
	longitude: real("longitude"),
	tags: text("tags"),
	height: real("height"),
	firstAscentBy: text("first_ascent_by"),
});
