import { PenLine } from "lucide-react";
import type { CurrentTarget } from "@/lib/types";

type TargetCardProps = {
  target: CurrentTarget;
};

export default function TargetCard({ target }: TargetCardProps) {
  return (
    <div className="hand-card-tight p-5">
      <div className="flex items-center gap-2">
        <PenLine className="h-4 w-4 text-orange" />
        <h3 className="font-hand text-2xl leading-none">{target.title}</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {target.items.map((item) => (
          <li
            key={item}
            className="flex gap-2 rounded-lg bg-cream px-3 py-2 text-sm text-ink/80"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
