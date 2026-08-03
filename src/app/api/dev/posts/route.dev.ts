import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getAllPosts, getPostFilePath } from "@/lib/posts";
import { slugify } from "@/lib/format";

const postsDir = path.join(process.cwd(), "content", "posts");

function devBlocked() {
  if (process.env.DEVELOPER_MODE !== "true") {
    return NextResponse.json({ error: "开发模式未开启" }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const denied = devBlocked();
  if (denied) return denied;

  const posts = (await getAllPosts()).map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    updated: post.updated ?? "",
    category: post.category,
    tags: post.tags,
    cover: post.cover,
    excerpt: post.excerpt,
    content: post.content,
  }));

  return NextResponse.json({ posts });
}

type PostPayload = {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  category: string;
  tags: string[];
  cover: string;
  excerpt: string;
  content: string;
};

function toMarkdown(payload: PostPayload) {
  const frontmatter: Record<string, string | string[]> = {
    title: payload.title.replace(/\n/g, " ").trim(),
    slug: payload.slug,
    date: payload.date,
    category: payload.category || "未分类",
    cover: payload.cover,
    excerpt: payload.excerpt.replace(/\n/g, " ").trim(),
  };
  if (payload.updated) frontmatter.updated = payload.updated;
  if (payload.tags.length > 0) frontmatter.tags = payload.tags;

  const yaml = Object.entries(frontmatter)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join("\n");

  return `---\n${yaml}\n---\n\n${payload.content.trim()}\n`;
}


export async function POST(request: Request) {
  const denied = devBlocked();
  if (denied) return denied;

  const payload = (await request.json()) as PostPayload;
  if (!payload.title?.trim()) {
    return NextResponse.json(
      { error: "标题不能为空" },
      { status: 400 }
    );
  }

  const rawSlug = payload.slug.trim() || slugify(payload.title) || "post";
  const slug =
    rawSlug.replace(/[^\w\u4e00-\u9fa5-]/g, "-").replace(/-+/g, "-") || "post";
  const [year, month, day] = (
    payload.date || new Date().toISOString().slice(0, 10)
  ).split("-");
  if (!year || !month || !day) {
    return NextResponse.json(
      { error: "发布时间格式应为 YYYY-MM-DD" },
      { status: 400 }
    );
  }

  const dir = path.join(postsDir, year, month, day);
  const target = path.join(dir, `${slug}.md`);
  const existing = await getPostFilePath(slug);
  if (existing && existing !== target) {
    await fs.unlink(existing);
  }

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(target, toMarkdown({ ...payload, slug }), "utf-8");

  return NextResponse.json({ ok: true, slug });
}

export async function DELETE(request: Request) {
  const denied = devBlocked();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "缺少 slug" }, { status: 400 });
  }

  const file = await getPostFilePath(slug);
  if (!file) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }
  await fs.unlink(file);

  return NextResponse.json({ ok: true });
}
