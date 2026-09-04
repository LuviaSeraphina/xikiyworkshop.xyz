import { promises as fs } from "fs";
import path from "path";
import type { Project } from "./types";

const projectsFile = path.join(process.cwd(), "data", "projects.json");
const cacheFile = path.join(process.cwd(), "data", "projects-cache.json");

type ConfiguredProject = {
  name: string;
  note?: string;
};

type GitHubRepo = {
  name: string;
  html_url?: string;
  description?: string | null;
  language?: string | null;
  stargazers_count?: number;
  updated_at?: string;
  homepage?: string | null;
};

type ProjectCache = {
  updatedAt: string;
  projects: Record<string, Project>;
};

export async function getConfiguredProjects(): Promise<ConfiguredProject[]> {
  try {
    const raw = await fs.readFile(projectsFile, "utf-8");
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data
      .map((item) =>
        typeof item === "string"
          ? { name: item }
          : {
              name: String((item as { name?: unknown }).name ?? ""),
              note:
                typeof (item as { note?: unknown }).note === "string"
                  ? String((item as { note?: unknown }).note)
                  : undefined,
            }
      )
      .filter((item) => item.name.trim());
  } catch {
    return [];
  }
}

async function readProjectCache(): Promise<Record<string, Project>> {
  try {
    const raw = await fs.readFile(cacheFile, "utf-8");
    const data = JSON.parse(raw) as ProjectCache;
    return data.projects ?? {};
  } catch {
    return {};
  }
}

async function writeProjectCache(projects: Record<string, Project>) {
  try {
    const payload: ProjectCache = {
      updatedAt: new Date().toISOString(),
      projects,
    };
    await fs.writeFile(
      cacheFile,
      `${JSON.stringify(payload, null, 2)}\n`,
      "utf-8"
    );
  } catch {
    // Cache writes are best-effort; page rendering still works on failure.
  }
}

function toProject(
  name: string,
  repo: GitHubRepo,
  note?: string
): Project {
  return {
    name,
    url: repo.html_url ?? `https://github.com/${name}`,
    description: note ?? repo.description ?? "",
    language: repo.language ?? "",
    stars: repo.stargazers_count ?? 0,
    updatedAt: repo.updated_at ?? "",
    homepage: repo.homepage ?? undefined,
  };
}

async function fetchRepo(
  owner: string,
  item: ConfiguredProject
): Promise<Project | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${item.name}`,
      { redirect: "manual" }
    );
    if (
      res.status === 301 ||
      res.status === 308 ||
      res.status === 404 ||
      res.status === 410
    ) {
      const cache = await readProjectCache();
      if (cache[item.name]) {
        delete cache[item.name];
        await writeProjectCache(cache);
      }
      return null;
    }
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const repo = (await res.json()) as GitHubRepo;
    if (repo.name !== item.name) {
      const cache = await readProjectCache();
      if (cache[item.name]) {
        delete cache[item.name];
        await writeProjectCache(cache);
      }
      return null;
    }

    const project = toProject(repo.name || item.name, repo, item.note);
    const cache = await readProjectCache();
    cache[project.name] = project;
    await writeProjectCache(cache);
    return project;
  } catch {
    const cache = await readProjectCache();
    const cached = cache[item.name];
    if (cached) return cached;
    return {
      name: item.name,
      url: `https://github.com/${owner}/${item.name}`,
      description: item.note ?? "",
      language: "",
      stars: 0,
      updatedAt: "",
    };
  }
}

export async function fetchGitHubRepos(
  owner: string,
  cache: RequestCache = "force-cache",
  perPage = 100
): Promise<Project[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${owner}/repos?sort=updated&per_page=${perPage}`,
      { cache }
    );
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const repos = (await res.json()) as GitHubRepo[];
    return repos.map((repo) => toProject(repo.name, repo));
  } catch {
    return [];
  }
}

export async function getProjects(owner: string): Promise<Project[]> {
  const configured = await getConfiguredProjects();
  if (configured.length === 0) return [];

  const projects: Project[] = [];
  for (const item of configured) {
    const project = await fetchRepo(owner, item);
    if (project) projects.push(project);
  }
  return projects;
}
