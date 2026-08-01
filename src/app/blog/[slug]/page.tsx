import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, Eye, FolderOpen } from "lucide-react";
import Busuanzi from "@/components/busuanzi";
import PostBody from "@/components/post-body";
import ProfileCard from "@/components/profile-card";
import SiteInfoCard from "@/components/site-info-card";
import TargetCard from "@/components/target-card";
import TocCard from "@/components/toc-card";
import { getSiteConfig } from "@/lib/data";
import { extractHeadings } from "@/lib/markdown";
import {
  getAllCategories,
  getAllPosts,
  getAllTags,
  getPostBySlug,
} from "@/lib/posts";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return {
    title: post ? post.title : "文章不存在",
    description: post?.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [site, post, categories, tags] = await Promise.all([
    getSiteConfig(),
    getPostBySlug(slug),
    getAllCategories(),
    getAllTags(),
  ]);
  const allPosts = await getAllPosts();

  if (!post) notFound();

  const headings = extractHeadings(post.content);

  return (
    <>
      <section
        data-nav-hero
        className="relative h-[calc(100vh*3/7)] min-h-[280px] overflow-hidden"
      >
        <Image
          src={post.cover}
          alt={post.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-ink/10 to-paper" />
      </section>

      <section className="paper-bg pb-16 pt-8">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <Link
            href="/blog/"
            className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-orange"
          >
            <ArrowLeft className="h-4 w-4" />
            返回博客
          </Link>

          <header className="mx-auto mt-6 max-w-3xl text-center">
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {post.date}
              </span>
              {post.updated && (
                <span className="flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4" />
                  更新 {post.updated}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <FolderOpen className="h-4 w-4" />
                {post.category}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <Busuanzi mode="page" />
              </span>
            </div>
          </header>

          <div className="mx-auto mt-10 grid max-w-6xl gap-8 lg:grid-cols-[1fr_320px]">
            <article id="article-body" className="min-w-0">
              <div className="hand-card-tight p-6 md:p-9">
                <PostBody content={post.content} />
              </div>

              <div className="hand-card-tight mt-8 p-6">
                <p className="text-lg font-semibold">
                  文章作者：{site.author}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  本博客所有文章除特别声明外，均采用{" "}
                  <a
                    href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-sky underline underline-offset-4"
                  >
                    CC BY-NC-SA 4.0
                  </a>{" "}
                  许可协议。转载请注明来源
                  <Link
                    href="/blog/"
                    className="font-medium text-orange underline underline-offset-4"
                  >
                    Xikiy&apos;s blog
                  </Link>
                </p>
              </div>
            </article>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <ProfileCard
                profile={site.profile}
                postCount={allPosts.length}
                tagCount={tags.length}
                categoryCount={categories.length}
              />
              <TargetCard target={site.currentTarget} />
              <TocCard headings={headings} articleId="article-body" />
              <SiteInfoCard lastUpdated={site.stats.lastUpdated} />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
