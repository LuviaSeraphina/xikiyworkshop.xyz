import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const imagesDir = path.join(process.cwd(), "public", "images");
const allowed = /\.(jpe?g|png|webp|gif|svg|avif)$/i;

function devBlocked() {
  if (process.env.DEVELOPER_MODE !== "true") {
    return NextResponse.json({ error: "开发模式未开启" }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const denied = devBlocked();
  if (denied) return denied;
  const files = await fs.readdir(imagesDir);
  const images = await Promise.all(
    files
      .filter((file) => allowed.test(file))
      .map(async (file) => {
        const stat = await fs.stat(path.join(imagesDir, file));
        return { name: file, size: stat.size };
      })
  );
  return NextResponse.json({ images });
}

export async function POST(request: Request) {
  const denied = devBlocked();
  if (denied) return denied;

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !file.name || !allowed.test(file.name)) {
    return NextResponse.json({ error: "不支持的图片文件" }, { status: 400 });
  }

  const safeName = file.name.replace(/[^\w.\u4e00-\u9fa5-]/g, "-");
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(imagesDir, safeName), buffer);
  return NextResponse.json({ ok: true, path: `/images/${safeName}` });
}

export async function DELETE(request: Request) {
  const denied = devBlocked();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  if (!name || !allowed.test(name)) {
    return NextResponse.json({ error: "缺少图片名称" }, { status: 400 });
  }

  try {
    await fs.unlink(path.join(imagesDir, name));
  } catch {
    return NextResponse.json({ error: "图片不存在" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
