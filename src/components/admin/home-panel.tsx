"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Save } from "lucide-react";
import { cn } from "@/lib/format";
import type { SiteConfig, TechItem } from "@/lib/types";
import { Field, PanelCard, PrimaryButton, inputClass } from "./ui";

type AdminProject = {
  name: string;
  description: string;
  language: string;
  stars: number;
  updatedAt: string;
  selected: boolean;
};

export default function HomePanel({
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
  const [navText, setNavText] = useState(() =>
    JSON.stringify(initialSite.nav, null, 2)
  );
  const [saved, setSaved] = useState(false);
  const [githubProjects, setGithubProjects] = useState<AdminProject[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState(false);

  const loadGithubProjects = async () => {
    setProjectsLoading(true);
    setProjectsError(false);
    try {
      const res = await fetch("/api/dev/github-projects");
      if (!res.ok) throw new Error("load failed");
      const data = (await res.json()) as { projects?: AdminProject[] };
      setGithubProjects(data.projects ?? []);
    } catch {
      setProjectsError(true);
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetch("/api/dev/github-projects")
      .then((res) => {
        if (!res.ok) throw new Error("load failed");
        return res.json() as Promise<{ projects?: AdminProject[] }>;
      })
      .then((data) => {
        if (!cancelled) setGithubProjects(data.projects ?? []);
      })
      .catch(() => {
        if (!cancelled) setProjectsError(true);
      })
      .finally(() => {
        if (!cancelled) setProjectsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleProject = async (name: string) => {
    const current = githubProjects.find((project) => project.name === name);
    if (!current) return;
    setGithubProjects((projects) =>
      projects.map((project) =>
        project.name === name
          ? { ...project, selected: !project.selected }
          : project
      )
    );
    try {
      const res = await fetch("/api/dev/github-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("toggle failed");
    } catch {
      setGithubProjects((projects) =>
        projects.map((project) =>
          project.name === name
            ? { ...project, selected: !project.selected }
            : project
        )
      );
      window.alert("切换失败，请重试");
    }
  };

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
    let nav = site.nav;
    try {
      nav = JSON.parse(navText);
    } catch {
      window.alert("导航 JSON 格式错误");
      return;
    }

    await fetch("/api/dev/site", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siteName: site.siteName,
        author: site.author,
        domain: site.domain,
        heroTitle: site.heroTitle,
        motto: site.motto,
        blogMotto: site.blogMotto,
        intro: site.intro,
        profile: site.profile,
        stats: site.stats,
        currentTarget: {
          title: site.currentTarget.title,
          items: targetText
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
        },
        techStack: parseTech(techText),
        nav,
        footerText: site.footerText,
        heroImages: site.heroImages,
        updatedAt: site.updatedAt,
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

      <PanelCard title="导航">
        <Field label="导航 JSON">
          <textarea
            className={`${inputClass} min-h-28 resize-y font-mono text-xs`}
            value={navText}
            onChange={(event) => setNavText(event.target.value)}
          />
        </Field>
      </PanelCard>

      <PanelCard title="GitHub 项目">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-sm text-muted">
            {site.profile.githubName} 的公开仓库
          </p>
          <button
            type="button"
            onClick={() => void loadGithubProjects()}
            className="btn-ghost h-9 px-3 text-xs"
          >
            <RefreshCw className="mr-1.5 inline h-3.5 w-3.5" />
            刷新
          </button>
        </div>
        {projectsLoading ? (
          <p className="py-6 text-center text-sm text-muted">加载中...</p>
        ) : projectsError ? (
          <p className="py-6 text-center text-sm text-muted">
            加载失败，请稍后重试
          </p>
        ) : githubProjects.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">
            没有找到公开仓库
          </p>
        ) : (
          <div className="max-h-[45vh] space-y-2 overflow-y-auto pr-1">
            {githubProjects.map((project) => (
              <button
                key={project.name}
                type="button"
                onClick={() => void toggleProject(project.name)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition",
                  project.selected
                    ? "border-orange/60 bg-orange/5 hover:bg-orange/10"
                    : "border-line bg-cream hover:border-orange/40"
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">
                    {project.name}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted">
                    {project.language && `${project.language} · `}
                    {project.stars} star
                    {project.updatedAt
                      ? ` · ${project.updatedAt.slice(0, 10)}`
                      : ""}
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold",
                    project.selected
                      ? "bg-leaf/15 text-leaf"
                      : "bg-ink/5 text-muted"
                  )}
                >
                  {project.selected ? "展示" : "不展示"}
                </span>
              </button>
            ))}
          </div>
        )}
      </PanelCard>

      <PrimaryButton onClick={save} className="h-12 px-8">
        <Save className="mr-2 inline h-4 w-4" />
        {saved ? "已保存" : "保存主页配置"}
      </PrimaryButton>
    </div>
  );
}
