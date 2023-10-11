import { SidebarItems } from "./Sidebar";

export interface SampleUnselectedProp {
  samples: SidebarItems[];
  slug: string;
  title: string;
  description: string;
}

export interface SampleSelectedProp {
  text: string;
  title: string;
  contributors: string[];
  slug: string;
}
