import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/format";
import type { PostSummary } from "@/lib/types";

type BlogCardProps = {
  post: PostSummary;
  index: number;
};

export default function BlogCard({ post, index }: BlogCardProps) {
  const reverse = index % 2 === 1;
  return (
    <Link
      href={`/blog/${post.slug}/`}
      className={cn(
        "blog-card-hover hand-card-tight group grid gap-0 overflow-hidden p-3 md:grid-cols-2 md:gap-4",
        reverse && "md:[direction:rtl]"
      )}
    >
      <div className="relative h-48 overflow-hidden rounded-[14px_8px_16px_8px] border-2 border-line md:h-full md:min-h-[210px] [direction:ltr]">
        <Image
          src={post.cover}
          alt={post.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>
      <div className="flex flex-col justify-center p-4 [direction:ltr]">
        <h3 className="text-xl font-bold leading-snug transition group-hover:text-orange">
          {post.title}
        </h3>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {post.date}
          </span>
          {post.category && (
            <>
              <span className="text-line">|</span>
              <span>{post.category}</span>
            </>
          )}
        </p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/70">
          {post.excerpt}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sky transition group-hover:gap-3">
          阅读全文
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
