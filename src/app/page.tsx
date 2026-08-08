import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Cloud,
  Feather,
  PenTool,
  Rocket,
  Star,
} from "lucide-react";
import GithubIcon from "@/components/github-icon";
import Reveal from "@/components/reveal";
import Typewriter from "@/components/typewriter";
import { getSiteConfig } from "@/lib/data";
import { getPostSummaries } from "@/lib/posts";
import { getProjects } from "@/lib/projects";

const languageColors: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178C6",
  JavaScript: "#f1e05a",
  Java: "#b07219",
  Shell: "#89e051",
  Go: "#00ADD8",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Rust: "#dea584",
};

const languageColor = (language: string) =>
  languageColors[language] ?? "#f97316";

export default async function HomePage() {
  const site = await getSiteConfig();
  const posts = await getPostSummaries();
  const projects = await getProjects(site.profile.githubName);

  return (
    <div className="pb-16">
      <section
        data-nav-hero
        className="relative flex min-h-screen items-center justify-center overflow-hidden"
      >
        <Image
          src={site.heroImages.home}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/25 to-paper" />

        <div className="relative z-10 mx-auto max-w-4xl -translate-y-[35px] px-6 pt-20 text-center text-white">
          <Reveal>
            <p className="font-hand text-2xl text-sun md:text-3xl">
              Hi, this is
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="hero-title-shadow mt-2 font-hand text-6xl leading-none md:text-8xl">
              {site.heroTitle}
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-5 text-2xl font-medium md:text-3xl">
              <Typewriter text={site.motto} />
            </p>
          </Reveal>
          <Reveal delay={380}>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
              {site.intro}
            </p>
          </Reveal>
          <Reveal delay={500}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/blog/" className="btn-ink h-12 px-6 text-sm">
                <Feather className="h-4 w-4" />
                逛逛博客
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-[68px] left-1/2 z-10 -translate-x-1/2 text-white">
          <ArrowDown className="scroll-hint h-6 w-6" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <div className="grid items-center gap-8 md:grid-cols-[300px_1fr]">
          <Reveal>
            <div className="hand-card relative p-6">
              <div className="float-doodle absolute -right-4 -top-4 rounded-xl bg-sun px-2 py-1 font-hand text-lg text-ink shadow-[3px_3px_0_rgba(38,34,28,0.15)]">
                hello!
              </div>
              <Image
                src={site.profile.avatar}
                alt={site.profile.name}
                width={220}
                height={140}
                className="mx-auto w-full max-w-[280px] rounded-2xl border-2 border-line object-cover"
              />
              <h2 className="mt-4 font-hand text-4xl">{site.profile.name}</h2>
              <p className="mt-2 text-sm text-muted">{site.profile.signature}</p>
              <p className="mt-4 text-sm leading-relaxed text-ink/75">
                {site.intro}
              </p>
            </div>
          </Reveal>

          <div>
            <Reveal delay={100}>
              <h2 className="font-hand text-5xl leading-tight md:text-6xl">
                关于我
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/75">
                我是 {site.author}，喜欢把「想做的事」一点点变成「做完的事」。
                白天写代码，晚上画点小画，偶尔把灵感记成博客。这里是我的数字工作间：
                技术、日常、设计，以及一些还没被命名的小计划。
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/blog/" className="btn-ghost h-11 px-5 text-sm">
                  阅读 {posts.length} 篇文章
                </Link>
                <a
                  href={site.profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost h-11 px-5 text-sm"
                >
                  GitHub
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="paper-bg border-y-2 border-dashed border-line py-16">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal className="text-center">
            <p className="font-hand text-2xl text-muted">my motto</p>
            <h2 className="mt-2 font-hand text-5xl md:text-7xl">
              “{site.motto}”
            </h2>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-hand text-2xl text-muted">toolbox</p>
              <h2 className="mt-1 font-hand text-4xl md:text-5xl">技术栈</h2>
            </div>
            <Rocket className="sway-doodle h-9 w-9 text-orange" />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-8 overflow-hidden rounded-2xl border-2 border-dashed border-line bg-cream/70 py-4">
            <div className="marquee-track gap-4 pr-4">
              {[...site.techStack, ...site.techStack].map((tech, index) => (
                <span
                  key={`${tech.name}-${index}`}
                  className="hand-card-tight flex h-14 items-center gap-2 px-5 text-base font-semibold"
                  style={{ color: tech.color ?? "#26221c" }}
                >
                  {tech.name}
                  <span className="text-xs text-muted">
                    {tech.level ? `${tech.level}/5` : ""}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {projects.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-hand text-2xl text-muted">my projects</p>
                <h2 className="mt-1 font-hand text-4xl md:text-5xl">
                  个人项目
                </h2>
              </div>
              <GithubIcon className="h-9 w-9 text-ink/70" />
            </div>
          </Reveal>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <Reveal key={project.name} delay={index * 80}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-card-hover hand-card-tight group flex h-full flex-col p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="truncate font-hand text-2xl leading-tight">
                      {project.name}
                    </h3>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-muted transition group-hover:text-orange" />
                  </div>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/70">
                    {project.description || "暂无简介"}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
                    {project.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor: languageColor(project.language),
                          }}
                        />
                        {project.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" />
                      {project.stars}
                    </span>
                    {project.updatedAt && (
                      <span>{project.updatedAt.slice(0, 10)}</span>
                    )}
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-5 pb-8 md:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              href: "/blog/",
              icon: Feather,
              title: "博客",
              desc: "日常、技术与设计笔记",
              color: "text-sky",
            },
            {
              href: "/cloud/",
              icon: Cloud,
              title: "云盘",
              desc: "R2 对象存储里的文件树",
              color: "text-orange",
            },
            {
              href: "/friends/",
              icon: PenTool,
              title: "友链",
              desc: "友情链接与宝藏链接",
              color: "text-leaf",
            },
          ].map((item, index) => (
            <Reveal key={item.href} delay={index * 120}>
              <Link
                href={item.href}
                className="blog-card-hover hand-card-tight flex h-full flex-col p-6"
              >
                <item.icon className={`h-8 w-8 ${item.color}`} />
                <h3 className="mt-4 font-hand text-4xl">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
