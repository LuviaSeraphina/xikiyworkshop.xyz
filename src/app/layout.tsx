import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/caveat/400.css";
import "@fontsource/caveat/600.css";
import "@fontsource/caveat/700.css";
import "@fontsource/ma-shan-zheng/400.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { getSiteConfig } from "@/lib/data";
import { getPostSummaries } from "@/lib/posts";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    title: `${site.siteName} - ${site.author}`,
    description: site.intro,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getSiteConfig();
  const posts = await getPostSummaries();

  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <SiteHeader
          siteName={site.siteName}
          nav={site.nav}
          posts={posts}
        />
        <main className="flex-1">{children}</main>
        <SiteFooter text={site.footerText} />
      </body>
    </html>
  );
}
