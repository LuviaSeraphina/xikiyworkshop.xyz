import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const filePath = path.join(process.cwd(), "data", "site.json");

function devBlocked() {
  if (process.env.DEVELOPER_MODE !== "true") {
    return NextResponse.json({ error: "开发模式未开启" }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const denied = devBlocked();
  if (denied) return denied;
  const raw = await fs.readFile(filePath, "utf-8");
  return NextResponse.json(JSON.parse(raw));
}

export async function POST(request: Request) {
  const denied = devBlocked();
  if (denied) return denied;
  const payload = await request.json();
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf-8");
  return NextResponse.json({ ok: true });
}
