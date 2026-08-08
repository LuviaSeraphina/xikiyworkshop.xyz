import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getSiteConfig } from "@/lib/data";
import { fetchGitHubRepos, getConfiguredProjects } from "@/lib/projects";

const projectsFile = path.join(process.cwd(), "data", "projects.json");

function devBlocked() {
  if (process.env.DEVELOPER_MODE !== "true") {
    return NextResponse.json({ error: "开发模式未开启" }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const denied = devBlocked();
  if (denied) return denied;

  const site = await getSiteConfig();
  const repos = await fetchGitHubRepos(site.profile.githubName, "no-store");
  const configured = await getConfiguredProjects();
  const selected = new Set(configured.map((item) => item.name));

  return NextResponse.json({
    projects: repos.map((repo) => ({
      ...repo,
      selected: selected.has(repo.name),
    })),
  });
}

export async function POST(request: Request) {
  const denied = devBlocked();
  if (denied) return denied;

  const { name } = (await request.json()) as { name?: unknown };
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "缺少项目名称" }, { status: 400 });
  }

  const configured = await getConfiguredProjects();
  const exists = configured.some((item) => item.name === name);
  const next = exists
    ? configured.filter((item) => item.name !== name)
    : [...configured, { name }];

  await fs.writeFile(projectsFile, JSON.stringify(next, null, 2), "utf-8");
  return NextResponse.json({ ok: true, selected: !exists });
}
