import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import { slugify } from "./format";

export type Heading = {
  id: string;
  text: string;
  level: number;
};

export function extractHeadings(markdown: string): Heading[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
  const headings: Heading[] = [];

  visit<Root, "heading">(tree, "heading", (node) => {
    const text = node.children
      .map((child) => {
        if ("value" in child && typeof child.value === "string") {
          return child.value;
        }
        return "";
      })
      .join("");
    headings.push({ id: slugify(text), text, level: node.depth });
  });

  return headings;
}
