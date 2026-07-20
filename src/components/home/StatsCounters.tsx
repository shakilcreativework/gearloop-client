"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();

          function tick(now: number) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, count };
}

const STATS = [
  { target: 2400, suffix: "+", label: "Gear Items Listed" },
  { target: 180, suffix: "+", label: "Cities Covered" },
  { target: 12500, suffix: "+", label: "Rentals Completed" },
  { target: 98, suffix: "%", label: "Satisfaction Rate" },
];

export default function StatsCounters() {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((stat) => {
            const { ref, count } = useCountUp(stat.target);
            return (
              <div key={stat.label} ref={ref} className="text-center">
                <p className="text-3xl font-bold text-primary sm:text-4xl">
                  {count.toLocaleString()}
                  {stat.suffix}
                </p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
