import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import matter from "gray-matter";
import { formatDateValue } from "@/lib/format";

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

  const files = (await fs.readdir(postsDir)).filter((file) =>
    file.endsWith(".md")
  );
  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(postsDir, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: String(data.slug ?? file.replace(/\.md$/, "")),
        title: String(data.title ?? ""),
        date: formatDateValue(data.date),
        updated: formatDateValue(data.updated),
        category: String(data.category ?? ""),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        cover: String(data.cover ?? ""),
        excerpt: String(data.excerpt ?? ""),
        content,
      };
    })
  );

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
  const tags =
    payload.tags.length > 0
      ? `\ntags: [${payload.tags
          .map((tag) => `"${tag.replace(/"/g, '\\"')}"`)
          .join(", ")}]`
      : "";
  return `---
title: ${payload.title.replace(/\n/g, " ")}
slug: ${payload.slug}
date: ${payload.date}
${payload.updated ? `updated: ${payload.updated}` : ""}
category: ${payload.category}${tags}
cover: ${payload.cover}
excerpt: ${payload.excerpt.replace(/\n/g, " ")}
---

${payload.content.trim()}
`;
}

export async function POST(request: Request) {
  const denied = devBlocked();
  if (denied) return denied;

  const payload = (await request.json()) as PostPayload;
  if (!payload.slug || !payload.title) {
    return NextResponse.json(
      { error: "slug 和 title 不能为空" },
      { status: 400 }
    );
  }

  const slug = payload.slug.replace(/[^\w\u4e00-\u9fa5-]/g, "-");
  await fs.writeFile(
    path.join(postsDir, `${slug}.md`),
    toMarkdown({ ...payload, slug }),
    "utf-8"
  );

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

  try {
    await fs.unlink(path.join(postsDir, `${slug}.md`));
  } catch {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
