"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const values = [
  { label: "Fresh Ingredients" },
  { label: "Secret Spices" },
  { label: "Served with Love" },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Big words reveal on scrub
      const words = section.querySelectorAll<HTMLElement>(".exp-word");
      gsap.set(words, { opacity: 0.1, y: 40 });

      gsap.to(words, {
        opacity: 1,
        y: 0,
        stagger: 0.3,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "60% top",
          scrub: 1.5,
          pin: true,
        },
      });

      // Values fade in
      gsap.set(".exp-value", { y: 30, opacity: 0 });
      gsap.to(".exp-value", {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        scrollTrigger: {
          trigger: section,
          start: "40% top",
          end: "70% top",
          scrub: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="relative min-h-[200vh] bg-purple-deeper grain-overlay">
      <div className="h-screen flex flex-col items-center justify-center px-6 md:px-8">
        <div className="text-center mb-16">
          <span className="exp-word font-heading text-[clamp(2.5rem,8vw,7rem)] font-bold text-gold block leading-[1.1]">
            Taste.
          </span>
          <span className="exp-word font-heading text-[clamp(2.5rem,8vw,7rem)] font-bold text-pink block leading-[1.1]">
            Tradition.
          </span>
          <span className="exp-word font-heading text-[clamp(2.5rem,8vw,7rem)] font-bold text-cream block leading-[1.1]">
            Together.
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {values.map((v) => (
            <div key={v.label} className="exp-value flex flex-col items-center gap-3">
              <div className="w-[1px] h-8 bg-gold/40" />
              <span className="text-sm tracking-[0.2em] uppercase text-cream/60">{v.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
