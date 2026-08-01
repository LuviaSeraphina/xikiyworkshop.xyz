"use client";

import { useEffect, useMemo, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { Crop, X } from "lucide-react";
import { PrimaryButton } from "./ui";

async function cropImage(src: string, area: Area): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("图片加载失败"));
    img.src = src;
  });
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(area.width));
  canvas.height = Math.max(1, Math.round(area.height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas 不可用");
  ctx.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    canvas.width,
    canvas.height
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("导出图片失败")),
      "image/jpeg",
      0.92
    );
  });
}

type CropDialogProps = {
  file: File | null;
  onClose: () => void;
  onSaved: (file: File) => Promise<void> | void;
};

export default function CropDialog({
  file,
  onClose,
  onSaved,
}: CropDialogProps) {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(1);
  const [pixels, setPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url]
  );

  if (!file || !url) return null;

  const save = async () => {
    if (!pixels || busy) return;
    setBusy(true);
    try {
      const blob = await cropImage(url, pixels);
      const name = `${file.name.replace(/\.\w+$/, "")}-cropped.jpg`;
      await onSaved(new File([blob], name, { type: "image/jpeg" }));
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/55 px-4 backdrop-blur-sm">
      <div className="hand-card w-full max-w-3xl p-5">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-hand text-3xl">
            <Crop className="h-5 w-5 text-orange" />
            裁剪图片
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost h-9 w-9 px-0"
            aria-label="关闭"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative mt-4 h-[46vh] overflow-hidden rounded-2xl border-2 border-line bg-ink/10">
          <Cropper
            image={url}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            showGrid
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_area, areaPixels) => setPixels(areaPixels)}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            {[1, 16 / 9, 4 / 3].map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => setAspect(ratio)}
                className={`rounded-xl border-2 px-3 py-1.5 text-xs font-medium transition ${
                  aspect === ratio
                    ? "border-orange bg-orange/10 text-orange"
                    : "border-line bg-cream text-muted"
                }`}
              >
                {ratio === 1 ? "1:1" : ratio === 16 / 9 ? "16:9" : "4:3"}
              </button>
            ))}
          </div>
          <label className="flex flex-1 items-center gap-2 text-sm text-muted">
            缩放
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="flex-1 accent-orange"
            />
          </label>
          <PrimaryButton onClick={save} className="h-10">
            {busy ? "处理中..." : "保存裁剪"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
