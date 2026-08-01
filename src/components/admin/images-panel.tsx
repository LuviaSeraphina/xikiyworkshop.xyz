"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import CropDialog from "./crop-dialog";
import { PanelCard } from "./ui";
import type { ImageEntry } from "./types";

export default function ImagesPanel({
  initialImages,
}: {
  initialImages: ImageEntry[];
}) {
  const [images, setImages] = useState<ImageEntry[]>(initialImages);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const res = await fetch("/api/dev/images");
    const data = await res.json();
    setImages(data.images ?? []);
  };

  const upload = async (file: File) => {
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      await fetch("/api/dev/images", { method: "POST", body: form });
      await load();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (name: string) => {
    if (!window.confirm(`删除 ${name}？`)) return;
    await fetch(`/api/dev/images?name=${encodeURIComponent(name)}`, {
      method: "DELETE",
    });
    await load();
  };

  return (
    <div className="space-y-6">
      <PanelCard
        title="图片管理"
        description="上传后可以在线裁剪；生成的新图片会直接保存到 public/images。"
      >
        <div className="flex flex-wrap items-center gap-3">
          <label className="btn-ink h-10 cursor-pointer px-4 text-sm">
            <ImagePlus className="mr-2 inline h-4 w-4" />
            选择图片并裁剪
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) =>
                setCropFile(event.target.files?.[0] ?? null)
              }
            />
          </label>
          {busy && (
            <span className="flex items-center gap-2 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              上传中...
            </span>
          )}
        </div>
      </PanelCard>

      <PanelCard title="已上传图片">
        {images.length === 0 ? (
          <p className="py-6 text-center text-muted">还没有图片</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image) => (
              <div
                key={image.name}
                className="group overflow-hidden rounded-2xl border-2 border-line bg-cream"
              >
                <div className="relative aspect-video overflow-hidden bg-ink/5">
                  <Image
                    src={`/images/${image.name}`}
                    alt={image.name}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                <div className="p-2">
                  <p className="truncate text-xs font-medium">{image.name}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] text-muted">
                      {(image.size / 1024).toFixed(1)} KB
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(image.name)}
                      className="rounded-lg p-1 text-muted transition hover:bg-berry/10 hover:text-berry"
                      aria-label={`删除 ${image.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PanelCard>

      <CropDialog
        file={cropFile}
        onClose={() => setCropFile(null)}
        onSaved={upload}
      />
    </div>
  );
}
