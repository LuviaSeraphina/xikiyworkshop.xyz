"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import type { PostSummary } from "@/lib/types";

type SearchDialogProps = {
  posts: PostSummary[];
};

export default function SearchDialog({ posts }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return posts.slice(0, 6);
    return posts
      .filter((post) =>
        [post.title, post.excerpt, post.category, ...post.tags]
          .join(" ")
          .toLowerCase()
          .includes(keyword)
      )
      .slice(0, 8);
  }, [posts, query]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-ghost h-10 w-10 px-0 text-sm md:w-auto md:px-4"
        aria-label="搜索"
      >
        <Search className="h-4 w-4" />
        <span className="hidden md:inline">搜索</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]">
          <button
            type="button"
            aria-label="关闭搜索"
            className="absolute inset-0 bg-transparent"
            onClick={() => setOpen(false)}
          />
          <div className="hand-card relative z-10 w-full max-w-2xl p-5">
            <div className="flex items-center gap-3 border-b-2 border-dashed border-line pb-3">
              <Search className="h-5 w-5 text-orange" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索博客文章、标签或分类..."
                className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted/60"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-ghost h-9 w-9 px-0"
                aria-label="关闭"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 max-h-[55vh] space-y-2 overflow-y-auto pr-1">
              {results.length === 0 && (
                <p className="py-8 text-center text-muted">
                  没有找到相关文章，换个关键词试试。
                </p>
              )}
              {results.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}/`}
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3 rounded-xl border border-line/70 bg-cream/70 px-3 py-2.5 transition hover:border-orange hover:bg-orange/5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{post.title}</p>
                    <p className="truncate text-xs text-muted">
                      {post.date} · {post.category} · {post.tags.join(" / ")}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition group-hover:text-orange" />
                </Link>
              ))}
            </div>
            <p className="mt-3 text-right text-xs text-muted/70">
              按 Ctrl/⌘ + K 快速唤起搜索
            </p>
          </div>
        </div>
      )}
    </>
  );
}
