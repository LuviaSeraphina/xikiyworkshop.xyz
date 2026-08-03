"use client";

import { useEffect, useRef, useState } from "react";
import { FilePlus, Save, Trash2 } from "lucide-react";
import {
  DangerButton,
  Field,
  PanelCard,
  PrimaryButton,
  inputClass,
} from "./ui";
import type { AdminPost, PostListItem } from "./types";

const today = () => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

const createEmptyPost = (): AdminPost => ({
  slug: "",
  title: "",
  date: today(),
  updated: "",
  category: "",
  tags: "",
  cover: "/images/blog-hero.jpg",
  excerpt: "",
  content: "",
});

export default function PostsPanel({
  initialPosts,
}: {
  initialPosts: PostListItem[];
}) {
  const [posts, setPosts] = useState<PostListItem[]>(initialPosts);
  const [form, setForm] = useState<AdminPost>(() => createEmptyPost());
  const [busy, setBusy] = useState(false);
  const dateTouched = useRef(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (dateTouched.current) return;
      const next = today();
      setForm((current) =>
        current.date === next ? current : { ...current, date: next }
      );
    }, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const load = async () => {
    const res = await fetch("/api/dev/posts");
    const data = await res.json();
    setPosts(data.posts ?? []);
  };

  const set = (key: keyof AdminPost, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = async () => {
    setBusy(true);
    try {
      await fetch("/api/dev/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags
            .split(/[,，]/)
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      });
      await load();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (slug: string) => {
    if (!window.confirm(`删除 ${slug}？`)) return;
    await fetch(`/api/dev/posts?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    await load();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <PanelCard title="文章列表">
        <div className="max-h-[65vh] space-y-2 overflow-y-auto pr-1">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="flex items-center gap-2 rounded-xl border-2 border-line bg-cream px-3 py-2"
            >
              <button
                type="button"
                onClick={() => {
                  dateTouched.current = true;
                  setForm({ ...post, tags: post.tags.join(", ") });
                }}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate text-sm font-semibold">{post.title}</p>
                <p className="truncate text-xs text-muted">
                  {post.date} · {post.category}
                </p>
              </button>
              <button
                type="button"
                onClick={() => remove(post.slug)}
                className="rounded-lg p-1.5 text-muted transition hover:bg-berry/10 hover:text-berry"
                aria-label={`删除 ${post.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </PanelCard>

      <PanelCard title="编辑器" description="写完后保存，会直接更新仓库内的 Markdown 文件。">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="标题">
            <input
              className={inputClass}
              value={form.title}
              onChange={(event) => set("title", event.target.value)}
            />
          </Field>
          <Field label="Slug">
            <input
              className={inputClass}
              value={form.slug}
              onChange={(event) => set("slug", event.target.value)}
            />
          </Field>
          <Field label="发布时间">
            <input
              type="date"
              className={inputClass}
              value={form.date}
              onChange={(event) => set("date", event.target.value)}
            />
          </Field>
          <Field label="更新时间（可选）">
            <input
              type="date"
              className={inputClass}
              value={form.updated}
              onChange={(event) => set("updated", event.target.value)}
            />
          </Field>
          <Field label="分类">
            <input
              className={inputClass}
              value={form.category}
              onChange={(event) => set("category", event.target.value)}
            />
          </Field>
          <Field label="标签（逗号分隔）">
            <input
              className={inputClass}
              value={form.tags}
              onChange={(event) => set("tags", event.target.value)}
            />
          </Field>
          <Field label="封面图片路径" className="md:col-span-2">
            <input
              className={inputClass}
              value={form.cover}
              onChange={(event) => set("cover", event.target.value)}
            />
          </Field>
          <Field label="摘要" className="md:col-span-2">
            <textarea
              className={`${inputClass} min-h-20 resize-y`}
              value={form.excerpt}
              onChange={(event) => set("excerpt", event.target.value)}
            />
          </Field>
          <Field label="正文（Markdown）" className="md:col-span-2">
            <textarea
              className={`${inputClass} min-h-72 resize-y font-mono text-xs`}
              value={form.content}
              onChange={(event) => set("content", event.target.value)}
            />
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <PrimaryButton onClick={save}>
            <Save className="mr-2 inline h-4 w-4" />
            {busy ? "保存中..." : "保存文章"}
          </PrimaryButton>
          <DangerButton
            onClick={() => {
              dateTouched.current = false;
              setForm(createEmptyPost());
            }}
          >
            <FilePlus className="mr-2 inline h-4 w-4" />
            新建
          </DangerButton>
        </div>
      </PanelCard>
    </div>
  );
}
