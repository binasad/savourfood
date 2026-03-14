"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const barRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.to(barRef.current, {
      width: "100%",
      duration: 2,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.to(wrapRef.current, {
          yPercent: -100,
          duration: 1,
          ease: "power4.inOut",
          onComplete: () => {
            if (wrapRef.current) wrapRef.current.style.display = "none";
            onComplete();
          },
        });
      },
    });
  }, [onComplete]);

  return (
    <div ref={wrapRef} className="fixed inset-0 bg-dark z-[10000] flex flex-col items-center justify-center grain-overlay">
      <div className="font-heading text-gold text-[clamp(1.5rem,4vw,3rem)] tracking-[0.2em] font-bold">
        SAVOUR FOODS
      </div>
      <p className="text-cream/40 text-sm tracking-[0.3em] uppercase mt-3">The Taste of Tradition</p>
      <div className="w-[200px] h-[2px] bg-purple/30 mt-8 relative overflow-hidden rounded">
        <span ref={barRef} className="absolute h-full w-0 bg-gold rounded" />
      </div>
    </div>
  );
}
