import PageHero from "@/components/page-hero";
import TimelineView from "@/components/timeline-view";
import { getSiteConfig } from "@/lib/data";
import { getAllTags, getPostSummaries } from "@/lib/posts";
import { decodeParam } from "@/lib/format";

export const dynamicParams = false;

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag }));
}

export default async function TagTimelinePage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: rawTag } = await params;
  const tag = decodeParam(rawTag);
  const [site, posts] = await Promise.all([
    getSiteConfig(),
    getPostSummaries(),
  ]);
  const filtered = posts.filter((post) => post.tags.includes(tag));

  return (
    <>
      <PageHero
        image={site.heroImages.timeline}
        title="Timeline"
        subtitle={`标签：${tag}`}
      />
      <section className="paper-bg pb-16 pt-10">
        <div className="mx-auto max-w-3xl px-5 md:px-6">
          <TimelineView posts={filtered} />
        </div>
      </section>
    </>
  );
}
