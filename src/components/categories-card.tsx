import Link from "next/link";
import { FolderOpen } from "lucide-react";
import type { PostSummary } from "@/lib/types";
import { encodeSegment } from "@/lib/format";

type CategoriesCardProps = {
  posts: PostSummary[];
};

export default function CategoriesCard({ posts }: CategoriesCardProps) {
  const counts = posts.reduce<Record<string, number>>((acc, post) => {
    acc[post.category] = (acc[post.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="hand-card-tight p-5">
      <div className="flex items-center gap-2">
        <FolderOpen className="h-4 w-4 text-sky" />
        <h3 className="font-hand text-2xl leading-none">分类</h3>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {Object.entries(counts).map(([category, count]) => (
          <Link
            key={category}
            href={`/timeline/category/${encodeSegment(category)}/`}
            className="rounded-xl border-2 border-line bg-cream px-3 py-1.5 text-sm transition hover:border-sky hover:bg-sky/5 hover:shadow-[3px_3px_0_rgba(59,130,246,0.15)]"
          >
            {category}
            <span className="ml-1.5 text-xs text-muted">{count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
