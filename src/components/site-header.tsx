"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import SearchDialog from "@/components/search-dialog";
import { cn } from "@/lib/format";
import type { NavItem, PostSummary } from "@/lib/types";

type SiteHeaderProps = {
  siteName: string;
  nav: NavItem[];
  posts: PostSummary[];
};

export default function SiteHeader({
  siteName,
  nav,
  posts,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [overHero, setOverHero] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchOpenChange = useCallback((next: boolean) => {
    setSearchOpen(next);
    if (next) setMobileOpen(false);
  }, []);

  const devMode =
    process.env.NEXT_PUBLIC_DEVELOPER_MODE === "true";

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY && y > 90);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const heroElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-hero]")
    );
    if (heroElements.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setOverHero(entries.some((entry) => entry.isIntersecting));
      },
      { rootMargin: "0px 0px -85% 0px", threshold: 0 }
    );
    heroElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        hidden && "nav-hidden",
        !overHero && "header-solid"
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6",
          overHero ? "text-white" : "text-ink"
        )}
      >
        <Link
          href="/"
          onClick={() => setSearchOpen(false)}
          className="font-hand text-3xl leading-none drop-shadow-sm"
        >
          {siteName}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSearchOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-white/15",
                isActive(item.href) && "underline decoration-orange decoration-2 underline-offset-8"
              )}
            >
              {item.label}
            </Link>
          ))}
          <span className="mx-1 h-5 w-px bg-current opacity-20" />
          <SearchDialog
            posts={posts}
            open={searchOpen}
            onOpenChange={handleSearchOpenChange}
            onNavigate={() => setMobileOpen(false)}
          />
          {devMode && (
            <Link
              href="/admin/"
              onClick={() => setSearchOpen(false)}
              className="btn-ink ml-1 h-9 px-3 text-xs"
            >
              管理
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <SearchDialog
            posts={posts}
            open={searchOpen}
            onOpenChange={handleSearchOpenChange}
            onNavigate={() => setMobileOpen(false)}
          />
          <button
            type="button"
            onClick={() => {
              setSearchOpen(false);
              setMobileOpen((value) => !value);
            }}
            className="btn-ghost h-10 w-10 px-0"
            aria-label="菜单"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t-2 border-dashed border-line bg-cream/95 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  setSearchOpen(false);
                  setMobileOpen(false);
                }}
                className={cn(
                  "rounded-lg px-3 py-2.5 font-medium",
                  isActive(item.href) && "bg-orange/10 text-orange"
                )}
              >
                {item.label}
              </Link>
            ))}
            {devMode && (
              <Link
                href="/admin/"
                onClick={() => {
                  setSearchOpen(false);
                  setMobileOpen(false);
                }}
                className="btn-ink h-10"
              >
                管理后台
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
