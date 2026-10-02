"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

const format = (n: number) => new Intl.NumberFormat("en-US").format(n);

export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!inView || !node) return;

    if (reduce) {
      node.textContent = format(value);
      return;
    }

    const controls = animate(0, value, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (latest) => {
        node.textContent = format(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [inView, value, reduce]);

  return <span ref={ref}>0</span>;
}
