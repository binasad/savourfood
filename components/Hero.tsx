"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

gsap.registerPlugin(ScrollTrigger);

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.set(".hero-char", { scale: 0, opacity: 0, z: -800, rotateX: 40 });
      tl.set(".hero-subtitle", { opacity: 0, z: -300, scale: 0.5 });
      tl.set(".hero-tagline", { opacity: 0, z: -300, scale: 0.5 });
      tl.set(".hero-divider", { scaleX: 0 });

      tl.to(".hero-char", {
        scale: 1,
        opacity: 1,
        z: 0,
        rotateX: 0,
        duration: 1.4,
        stagger: 0.04,
        ease: "power4.out",
      })
        .to(".hero-divider", {
          scaleX: 1,
          duration: 1,
          ease: "power2.inOut",
        }, "-=0.8")
        .to(".hero-subtitle", {
          opacity: 1, z: 0, scale: 1, duration: 0.8, ease: "power2.out",
        }, "-=0.6")
        .to(".hero-tagline", {
          opacity: 1, z: 0, scale: 1, duration: 0.8, ease: "power2.out",
        }, "-=0.4")
        .to(scrollIndRef.current, {
          opacity: 1, duration: 0.6, ease: "power2.out",
        }, "-=0.2");

      // Title chars fly toward camera on scroll (Z-axis)
      gsap.to(".hero-char", {
        z: (i: number) => 600 + i * 80,
        x: (i: number) => (i % 2 === 0 ? -1 : 1) * (30 + i * 12),
        y: (i: number) => (i % 2 === 0 ? -1 : 1) * (20 + i * 8),
        opacity: 0,
        scale: 2.5,
        rotateX: (i: number) => (i % 2 === 0 ? -20 : 20),
        rotateY: (i: number) => (i % 2 === 0 ? -25 : 25),
        stagger: 0.02,
        scrollTrigger: {
          trigger: section,
          start: "12% top",
          end: "35% top",
          scrub: 1.5,
        },
      });

      gsap.to(".hero-subtitle", {
        z: 400,
        scale: 2,
        opacity: 0,
        scrollTrigger: {
          trigger: section,
          start: "10% top",
          end: "30% top",
          scrub: 1,
        },
      });

      gsap.to(".hero-tagline", {
        z: 300,
        scale: 1.8,
        opacity: 0,
        scrollTrigger: {
          trigger: section,
          start: "12% top",
          end: "32% top",
          scrub: 1,
        },
      });

      gsap.to(".hero-divider", {
        scaleX: 0,
        opacity: 0,
        scrollTrigger: {
          trigger: section,
          start: "10% top",
          end: "25% top",
          scrub: 1,
        },
      });

      // Reveal strip text
      gsap.fromTo(".reveal-strip-text", {
        x: "100%",
        opacity: 0,
      }, {
        x: "0%",
        opacity: 1,
        scrollTrigger: {
          trigger: section,
          start: "40% top",
          end: "55% top",
          scrub: 1.5,
        },
      });

      gsap.to(".reveal-strip-text", {
        x: "-100%",
        opacity: 0,
        scrollTrigger: {
          trigger: section,
          start: "65% top",
          end: "80% top",
          scrub: 1,
        },
      });

      // Scroll indicator
      gsap.to(scrollIndRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: section,
          start: "3% top",
          end: "10% top",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const renderChars = (text: string) =>
    text.split("").map((char, i) => (
      <span
        key={i}
        className="hero-char inline-block"
        style={{ transformStyle: "preserve-3d" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <section id="hero" ref={sectionRef} className="relative h-[350vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden grain-overlay">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-dark via-dark to-purple-deeper" />

        {/* Radial glow */}
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background: "radial-gradient(ellipse at 50% 40%, rgba(145,40,140,0.15) 0%, transparent 60%)",
          }}
        />

        {/* 3D Particles */}
        <div className="z-[7]">
          <HeroScene />
        </div>

        {/* Main text content */}
        <div
          ref={contentRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 z-[15]"
          style={{ perspective: "1000px", perspectiveOrigin: "50% 50%" }}
        >
          <p className="hero-subtitle text-[clamp(0.6rem,1.1vw,0.9rem)] tracking-[0.2em] md:tracking-[0.5em] uppercase text-gold mb-4 md:mb-6 font-light">
            Pakistan&apos;s Most Loved Restaurant
          </p>

          <h1 className="font-heading text-[clamp(3rem,9vw,8rem)] font-bold leading-[1.0] hero-title" style={{ transformStyle: "preserve-3d" }}>
            <span className="block pb-2" style={{ transformStyle: "preserve-3d" }}>
              {renderChars("SAVOUR")}
            </span>
            <span className="block pb-2" style={{ transformStyle: "preserve-3d" }}>
              {renderChars("FOODS")}
            </span>
          </h1>

          <div className="hero-divider w-[80px] h-[1px] bg-gold my-6 origin-center" />

          <p className="hero-tagline text-[clamp(0.75rem,1.3vw,1rem)] font-light tracking-[0.08em] md:tracking-[0.15em] text-cream/60 max-w-md px-4 md:px-0">
            The Taste of Tradition — Since Day One
          </p>
        </div>

        {/* Horizontal reveal strip text */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 z-[13] pointer-events-none overflow-hidden">
          <p className="reveal-strip-text text-[clamp(0.8rem,2.5vw,2rem)] tracking-[0.3em] md:tracking-[0.6em] uppercase text-gold/80 text-center font-heading font-light">
            Legendary Chicken Pulao
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          ref={scrollIndRef}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 z-[20]"
        >
          <span className="text-[0.65rem] tracking-[0.4em] uppercase text-cream/40 font-light">
            Scroll
          </span>
          <div className="scroll-line w-[1px] h-[50px] bg-gradient-to-b from-gold/80 to-transparent" />
        </div>
      </div>
    </section>
  );
}
