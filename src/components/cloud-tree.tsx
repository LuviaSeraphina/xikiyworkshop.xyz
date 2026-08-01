"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Download,
  File,
  Folder,
  FolderOpen,
  Search,
} from "lucide-react";
import type { CloudNode } from "@/lib/types";

type CloudTreeProps = {
  tree: CloudNode[];
  bucket: string;
};

type FlatEntry = {
  node: CloudNode;
  path: string[];
};

function flatten(nodes: CloudNode[], path: string[] = []): FlatEntry[] {
  return nodes.flatMap((node) => {
    const next = [...path, node.name];
    return [
      { node, path: next },
      ...(node.children ? flatten(node.children, next) : []),
    ];
  });
}

function pathKey(path: string[]) {
  return path.join(" / ");
}

function FolderNode({
  node,
  path,
  depth,
  expanded,
  onToggle,
}: {
  node: CloudNode;
  path: string[];
  depth: number;
  expanded: Set<string>;
  onToggle: (key: string) => void;
}) {
  const key = pathKey(path);
  const isOpen = expanded.has(key);

  return (
    <div>
      <button
        type="button"
        onClick={() => onToggle(key)}
        className="group flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left transition hover:bg-sky/5"
        style={{ paddingLeft: `${depth * 1.25 + 0.75}rem` }}
      >
        {isOpen ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-sky" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-sky" />
        )}
        {isOpen ? (
          <FolderOpen className="h-4 w-4 shrink-0 text-orange" />
        ) : (
          <Folder className="h-4 w-4 shrink-0 text-orange" />
        )}
        <span className="font-medium">{node.name}</span>
      </button>
      {isOpen && node.children && (
        <div className="mt-1 space-y-1">
          {node.children.map((child) =>
            child.type === "folder" ? (
              <FolderNode
                key={pathKey([...path, child.name])}
                node={child}
                path={[...path, child.name]}
                depth={depth + 1}
                expanded={expanded}
                onToggle={onToggle}
              />
            ) : (
              <FileRow
                key={pathKey([...path, child.name])}
                file={child}
                depth={depth + 1}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

function FileRow({
  file,
  depth,
}: {
  file: CloudNode;
  depth: number;
}) {
  return (
    <a
      href={file.url}
      target="_blank"
      rel="noopener noreferrer"
      download={file.name}
      className="group flex items-center gap-2 rounded-xl px-3 py-2 text-left transition hover:bg-orange/5"
      style={{ paddingLeft: `${depth * 1.25 + 0.75}rem` }}
    >
      <File className="h-4 w-4 shrink-0 text-muted" />
      <span className="flex-1 truncate">{file.name}</span>
      {file.size && (
        <span className="shrink-0 text-xs text-muted">{file.size}</span>
      )}
      <Download className="h-4 w-4 shrink-0 text-muted transition group-hover:text-orange" />
    </a>
  );
}

export default function CloudTree({ tree, bucket }: CloudTreeProps) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const root = tree.find((node) => node.type === "folder");
    return root ? new Set([root.name]) : new Set();
  });

  const allEntries = useMemo(() => flatten(tree), [tree]);
  const keyword = query.trim().toLowerCase();
  const matches = keyword
    ? allEntries.filter(
        (entry) =>
          entry.node.name.toLowerCase().includes(keyword) ||
          pathKey(entry.path).toLowerCase().includes(keyword)
      )
    : [];

  const toggle = (key: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="hand-card-tight p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-orange" />
          <h2 className="font-hand text-3xl leading-none">{bucket}/</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索云盘文件..."
            className="h-10 w-56 rounded-xl border-2 border-line bg-cream pl-9 pr-3 text-sm outline-none transition focus:border-orange"
          />
        </div>
      </div>

      <div className="mt-5">
        {keyword ? (
          matches.length > 0 ? (
            <div className="space-y-1">
              {matches.map((entry) =>
                entry.node.type === "folder" ? (
                  <div
                    key={pathKey(entry.path)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2"
                  >
                    <Folder className="h-4 w-4 text-orange" />
                    <span className="truncate">{pathKey(entry.path)}</span>
                  </div>
                ) : (
                  <FileRow
                    key={pathKey(entry.path)}
                    file={entry.node}
                    depth={0}
                  />
                )
              )}
            </div>
          ) : (
            <p className="py-8 text-center text-muted">没有找到相关文件</p>
          )
        ) : (
          <div className="space-y-1">
            {tree.map((node) =>
              node.type === "folder" ? (
                <FolderNode
                  key={node.name}
                  node={node}
                  path={[node.name]}
                  depth={0}
                  expanded={expanded}
                  onToggle={toggle}
                />
              ) : (
                <FileRow
                  key={node.name}
                  file={node}
                  depth={0}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
