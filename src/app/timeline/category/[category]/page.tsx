import PageHero from "@/components/page-hero";
import TimelineView from "@/components/timeline-view";
import { getSiteConfig } from "@/lib/data";
import { getAllCategories, getPostSummaries } from "@/lib/posts";
import { decodeParam } from "@/lib/format";

export const dynamicParams = false;

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({ category }));
}

export default async function CategoryTimelinePage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: rawCategory } = await params;
  const category = decodeParam(rawCategory);
  const [site, posts] = await Promise.all([
    getSiteConfig(),
    getPostSummaries(),
  ]);
  const filtered = posts.filter((post) => post.category === category);

  return (
    <>
      <PageHero
        image={site.heroImages.timeline}
        title="Timeline"
        subtitle={`分类：${category}`}
      />
      <section className="paper-bg pb-16 pt-10">
        <div className="mx-auto max-w-3xl px-5 md:px-6">
          <TimelineView posts={filtered} />
        </div>
      </section>
    </>
  );
}
