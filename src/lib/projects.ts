import { promises as fs } from "fs";
import path from "path";
import type { Project } from "./types";

const projectsFile = path.join(process.cwd(), "data", "projects.json");

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
): Promise<Project> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${item.name}`,
      { cache: "force-cache" }
    );
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const repo = (await res.json()) as GitHubRepo;
    return toProject(repo.name || item.name, repo, item.note);
  } catch {
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
  return Promise.all(
    configured.map((item) => fetchRepo(owner, item))
  );
}
