import { CalendarClock } from "lucide-react";
import Busuanzi from "@/components/busuanzi";

type SiteInfoCardProps = {
  lastUpdated: string;
};

export default function SiteInfoCard({ lastUpdated }: SiteInfoCardProps) {
  return (
    <div className="hand-card-tight p-5">
      <h3 className="font-hand text-2xl leading-none">网站信息</h3>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-2 rounded-lg bg-cream px-3 py-2">
          <span className="text-muted">访客 / 浏览</span>
          <Busuanzi mode="site" />
        </div>
        <div className="flex items-center justify-between gap-2 rounded-lg bg-cream px-3 py-2">
          <span className="text-muted">最后更新</span>
          <span className="flex items-center gap-1.5 font-medium">
            <CalendarClock className="h-4 w-4 text-orange" />
            {lastUpdated}
          </span>
        </div>
      </div>
    </div>
  );
}
