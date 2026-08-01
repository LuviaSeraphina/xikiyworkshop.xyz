import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

type PostBodyProps = {
  content: string;
};

export default function PostBody({ content }: PostBodyProps) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
