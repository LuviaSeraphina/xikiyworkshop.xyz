import AdminShell from "@/components/admin/admin-shell";
import { getCloudConfig, getImages, getSiteConfig } from "@/lib/data";
import { getAllPosts } from "@/lib/posts";

export default async function AdminPage() {
  const [site, cloud, posts, images] = await Promise.all([
    getSiteConfig(),
    getCloudConfig(),
    getAllPosts(),
    getImages(),
  ]);

  return (
    <AdminShell
      initialSite={site}
      initialCloud={cloud}
      initialPosts={posts.map((post) => ({
        ...post,
        updated: post.updated ?? "",
      }))}
      initialImages={images}
    />
  );
}
