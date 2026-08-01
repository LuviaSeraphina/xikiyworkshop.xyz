export type NavItem = {
  label: string;
  href: string;
};

export type Profile = {
  name: string;
  avatar: string;
  signature: string;
  github: string;
  githubName: string;
};

export type Stats = {
  lastUpdated: string;
  bucketSize: string;
};

export type CurrentTarget = {
  title: string;
  items: string[];
};

export type TechItem = {
  name: string;
  level?: number;
  color?: string;
};

export type FriendLink = {
  name: string;
  description: string;
  url: string;
  image: string;
};

export type HeroImages = {
  home: string;
  blog: string;
  timeline: string;
  cloud: string;
  friends: string;
};

export type SiteConfig = {
  siteName: string;
  author: string;
  domain: string;
  heroTitle: string;
  motto: string;
  blogMotto: string;
  intro: string;
  profile: Profile;
  stats: Stats;
  currentTarget: CurrentTarget;
  techStack: TechItem[];
  friends: FriendLink[];
  treasures: FriendLink[];
  nav: NavItem[];
  footerText: string;
  heroImages: HeroImages;
  updatedAt: string;
};

export type CloudNode = {
  name: string;
  type: "folder" | "file";
  children?: CloudNode[];
  url?: string;
  size?: string;
};

export type CloudConfig = {
  bucket: string;
  bucketSize: string;
  tree: CloudNode[];
};

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  category: string;
  tags: string[];
  cover: string;
  excerpt: string;
};

export type Post = PostMeta & {
  content: string;
};

export type PostSummary = PostMeta;
