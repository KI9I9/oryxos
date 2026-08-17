import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";

import Layout from "./Layout.vue";
import ArchitectureMap from "./components/ArchitectureMap.vue";
import CapabilityLegend from "./components/CapabilityLegend.vue";
import CommunityLinks from "./components/CommunityLinks.vue";
import DocumentationLanding from "./components/DocumentationLanding.vue";
import HomeLanding from "./components/HomeLanding.vue";
import LimitationsPlaceholder from "./components/LimitationsPlaceholder.vue";
import PrototypeDocShell from "./components/PrototypeDocShell.vue";
import RelatedNavigation from "./components/RelatedNavigation.vue";
import RoadmapTimeline from "./components/RoadmapTimeline.vue";
import TopicGrid from "./components/TopicGrid.vue";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/default-theme.css";
import "./styles/responsive.css";
import "./styles/home.css";
import "./styles/architecture-roadmap.css";
import "./styles/locale.css";
import "./styles/documentation.css";
import "./styles/community.css";
import "./styles/not-found.css";

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component("ArchitectureMap", ArchitectureMap);
    app.component("CapabilityLegend", CapabilityLegend);
    app.component("CommunityLinks", CommunityLinks);
    app.component("DocumentationLanding", DocumentationLanding);
    app.component("HomeLanding", HomeLanding);
    app.component("LimitationsPlaceholder", LimitationsPlaceholder);
    app.component("PrototypeDocShell", PrototypeDocShell);
    app.component("RelatedNavigation", RelatedNavigation);
    app.component("RoadmapTimeline", RoadmapTimeline);
    app.component("TopicGrid", TopicGrid);
  }
} satisfies Theme;
