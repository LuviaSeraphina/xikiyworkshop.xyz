import Link from "next/link";
import { Tag } from "lucide-react";
import type { PostSummary } from "@/lib/types";
import { encodeSegment } from "@/lib/format";

type TagsCardProps = {
  posts: PostSummary[];
};

export default function TagsCard({ posts }: TagsCardProps) {
  const counts = posts.reduce<Record<string, number>>((acc, post) => {
    post.tags.forEach((tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1;
    });
    return acc;
  }, {});
  const max = Math.max(1, ...Object.values(counts));

  return (
    <div className="hand-card-tight p-5">
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-berry" />
        <h3 className="font-hand text-2xl leading-none">标签</h3>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        {Object.entries(counts).map(([tag, count]) => {
          const size = 0.82 + (count / max) * 0.55;
          return (
            <Link
              key={tag}
              href={`/timeline/tag/${encodeSegment(tag)}/`}
              className="transition hover:text-orange hover:underline hover:decoration-orange/50 hover:underline-offset-4"
              style={{ fontSize: `${size}rem` }}
            >
              {tag}
              <span className="ml-1 align-super text-[0.6em] text-muted">
                {count}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
