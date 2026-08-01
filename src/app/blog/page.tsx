import Image from "next/image";
import { ArrowDown } from "lucide-react";
import BlogCard from "@/components/blog-card";
import CategoriesCard from "@/components/categories-card";
import ProfileCard from "@/components/profile-card";
import SiteInfoCard from "@/components/site-info-card";
import TagsCard from "@/components/tags-card";
import TargetCard from "@/components/target-card";
import { getSiteConfig } from "@/lib/data";
import {
  getAllCategories,
  getAllTags,
  getPostSummaries,
} from "@/lib/posts";

export default async function BlogPage() {
  const site = await getSiteConfig();
  const posts = await getPostSummaries();
  const categories = await getAllCategories();
  const tags = await getAllTags();

  return (
    <>
      <div className="fixed inset-0 -z-10">
        <Image
          src={site.heroImages.blog}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/25 to-paper/80" />
      </div>

      <section
        data-nav-hero
        className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center text-white"
      >
        <p className="font-hand text-2xl text-sun">welcome to my corner</p>
        <h1 className="hero-title-shadow mt-2 font-hand text-6xl leading-none md:text-8xl">
          Xikiy‘s blogs
        </h1>
        <p className="mt-4 text-xl text-white/90 md:text-2xl">
          {site.blogMotto}
        </p>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ArrowDown className="scroll-hint h-7 w-7" />
        </div>
      </section>

      <section className="relative z-10 rounded-t-[2.5rem] border-t-2 border-dashed border-line bg-paper pb-16 pt-10">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:px-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <ProfileCard
              profile={site.profile}
              postCount={posts.length}
              tagCount={tags.length}
              categoryCount={categories.length}
            />
            <TargetCard target={site.currentTarget} />
            <CategoriesCard posts={posts} />
            <TagsCard posts={posts} />
            <SiteInfoCard lastUpdated={site.stats.lastUpdated} />
          </aside>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-hand text-4xl leading-none">全部文章</h2>
              <span className="rounded-xl bg-sky/10 px-3 py-1 text-sm font-semibold text-sky">
                {posts.length} 篇
              </span>
            </div>
            {posts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
