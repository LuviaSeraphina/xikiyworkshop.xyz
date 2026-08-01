import PageHero from "@/components/page-hero";
import TimelineView from "@/components/timeline-view";
import { getSiteConfig } from "@/lib/data";
import { getPostSummaries } from "@/lib/posts";

export default async function TimelinePage() {
  const [site, posts] = await Promise.all([
    getSiteConfig(),
    getPostSummaries(),
  ]);

  return (
    <>
      <PageHero
        image={site.heroImages.timeline}
        title="Timeline"
        subtitle="按时间把走过的路铺开"
      />
      <section className="paper-bg pb-16 pt-10">
        <div className="mx-auto max-w-3xl px-5 md:px-6">
          <TimelineView posts={posts} />
        </div>
      </section>
    </>
  );
}
