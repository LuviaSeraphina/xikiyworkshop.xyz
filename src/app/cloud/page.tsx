import PageHero from "@/components/page-hero";
import ProfileCard from "@/components/profile-card";
import SiteInfoCard from "@/components/site-info-card";
import TargetCard from "@/components/target-card";
import CloudTree from "@/components/cloud-tree";
import { getCloudConfig, getSiteConfig } from "@/lib/data";
import { getAllCategories, getAllTags, getPostSummaries } from "@/lib/posts";

export default async function CloudPage() {
  const [site, cloud, posts, categories, tags] = await Promise.all([
    getSiteConfig(),
    getCloudConfig(),
    getPostSummaries(),
    getAllCategories(),
    getAllTags(),
  ]);

  return (
    <>
      <PageHero
        image={site.heroImages.cloud}
        title="妙妙R2对象存储"
        subtitle={`${cloud.bucket}/ · ${cloud.bucketSize}`}
      />
      <section className="paper-bg pb-16 pt-10">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:px-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <ProfileCard
              profile={site.profile}
              postCount={posts.length}
              tagCount={tags.length}
              categoryCount={categories.length}
              bucketSize={cloud.bucketSize}
              showBucketSize
            />
            <TargetCard target={site.currentTarget} />
            <SiteInfoCard lastUpdated={site.stats.lastUpdated} />
          </aside>
          <CloudTree tree={cloud.tree} bucket={cloud.bucket} />
        </div>
      </section>
    </>
  );
}
