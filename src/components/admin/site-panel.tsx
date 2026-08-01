"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import type { SiteConfig, TechItem } from "@/lib/types";
import { Field, PanelCard, PrimaryButton, inputClass } from "./ui";

export default function SitePanel({
  initialSite,
}: {
  initialSite: SiteConfig;
}) {
  const [site, setSite] = useState<SiteConfig>(initialSite);
  const [targetText, setTargetText] = useState(() =>
    initialSite.currentTarget.items.join("\n")
  );
  const [techText, setTechText] = useState(() =>
    initialSite.techStack
      .map((tech) =>
        [tech.name, tech.level ?? "", tech.color ?? ""].join("|")
      )
      .join("\n")
  );
  const [friendsText, setFriendsText] = useState(() =>
    JSON.stringify(initialSite.friends, null, 2)
  );
  const [treasuresText, setTreasuresText] = useState(() =>
    JSON.stringify(initialSite.treasures, null, 2)
  );
  const [navText, setNavText] = useState(() =>
    JSON.stringify(initialSite.nav, null, 2)
  );
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) => {
    setSite((current) => ({ ...current, [key]: value }));
  };

  const setProfile = (key: keyof SiteConfig["profile"], value: string) => {
    setSite((current) => ({
      ...current,
      profile: { ...current.profile, [key]: value },
    }));
  };

  const setStats = (key: keyof SiteConfig["stats"], value: string) => {
    setSite((current) => ({
      ...current,
      stats: { ...current.stats, [key]: value },
    }));
  };

  const parseTech = (value: string): TechItem[] =>
    value
      .split("\n")
      .map((line) => {
        const [name, level, color] = line.split("|");
        return {
          name: name?.trim() ?? "",
          level: level ? Number(level) || undefined : undefined,
          color: color?.trim() || undefined,
        };
      })
      .filter((tech) => tech.name);

  const save = async () => {
    let friends = site.friends;
    let treasures = site.treasures;
    let nav = site.nav;
    try {
      friends = JSON.parse(friendsText);
      treasures = JSON.parse(treasuresText);
      nav = JSON.parse(navText);
    } catch {
      window.alert("友链 / 宝藏链接 / 导航的 JSON 格式错误");
      return;
    }

    await fetch("/api/dev/site", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...site,
        currentTarget: {
          ...site.currentTarget,
          items: targetText.split("\n").map((item) => item.trim()).filter(Boolean),
        },
        techStack: parseTech(techText),
        friends,
        treasures,
        nav,
      }),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div className="space-y-6">
      <PanelCard title="基础信息">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="站点名称">
            <input
              className={inputClass}
              value={site.siteName}
              onChange={(event) => set("siteName", event.target.value)}
            />
          </Field>
          <Field label="Hero 标题">
            <input
              className={inputClass}
              value={site.heroTitle}
              onChange={(event) => set("heroTitle", event.target.value)}
            />
          </Field>
          <Field label="格言" className="md:col-span-2">
            <input
              className={inputClass}
              value={site.motto}
              onChange={(event) => set("motto", event.target.value)}
            />
          </Field>
          <Field label="博客页格言" className="md:col-span-2">
            <input
              className={inputClass}
              value={site.blogMotto}
              onChange={(event) => set("blogMotto", event.target.value)}
            />
          </Field>
          <Field label="自我介绍" className="md:col-span-2">
            <textarea
              className={`${inputClass} min-h-20 resize-y`}
              value={site.intro}
              onChange={(event) => set("intro", event.target.value)}
            />
          </Field>
        </div>
      </PanelCard>

      <PanelCard title="个人信息">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="网名">
            <input
              className={inputClass}
              value={site.profile.name}
              onChange={(event) => setProfile("name", event.target.value)}
            />
          </Field>
          <Field label="签名">
            <input
              className={inputClass}
              value={site.profile.signature}
              onChange={(event) => setProfile("signature", event.target.value)}
            />
          </Field>
          <Field label="头像路径">
            <input
              className={inputClass}
              value={site.profile.avatar}
              onChange={(event) => setProfile("avatar", event.target.value)}
            />
          </Field>
          <Field label="GitHub 链接">
            <input
              className={inputClass}
              value={site.profile.github}
              onChange={(event) => setProfile("github", event.target.value)}
            />
          </Field>
          <Field label="最后更新日期">
            <input
              className={inputClass}
              value={site.stats.lastUpdated}
              onChange={(event) => setStats("lastUpdated", event.target.value)}
            />
          </Field>
          <Field label="R2 桶大小">
            <input
              className={inputClass}
              value={site.stats.bucketSize}
              onChange={(event) => setStats("bucketSize", event.target.value)}
            />
          </Field>
        </div>
      </PanelCard>

      <PanelCard title="规划与技术栈">
        <Field label="Current Target（每行一条）">
          <textarea
            className={`${inputClass} min-h-28 resize-y`}
            value={targetText}
            onChange={(event) => setTargetText(event.target.value)}
          />
        </Field>
        <Field label="技术栈（每行：名称|等级|颜色）" className="mt-3">
          <textarea
            className={`${inputClass} min-h-28 resize-y font-mono text-xs`}
            value={techText}
            onChange={(event) => setTechText(event.target.value)}
          />
        </Field>
      </PanelCard>

      <PanelCard title="链接与导航">
        <Field label="友情链接 JSON">
          <textarea
            className={`${inputClass} min-h-36 resize-y font-mono text-xs`}
            value={friendsText}
            onChange={(event) => setFriendsText(event.target.value)}
          />
        </Field>
        <Field label="宝藏链接 JSON" className="mt-3">
          <textarea
            className={`${inputClass} min-h-36 resize-y font-mono text-xs`}
            value={treasuresText}
            onChange={(event) => setTreasuresText(event.target.value)}
          />
        </Field>
        <Field label="导航 JSON" className="mt-3">
          <textarea
            className={`${inputClass} min-h-28 resize-y font-mono text-xs`}
            value={navText}
            onChange={(event) => setNavText(event.target.value)}
          />
        </Field>
      </PanelCard>

      <PrimaryButton onClick={save} className="h-12 px-8">
        <Save className="mr-2 inline h-4 w-4" />
        {saved ? "已保存" : "保存站点配置"}
      </PrimaryButton>
    </div>
  );
}
