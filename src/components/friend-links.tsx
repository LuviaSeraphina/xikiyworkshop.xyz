import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { FriendLink } from "@/lib/types";

type FriendLinksProps = {
  title: string;
  links: FriendLink[];
};

export default function FriendLinks({ title, links }: FriendLinksProps) {
  return (
    <div>
      <h2 className="font-hand text-5xl leading-none">{title}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-card-hover hand-card-tight group flex items-center gap-4 p-4"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-line">
              <Image
                src={link.image}
                alt={link.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-110"
                sizes="64px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 font-bold transition group-hover:text-orange">
                {link.name}
                <ArrowUpRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-muted">
                {link.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
