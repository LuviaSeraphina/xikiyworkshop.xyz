import PageHero from "@/components/page-hero";
import ProfileCard from "@/components/profile-card";
import TargetCard from "@/components/target-card";
import FriendLinks from "@/components/friend-links";
import { getSiteConfig } from "@/lib/data";
import { getAllCategories, getAllTags, getPostSummaries } from "@/lib/posts";

export default async function FriendsPage() {
  const [site, posts, categories, tags] = await Promise.all([
    getSiteConfig(),
    getPostSummaries(),
    getAllCategories(),
    getAllTags(),
  ]);

  return (
    <>
      <PageHero
        image={site.heroImages.friends}
        title="Friends"
        subtitle="谢谢一路同行的朋友们"
      />
      <section className="paper-bg pb-16 pt-10">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:px-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <ProfileCard
              profile={site.profile}
              postCount={posts.length}
              tagCount={tags.length}
              categoryCount={categories.length}
            />
            <TargetCard target={site.currentTarget} />
          </aside>
          <div className="space-y-12">
            <FriendLinks title="友情链接" links={site.friends} />
            <FriendLinks title="宝藏链接" links={site.treasures} />
          </div>
        </div>
      </section>
    </>
  );
}
