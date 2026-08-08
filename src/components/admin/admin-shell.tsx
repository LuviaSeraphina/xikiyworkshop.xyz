"use client";

import { useState } from "react";
import {
  Cloud,
  FileText,
  Heart,
  Home,
  Image as ImageIcon,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/format";
import CloudPanel from "./cloud-panel";
import FriendsPanel from "./friends-panel";
import HomePanel from "./home-panel";
import ImagesPanel from "./images-panel";
import PostsPanel from "./posts-panel";
import type { CloudConfig, SiteConfig } from "@/lib/types";
import type { ImageEntry, PostListItem } from "./types";

const tabs = [
  { id: "posts", label: "博客", icon: FileText },
  { id: "images", label: "图片", icon: ImageIcon },
  { id: "cloud", label: "云盘", icon: Cloud },
  { id: "home", label: "主页", icon: Home },
  { id: "friends", label: "友链", icon: Heart },
] as const;

type TabId = (typeof tabs)[number]["id"];

type AdminShellProps = {
  initialSite: SiteConfig;
  initialCloud: CloudConfig;
  initialPosts: PostListItem[];
  initialImages: ImageEntry[];
};

export default function AdminShell({
  initialSite,
  initialCloud,
  initialPosts,
  initialImages,
}: AdminShellProps) {
  const [active, setActive] = useState<TabId>("posts");

  return (
    <div className="min-h-screen bg-paper px-4 pb-20 pt-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3">
          <Wrench className="h-7 w-7 text-orange" />
          <h1 className="font-hand text-5xl leading-none">管理后台</h1>
          <span className="rounded-xl bg-leaf/10 px-2.5 py-1 text-xs font-semibold text-leaf">
            开发模式
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={cn(
                "flex h-11 items-center gap-2 rounded-xl border-2 px-4 text-sm font-medium transition",
                active === tab.id
                  ? "border-orange bg-orange/10 text-orange"
                  : "border-line bg-cream text-muted hover:border-orange/50"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {active === "posts" && <PostsPanel initialPosts={initialPosts} />}
          {active === "images" && (
            <ImagesPanel initialImages={initialImages} />
          )}
          {active === "cloud" && (
            <CloudPanel initialConfig={initialCloud} />
          )}
          {active === "home" && <HomePanel initialSite={initialSite} />}
          {active === "friends" && <FriendsPanel initialSite={initialSite} />}
        </div>
      </div>
    </div>
  );
}
