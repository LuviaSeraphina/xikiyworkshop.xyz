"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/format";
import type { Heading } from "@/lib/markdown";

type TocCardProps = {
  headings: Heading[];
  articleId: string;
};

export default function TocCard({ headings, articleId }: TocCardProps) {
  const [percent, setPercent] = useState(0);
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    const update = () => {
      const article = document.getElementById(articleId);
      if (!article) return;
      const line = window.innerHeight * (2 / 7);
      const rect = article.getBoundingClientRect();
      const total = rect.height;
      const passed = line - rect.top;
      const value = Math.min(100, Math.max(0, (passed / total) * 100));
      setPercent(Math.round(value));

      let current = headings[0]?.id ?? "";
      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line + 8) {
          current = heading.id;
        }
      }
      setActiveId(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [headings, articleId]);

  return (
    <div className="hand-card-tight p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-orange" />
          <h3 className="font-hand text-2xl leading-none">目录</h3>
        </div>
        <span className="rounded-lg bg-orange/10 px-2 py-0.5 font-mono text-sm font-bold text-orange">
          {percent}%
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky to-orange transition-[width] duration-150"
          style={{ width: `${percent}%` }}
        />
      </div>
      {headings.length > 0 && (
        <nav className="mt-4 space-y-1.5">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={(event) => {
                event.preventDefault();
                document
                  .getElementById(heading.id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              style={{ paddingLeft: `${(heading.level - 1) * 0.9}rem` }}
              className={cn(
                "block rounded-lg border-l-2 px-3 py-1.5 text-sm transition",
                activeId === heading.id
                  ? "border-orange bg-orange/10 font-semibold text-ink"
                  : "border-transparent text-muted hover:bg-cream hover:text-ink"
              )}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
