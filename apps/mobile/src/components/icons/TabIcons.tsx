import { HomeFill } from "./Home/HomeFill";
import { HomeOutline } from "./Home/HomeOutline";
import { ProfileFill } from "./Profile/ProfileFill";
import { ProfileOutline } from "./Profile/ProfilOutline";
import { ProjectFill } from "./Project/ProjectFill";
import { ProjectOutline } from "./Project/ProjectOutline";
import { SearchFill } from "./Search/SearchFill";
import { SearchOutline } from "./Search/SearchOutline";

export const TabIcons = {
	home: { outline: HomeOutline, fill: HomeFill },
	search: { outline: SearchOutline, fill: SearchFill },

	profile: { outline: ProfileOutline, fill: ProfileFill },

	projects: { outline: ProjectOutline, fill: ProjectFill },
} as const;

// “Je veux un type qui correspond exactement aux clés de mon objet TabIcons”
export type TabIconName = keyof typeof TabIcons;
