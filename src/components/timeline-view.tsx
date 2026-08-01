import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@/lib/types";

type TimelineViewProps = {
  posts: PostSummary[];
};

export default function TimelineView({ posts }: TimelineViewProps) {
  const byYear = posts.reduce<Record<string, PostSummary[]>>((acc, post) => {
    const year = post.date.slice(0, 4) || "未知";
    acc[year] = acc[year] ?? [];
    acc[year].push(post);
    return acc;
  }, {});

  const years = Object.keys(byYear).sort((a, b) => b.localeCompare(a));

  return (
    <div className="timeline-rail pl-12">
      {years.map((year) => {
        const byDate = byYear[year].reduce<Record<string, PostSummary[]>>(
          (acc, post) => {
            acc[post.date] = acc[post.date] ?? [];
            acc[post.date].push(post);
            return acc;
          },
          {}
        );
        const dates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

        return (
          <div key={year} className="relative mb-14">
            <span className="timeline-dot" />
            <h2 className="font-hand text-5xl leading-none">{year}</h2>
            <div className="mt-6 space-y-8">
              {dates.map((date) => (
                <div key={date}>
                  <div className="timeline-date-row mb-3 flex items-center gap-2">
                    <span className="timeline-date-dot h-3 w-3 rounded-full border-2 border-orange bg-cream" />
                    <span className="font-mono text-sm font-bold text-orange">
                      {date}
                    </span>
                    <span className="h-px flex-1 bg-line" />
                  </div>
                  <div className="space-y-3">
                    {byDate[date].map((post) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}/`}
                        className="blog-card-hover hand-card-tight group flex gap-4 p-3"
                      >
                        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 border-line">
                          <Image
                            src={post.cover}
                            alt={post.title}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                            sizes="112px"
                          />
                        </div>
                        <div className="min-w-0 py-1">
                          <h3 className="truncate font-bold transition group-hover:text-orange">
                            {post.title}
                          </h3>
                          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
                            {post.excerpt}
                          </p>
                          <p className="mt-2 text-xs font-medium text-sky">
                            {post.category}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
