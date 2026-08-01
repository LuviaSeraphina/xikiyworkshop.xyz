"use client";

import { useEffect, useState } from "react";

type TypewriterProps = {
  text: string;
  speed?: number;
  className?: string;
};

export default function Typewriter({
  text,
  speed = 120,
  className,
}: TypewriterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= text.length) return;
    const timer = window.setTimeout(
      () => setCount((value) => value + 1),
      speed
    );
    return () => window.clearTimeout(timer);
  }, [count, text, speed]);

  return (
    <span className={`typewriter ${className ?? ""}`}>
      {text.slice(0, count)}
    </span>
  );
}
