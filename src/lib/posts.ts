import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import type { Post, PostMeta, PostSummary } from "./types";
import { formatDateValue } from "./format";

const postsDir = path.join(process.cwd(), "content", "posts");

async function listMarkdownFiles(dir: string): Promise<string[]> {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

function toMeta(filePath: string, data: Record<string, unknown>): PostMeta {
  const fallback = path.basename(filePath, ".md");
  return {
    slug: String(data.slug ?? fallback),
    title: String(data.title ?? fallback),
    date: formatDateValue(data.date),
    updated: formatDateValue(data.updated) || undefined,
    category: String(data.category ?? "未分类"),
    tags: Array.isArray(data.tags)
      ? data.tags.map((tag) => String(tag))
      : [],
    cover: String(data.cover ?? "/images/blog-hero.jpg"),
    excerpt: String(data.excerpt ?? ""),
  };
}

export async function getAllPosts(): Promise<Post[]> {
  const files = await listMarkdownFiles(postsDir);

  const posts = await Promise.all(
    files.map(async (filePath) => {
      const raw = await fs.readFile(filePath, "utf-8");
      const { data, content } = matter(raw);
      return { ...toMeta(filePath, data), content };
    })
  );

  return posts.sort(
    (a, b) => b.date.localeCompare(a.date) || b.title.localeCompare(a.title)
  );
}

export async function getPostFilePath(slug: string): Promise<string | null> {
  const files = await listMarkdownFiles(postsDir);
  for (const filePath of files) {
    const raw = await fs.readFile(filePath, "utf-8");
    const { data } = matter(raw);
    const fileSlug = String(data.slug ?? path.basename(filePath, ".md"));
    if (fileSlug === slug) return filePath;
  }
  return null;
}

export async function getPostSummaries(): Promise<PostSummary[]> {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    updated: post.updated,
    category: post.category,
    tags: post.tags,
    cover: post.cover,
    excerpt: post.excerpt,
  }));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getAllCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  return Array.from(new Set(posts.map((post) => post.category))).sort();
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  return Array.from(new Set(posts.flatMap((post) => post.tags))).sort();
}
