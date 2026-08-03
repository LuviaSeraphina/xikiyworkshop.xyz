import Image from "next/image";
import { cn } from "@/lib/format";

type PageHeroProps = {
  image: string;
  title?: string;
  subtitle?: string;
  height?: "full" | "three-seventh";
  children?: React.ReactNode;
};

export default function PageHero({
  image,
  title,
  subtitle,
  height = "three-seventh",
  children,
}: PageHeroProps) {
  return (
    <section
      data-nav-hero
      className={cn(
        "relative w-full overflow-hidden bg-ink",
        height === "full" ? "min-h-screen" : "h-[calc(100vh*3/7)]"
      )}
    >
      <Image
        src={image}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/10 to-paper" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-12 text-center text-white">
        {title && (
          <h1 className="hero-title-shadow font-hand text-6xl md:text-8xl">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="mt-3 max-w-xl text-lg text-white/90 md:text-xl">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
