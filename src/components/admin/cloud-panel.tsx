"use client";

import { useState } from "react";
import { Plus, Save } from "lucide-react";
import type { CloudConfig, CloudNode } from "@/lib/types";
import {
  Field,
  PanelCard,
  PrimaryButton,
  inputClass,
} from "./ui";

function insertNode(
  nodes: CloudNode[],
  parentPath: string,
  node: CloudNode
): boolean {
  const segments = parentPath.split("/").filter(Boolean);
  if (segments.length === 0) {
    nodes.push(node);
    return true;
  }
  const target = segments[0];
  for (const child of nodes) {
    if (
      child.type === "folder" &&
      child.name.replace(/\/$/, "") === target
    ) {
      const rest = segments.slice(1).join("/");
      if (!rest) {
        child.children = child.children ?? [];
        child.children.push(node);
        return true;
      }
      return insertNode(child.children ?? [], rest, node);
    }
  }
  return false;
}

export default function CloudPanel({
  initialConfig,
}: {
  initialConfig: CloudConfig;
}) {
  const [text, setText] = useState(() =>
    JSON.stringify(initialConfig.tree, null, 2)
  );
  const [bucket, setBucket] = useState(initialConfig.bucket);
  const [bucketSize, setBucketSize] = useState(initialConfig.bucketSize);
  const [parent, setParent] = useState("xikiy-bucket");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [size, setSize] = useState("");
  const [type, setType] = useState<"file" | "folder">("file");
  const [saved, setSaved] = useState(false);

  const load = async () => {
    const res = await fetch("/api/dev/cloud");
    const data = (await res.json()) as CloudConfig;
    setText(JSON.stringify(data.tree, null, 2));
    setBucket(data.bucket);
    setBucketSize(data.bucketSize);
  };

  const save = async () => {
    let tree: CloudNode[];
    try {
      tree = JSON.parse(text) as CloudNode[];
    } catch {
      window.alert("云盘 JSON 格式错误");
      return;
    }
    await fetch("/api/dev/cloud", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucket, bucketSize, tree }),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
    await load();
  };

  const add = () => {
    if (!name.trim()) return;
    const tree = JSON.parse(text) as CloudNode[];
    const node: CloudNode =
      type === "folder"
        ? { name: name.trim().replace(/\/$/, "") + "/", type: "folder", children: [] }
        : { name: name.trim(), type: "file", url: url.trim(), size: size.trim() };
    if (!insertNode(tree, parent.trim(), node)) {
      window.alert("找不到父文件夹路径");
      return;
    }
    setText(JSON.stringify(tree, null, 2));
    setName("");
    setUrl("");
    setSize("");
  };

  return (
    <div className="space-y-6">
      <PanelCard
        title="云盘目录"
        description="直接编辑 JSON 树，也可以使用下面的快速添加表单。"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="桶名称">
            <input
              className={inputClass}
              value={bucket}
              onChange={(event) => setBucket(event.target.value)}
            />
          </Field>
          <Field label="桶大小（MB / GB）">
            <input
              className={inputClass}
              value={bucketSize}
              onChange={(event) => setBucketSize(event.target.value)}
            />
          </Field>
          <Field label="目录 JSON" className="md:col-span-2">
            <textarea
              className={`${inputClass} min-h-80 resize-y font-mono text-xs`}
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </Field>
        </div>
        <PrimaryButton onClick={save} className="mt-4">
          <Save className="mr-2 inline h-4 w-4" />
          {saved ? "已保存" : "保存云盘"}
        </PrimaryButton>
      </PanelCard>

      <PanelCard title="快速添加">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Field label="类型">
            <select
              className={inputClass}
              value={type}
              onChange={(event) =>
                setType(event.target.value as "file" | "folder")
              }
            >
              <option value="file">文件</option>
              <option value="folder">文件夹</option>
            </select>
          </Field>
          <Field label="父文件夹（如 xikiy-bucket/照片）">
            <input
              className={inputClass}
              value={parent}
              onChange={(event) => setParent(event.target.value)}
            />
          </Field>
          <Field label="名称">
            <input
              className={inputClass}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
          {type === "file" && (
            <>
              <Field label="下载链接">
                <input
                  className={inputClass}
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                />
              </Field>
              <Field label="大小">
                <input
                  className={inputClass}
                  value={size}
                  onChange={(event) => setSize(event.target.value)}
                />
              </Field>
            </>
          )}
        </div>
        <PrimaryButton onClick={add} className="mt-4">
          <Plus className="mr-2 inline h-4 w-4" />
          加入目录
        </PrimaryButton>
      </PanelCard>
    </div>
  );
}
