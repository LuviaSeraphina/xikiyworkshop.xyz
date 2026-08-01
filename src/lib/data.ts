import { promises as fs } from "fs";
import path from "path";
import type { CloudConfig, SiteConfig } from "./types";

const dataDir = path.join(process.cwd(), "data");
const imagesDir = path.join(process.cwd(), "public", "images");
const imageExt = /\.(jpe?g|png|webp|gif|svg|avif)$/i;

export async function getSiteConfig(): Promise<SiteConfig> {
  const raw = await fs.readFile(path.join(dataDir, "site.json"), "utf-8");
  return JSON.parse(raw) as SiteConfig;
}

export async function getCloudConfig(): Promise<CloudConfig> {
  const raw = await fs.readFile(path.join(dataDir, "cloud.json"), "utf-8");
  return JSON.parse(raw) as CloudConfig;
}

export async function getImages() {
  const files = await fs.readdir(imagesDir);
  const images = await Promise.all(
    files
      .filter((file) => imageExt.test(file))
      .map(async (name) => {
        const stat = await fs.stat(path.join(imagesDir, name));
        return { name, size: stat.size };
      })
  );
  return images;
}
