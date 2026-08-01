"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type BusuanziProps = {
  mode: "site" | "page";
};

const BANNED_TEXT = "域名/IP已被禁用";
let lastLoadedPath = "";

async function refreshBusuanzi() {
  try {
    const res = await fetch("https://cdn.busuanzi.cc/api.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: window.location.href,
        referrer: document.referrer,
      }),
    });
    const data = (await res.json()) as Record<string, string>;
    for (const [key, value] of Object.entries(data)) {
      const display =
        value && value !== BANNED_TEXT ? value : "—";
      document
        .querySelectorAll(`#${key}`)
        .forEach((element) => {
          element.textContent = display;
        });
    }
  } catch {
    // 本地或离线环境下保持占位符，线上部署后由不蒜子回填真实数据。
  }
}

export default function Busuanzi({ mode }: BusuanziProps) {
  const pathname = usePathname();

  useEffect(() => {
    const path = `${window.location.pathname}${window.location.search}`;
    if (lastLoadedPath === path) return;
    lastLoadedPath = path;
    refreshBusuanzi();
  }, [pathname]);

  return (
    <span
      aria-live="polite"
      className="inline-flex items-baseline gap-2 tabular-nums"
    >
      {mode === "site" ? (
        <>
          <span>
            访客{" "}
            <span
              id="busuanzi_value_site_uv"
              className="font-semibold text-orange"
            >
              0
            </span>
          </span>
          <span>
            浏览{" "}
            <span
              id="busuanzi_value_site_pv"
              className="font-semibold text-sky"
            >
              0
            </span>
          </span>
        </>
      ) : (
        <span>
          阅读{" "}
          <span
            id="busuanzi_value_page_pv"
            className="font-semibold text-orange"
          >
            0
          </span>
        </span>
      )}
    </span>
  );
}
