import { LinearGradient } from "expo-linear-gradient";
import { TabList, TabSlot, Tabs, TabTrigger } from "expo-router/ui";
import { StyleSheet, View } from "react-native";
import { TabButton } from "@/components/TabButton";

export default function TabLayout() {
	return (
		<Tabs>
			<TabSlot />
			<LinearGradient
				colors={["rgba(250,249,248,0.86)", "rgba(255,255,255,0)"]}
				start={{ x: 0.5, y: 1 }}
				end={{ x: 0.5, y: 0 }}
				style={styles.tabListContainer}
			>
				<View>
					<View style={styles.tabListContent}>
						<TabTrigger name="feed" asChild>
							<TabButton icon="home">Accueil</TabButton>
						</TabTrigger>

						<TabTrigger name="projects" asChild>
							<TabButton icon="projects">Projets</TabButton>
						</TabTrigger>

						<TabTrigger name="search" asChild>
							<TabButton icon="search">Recherche</TabButton>
						</TabTrigger>

						<TabTrigger name="profile" asChild>
							<TabButton icon="profile">Profil</TabButton>
						</TabTrigger>
					</View>
				</View>
			</LinearGradient>
			<TabList style={{ display: "none" }}>
				<TabTrigger name="feed" href="/feed"></TabTrigger>

				<TabTrigger name="projects" href="/"></TabTrigger>

				<TabTrigger name="search" href="/search"></TabTrigger>

				<TabTrigger name="profile" href="/profile"></TabTrigger>
			</TabList>
		</Tabs>
	);
}

const styles = StyleSheet.create({
	tabListContainer: {
		position: "absolute",
		// Quand un élément est en absolute, React Native le place par défaut à : left 0
		bottom: 0,
		// backgroundColor: "#faf9f8a0",
		height: 119,
		width: "100%",
		paddingTop: 10,
	},
	tabListContent: {
		flexDirection: "row",
		alignSelf: "center",
		justifyContent: "space-between",
		height: 71,
		width: 358,
		padding: 16,
		borderRadius: 42,
		backgroundColor: "#ffffff",
	},
});
