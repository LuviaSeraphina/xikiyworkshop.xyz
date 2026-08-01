import Image from "next/image";
import GitHubIcon from "@/components/github-icon";
import type { Profile } from "@/lib/types";

type ProfileCardProps = {
  profile: Profile;
  postCount: number;
  tagCount: number;
  categoryCount: number;
  bucketSize?: string;
  showBucketSize?: boolean;
};

export default function ProfileCard({
  profile,
  postCount,
  tagCount,
  categoryCount,
  bucketSize,
  showBucketSize = false,
}: ProfileCardProps) {
  return (
    <div className="hand-card flex flex-col items-center gap-3 p-6 text-center">
      <div className="relative">
        <Image
          src={profile.avatar}
          alt={profile.name}
          width={96}
          height={96}
          className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-[4px_4px_0_rgba(38,34,28,0.14)]"
        />
        <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full border-2 border-white bg-leaf shadow" />
      </div>
      <div>
        <p className="font-hand text-3xl leading-tight">{profile.name}</p>
        <p className="mt-1 text-sm text-muted">{profile.signature}</p>
      </div>

      {showBucketSize ? (
        <div className="w-full rounded-xl border-2 border-dashed border-line bg-cream px-3 py-2 text-sm">
          <span className="text-muted">R2 存储桶：</span>
          <span className="font-semibold text-orange">{bucketSize}</span>
        </div>
      ) : (
        <div className="grid w-full grid-cols-3 gap-1 text-center">
          <div className="rounded-lg bg-sky/10 px-1 py-2">
            <p className="text-lg font-bold text-sky">{postCount}</p>
            <p className="text-[11px] text-muted">文章</p>
          </div>
          <div className="rounded-lg bg-leaf/10 px-1 py-2">
            <p className="text-lg font-bold text-leaf">{tagCount}</p>
            <p className="text-[11px] text-muted">标签</p>
          </div>
          <div className="rounded-lg bg-berry/10 px-1 py-2">
            <p className="text-lg font-bold text-berry">{categoryCount}</p>
            <p className="text-[11px] text-muted">分类</p>
          </div>
        </div>
      )}

      <a
        href={profile.github}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-follow h-11 w-full px-4 text-sm font-semibold"
      >
        <GitHubIcon className="h-4 w-4" />
        Follow Me
      </a>

      <a
        href={profile.github}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-line bg-cream text-ink transition hover:border-ink hover:shadow-[3px_3px_0_rgba(38,34,28,0.15)]"
        aria-label="GitHub"
      >
        <GitHubIcon className="h-5 w-5" />
      </a>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://count.getloli.com/@LuviaSeraphina?theme=rule34"
        alt="LuviaSeraphina"
        className="h-24 w-auto max-w-full md:h-28"
      />
    </div>
  );
}
