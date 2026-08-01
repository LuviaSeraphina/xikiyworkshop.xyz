import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import type { Post, PostMeta, PostSummary } from "./types";
import { formatDateValue } from "./format";

const postsDir = path.join(process.cwd(), "content", "posts");

function toMeta(fileName: string, data: Record<string, unknown>): PostMeta {
  const fallback = fileName.replace(/\.md$/, "");
  return {
    slug: String(data.slug ?? fallback),
    title: String(data.title ?? fallback),
    date: formatDateValue(data.date),
    updated: formatDateValue(data.updated) || undefined,
    category: String(data.category ?? "未分类"),
    tags: Array.isArray(data.tags)
      ? data.tags.map((tag) => String(tag))
      : [],
    cover: String(data.cover ?? "/images/cover-1.jpg"),
    excerpt: String(data.excerpt ?? ""),
  };
}

export async function getAllPosts(): Promise<Post[]> {
  const files = (await fs.readdir(postsDir)).filter((file) =>
    file.endsWith(".md")
  );

  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(postsDir, file), "utf-8");
      const { data, content } = matter(raw);
      return { ...toMeta(file, data), content };
    })
  );

  return posts.sort(
    (a, b) => b.date.localeCompare(a.date) || b.title.localeCompare(a.title)
  );
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
