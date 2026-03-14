"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function PlateHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      /* ── Initial entrance ── */
      gsap.set(".plate-full", { scale: 0.6, opacity: 0 });
      gsap.set(".plate-empty", { scale: 0.6, opacity: 0 });
      gsap.set(".plate-chicken", { opacity: 0, y: 20 });
      gsap.set(".plate-rice", { opacity: 0, y: 20 });
      gsap.set(".plate-smoke", { opacity: 0 });
      gsap.set(".plate-tagline", { opacity: 0, y: 30 });
      gsap.set(".plate-hint", { opacity: 0 });

      const entranceTl = gsap.timeline({ delay: 0.3 });

      entranceTl
        .to(".plate-full", {
          scale: 1,
          opacity: 1,
          duration: 1.6,
          ease: "power3.out",
        })
        .to(
          ".plate-tagline",
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.6"
        )
        .to(
          ".plate-hint",
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          "-=0.2"
        );

      /* ── Scroll-driven separation timeline ── */
      const sepTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "5% top",
          end: "55% top",
          scrub: 1.5,
          // pin is already sticky
        },
      });

      // 1. Fade out full plate, reveal empty plate underneath
      sepTl
        .to(".plate-full", {
          scale: 0.85,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        })
        .to(
          ".plate-empty",
          { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" },
          "<"
        )

        // 2. Chicken rises and floats to right
        .to(".plate-chicken", {
          opacity: 1,
          y: 0,
          duration: 0.1,
        })
        .to(".plate-chicken", {
          x: "45vw",
          y: "-10vh",
          rotate: 15,
          scale: 1.15,
          duration: 0.7,
          ease: "power2.inOut",
        })

        // 3. Rice floats to left
        .to(
          ".plate-rice",
          { opacity: 1, y: 0, duration: 0.1 },
          "-=0.7"
        )
        .to(
          ".plate-rice",
          {
            x: "-42vw",
            y: "-5vh",
            rotate: -8,
            scale: 1.2,
            duration: 0.7,
            ease: "power2.inOut",
          },
          "-=0.6"
        )

        // 4. Smoke appears behind chicken
        .to(
          ".plate-smoke",
          { opacity: 0.7, duration: 0.4, ease: "power1.in" },
          "-=0.5"
        )

        // 5. Empty plate shrinks and fades
        .to(".plate-empty", {
          scale: 0.7,
          opacity: 0.3,
          y: 40,
          duration: 0.4,
          ease: "power2.in",
        })

        // 6. Story text reveals
        .to(
          ".plate-story-label",
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
          "-=0.2"
        )
        .to(".plate-story-heading", {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        })
        .to(".plate-story-desc", {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });

      // Hide scroll hint on scroll
      gsap.to(".plate-hint", {
        opacity: 0,
        scrollTrigger: {
          trigger: section,
          start: "1% top",
          end: "5% top",
          scrub: true,
        },
      });

      // Hide tagline on scroll
      gsap.to(".plate-tagline", {
        opacity: 0,
        y: -30,
        scrollTrigger: {
          trigger: section,
          start: "2% top",
          end: "12% top",
          scrub: 1,
        },
      });

      // Set initial states for story text
      gsap.set(".plate-story-label", { opacity: 0, y: 20 });
      gsap.set(".plate-story-heading", { opacity: 0, y: 30 });
      gsap.set(".plate-story-desc", { opacity: 0, y: 20 });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="plate-hero"
      ref={sectionRef}
      className="relative h-[300vh] w-full"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Dark bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-dark via-dark to-purple-deeper" />

        {/* Radial glow behind plate */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(145,40,140,0.2) 0%, transparent 50%)",
          }}
        />

        {/* ── Plate layers (centered) ── */}
        <div className="relative z-[10] flex items-center justify-center w-full h-full">
          {/* Empty plate (hidden initially, revealed during separation) */}
          <div className="plate-empty absolute w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]">
            <Image
              src="/images/plate-empty.png"
              alt="Empty plate"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>

          {/* Full plate (visible initially) */}
          <div className="plate-full absolute w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]">
            <Image
              src="/images/plate-full.png"
              alt="Chicken Pulao"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>

          {/* Chicken piece (initially on plate, animates right) */}
          <div className="plate-chicken absolute w-[140px] h-[180px] md:w-[200px] md:h-[260px] lg:w-[240px] lg:h-[300px] will-change-transform">
            <Image
              src="/images/chicken.png"
              alt="Roasted Chicken"
              fill
              className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            />
          </div>

          {/* Rice (initially on plate, animates left) */}
          <div className="plate-rice absolute w-[160px] h-[120px] md:w-[240px] md:h-[180px] lg:w-[300px] lg:h-[220px] will-change-transform">
            <Image
              src="/images/rice.png"
              alt="Basmati Rice"
              fill
              className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            />
          </div>

          {/* Smoke video (behind chicken, mix-blend-screen) */}
          <div className="plate-smoke absolute w-[300px] h-[400px] md:w-[400px] md:h-[500px] lg:w-[500px] lg:h-[600px] translate-x-[20vw] -translate-y-[5vh] pointer-events-none z-[9]">
            <video
              src="/videos/smoke.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover mix-blend-screen opacity-80"
            />
          </div>

          {/* Story text (appears after separation) */}
          <div className="absolute inset-0 flex items-center z-[15] pointer-events-none">
            <div className="max-w-[500px] px-8 md:px-16 lg:px-24">
              <span className="plate-story-label text-xs tracking-[0.4em] uppercase text-gold mb-4 block">
                Our Legacy
              </span>
              <h2 className="plate-story-heading font-heading text-[clamp(1.8rem,3.5vw,3rem)] font-bold leading-[1.15] mb-4 text-cream">
                Where Every Grain Tells a Story
              </h2>
              <p className="plate-story-desc text-sm md:text-base leading-[1.8] text-cream/60">
                From a humble eatery on Gordon College Road to Pakistan&apos;s most
                iconic culinary destination. Our legendary Chicken Pulao has
                become a symbol of taste and tradition.
              </p>
            </div>
          </div>
        </div>

        {/* Tagline (below plate initially) */}
        <div className="plate-tagline absolute bottom-[15%] left-0 right-0 text-center z-[20]">
          <p className="text-[clamp(0.7rem,1.2vw,0.9rem)] tracking-[0.3em] uppercase text-gold/70 font-light">
            The Taste of Tradition
          </p>
        </div>

        {/* Scroll hint */}
        <div className="plate-hint absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[20]">
          <span className="text-[0.6rem] tracking-[0.4em] uppercase text-cream/40 font-light">
            Scroll to explore
          </span>
          <div className="scroll-line w-[1px] h-[40px] bg-gradient-to-b from-gold/80 to-transparent" />
        </div>
      </div>
    </section>
  );
}
