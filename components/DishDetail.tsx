"use client";
import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface DishDetailProps {
  name: string;
  image: string;
  video?: string;
  items: string[];
  accent: string;
  onClose: () => void;
}

export default function DishDetail({ name, image, video, items, accent, onClose }: DishDetailProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  const handleClose = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) { onClose(); return; }
    ctxRef.current?.revert();
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      onComplete: onClose,
    });
  }, [onClose]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const scroller = scrollRef.current;
    const imgWrap = imgWrapRef.current;
    if (!overlay || !scroller || !imgWrap) return;

    // Pause Lenis
    const lenis = (window as unknown as Record<string, unknown>).__lenis as { stop?: () => void; start?: () => void } | undefined;
    lenis?.stop?.();

    // Entrance
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
    gsap.fromTo(imgWrap,
      { y: -80, scale: 0.6, opacity: 0, rotate: -15 },
      { y: 0, scale: 1, opacity: 1, rotate: 0, duration: 0.8, ease: "back.out(1.4)", delay: 0.2 }
    );
    gsap.fromTo(".dd-title",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: 0.4, ease: "power3.out" }
    );

    // Single master timeline scrubbed by total scroll — fully reversible
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scroller,
          scroller,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });

      // 0-30%: Image slides right, rotates, shrinks beside text
      tl.to(imgWrap, {
        x: "22vw", y: "0vh", rotate: 8, scale: 0.65,
        duration: 3, ease: "none",
      }, 0);

      // 30-60%: Image drifts down, rotates more
      tl.to(imgWrap, {
        x: "18vw", y: "15vh", rotate: 18, scale: 0.55,
        duration: 3, ease: "none",
      }, 3);

      // 60-100%: Image flies toward camera on Z-axis
      tl.to(imgWrap, {
        z: 600, scale: 2.5, opacity: 0, rotate: 35,
        duration: 4, ease: "none",
      }, 6);

      // Text reveals (separate ScrollTriggers — these are fine for content)
      gsap.fromTo(".dd-story-text", {
        y: 60, opacity: 0,
      }, {
        y: 0, opacity: 1, stagger: 0.15,
        scrollTrigger: {
          trigger: ".dd-phase1",
          scroller,
          start: "top bottom",
          end: "60% center",
          scrub: 1,
        },
      });

      gsap.fromTo(".dd-price-tag", {
        scale: 0.5, opacity: 0,
      }, {
        scale: 1, opacity: 1,
        scrollTrigger: {
          trigger: ".dd-phase2",
          scroller,
          start: "top bottom",
          end: "center center",
          scrub: 1,
        },
      });

      gsap.fromTo(".dd-close-cta", {
        y: 40, opacity: 0,
      }, {
        y: 0, opacity: 1,
        scrollTrigger: {
          trigger: ".dd-phase3",
          scroller,
          start: "top bottom",
          end: "center center",
          scrub: 1,
        },
      });
    }, overlay);

    ctxRef.current = ctx;

    return () => {
      ctx.revert();
      lenis?.start?.();
    };
  }, []);

  // Smooth scrolling — Lenis blocks native scroll, so we manually handle wheel + touch
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    let scrollTarget = 0;
    let animFrame: number;
    let touchStartY = 0;
    let touchLastY = 0;

    const clampScroll = (val: number) =>
      Math.max(0, Math.min(scroller.scrollHeight - scroller.clientHeight, val));

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      scrollTarget = clampScroll(scroller.scrollTop + e.deltaY * 1.5);
      cancelAnimationFrame(animFrame);
      animFrame = requestAnimationFrame(() => {
        gsap.to(scroller, {
          scrollTop: scrollTarget,
          duration: 0.6,
          ease: "power2.out",
          overwrite: true,
        });
      });
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchLastY = touchStartY;
      scrollTarget = scroller.scrollTop;
      gsap.killTweensOf(scroller);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = touchLastY - currentY;
      touchLastY = currentY;
      scrollTarget = clampScroll(scrollTarget + deltaY * 1.8);
      gsap.to(scroller, {
        scrollTop: scrollTarget,
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      });
    };

    const onTouchEnd = () => {
      // momentum is handled by the gsap tween already in progress
    };

    scroller.addEventListener("wheel", onWheel, { passive: false });
    scroller.addEventListener("touchstart", onTouchStart, { passive: true });
    scroller.addEventListener("touchmove", onTouchMove, { passive: false });
    scroller.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      scroller.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("touchstart", onTouchStart);
      scroller.removeEventListener("touchmove", onTouchMove);
      scroller.removeEventListener("touchend", onTouchEnd);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  const content = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] bg-dark/95 backdrop-blur-md"
      style={{ perspective: "1200px" }}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className="fixed top-6 right-6 z-[220] w-10 h-10 flex items-center justify-center rounded-full border border-cream/20 text-cream/60 hover:text-cream hover:border-cream/50 transition-colors"
        aria-label="Close"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 2l12 12M14 2L2 14" />
        </svg>
      </button>

      {/* Background video */}
      {video && (
        <div className="absolute inset-0 z-[201] overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-20"
          >
            <source src={video} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-dark/60" />
        </div>
      )}

      {/* FIXED floating image — stays on screen, animated by GSAP */}
      <div
        ref={imgWrapRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[215] pointer-events-none"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-40 -z-10"
          style={{
            background: `radial-gradient(circle, ${accent}, transparent 70%)`,
            width: "120%",
            height: "120%",
            top: "-10%",
            left: "-10%",
          }}
        />
        <img
          src={image}
          alt={name}
          className="w-[250px] h-[250px] md:w-[350px] md:h-[350px] object-contain"
          style={{ filter: `drop-shadow(0 20px 60px ${accent}66) drop-shadow(0 0 30px ${accent}33)` }}
        />
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto overflow-x-hidden relative z-[210]"
      >
        {/* Phase 0: Title and scroll prompt */}
        <div className="h-screen flex flex-col items-end justify-center relative px-6">
          <div className="w-full text-center mt-[300px] md:mt-[400px]">
            <h2 className="dd-title font-heading text-[clamp(2rem,5vw,4rem)] font-bold">
              {name}
            </h2>
            <div className="dd-title mt-4 flex flex-col items-center gap-2">
              <span className="text-xs tracking-[0.4em] uppercase text-gold/60">Scroll to explore</span>
              <div className="w-[1px] h-[40px] bg-gradient-to-b from-gold/60 to-transparent animate-pulse" />
            </div>
          </div>
        </div>

        {/* Phase 1: Menu items on the left, image sits on right */}
        <div className="dd-phase1 min-h-[100vh] flex items-center px-6 md:px-16">
          <div className="max-w-[420px] lg:max-w-[500px]">
            <p className="dd-story-text text-xs tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>
              The Menu
            </p>
            <h3 className="dd-story-text font-heading text-2xl md:text-4xl font-bold mb-6">
              Crafted with Passion
            </h3>
            {items.map((item, i) => (
              <div key={i} className="dd-story-text flex items-center gap-4 py-3 border-b border-cream/10">
                <span className="text-gold font-heading text-lg">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-cream/70 text-sm md:text-base">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Phase 2: Order CTA */}
        <div className="dd-phase2 min-h-[100vh] flex items-center justify-center px-6">
          <div className="dd-price-tag text-center">
            <span className="text-xs tracking-[0.4em] uppercase text-cream/40 block mb-4">Order Now</span>
            <div
              className="inline-block px-10 py-5 rounded-2xl border border-cream/15"
              style={{ background: `linear-gradient(135deg, ${accent}22, transparent)` }}
            >
              <span className="font-heading text-3xl md:text-5xl font-bold text-gold">{name}</span>
              <p className="text-cream/50 mt-2 text-sm">Available for delivery &amp; dine-in</p>
            </div>
          </div>
        </div>

        {/* Phase 3: Close */}
        <div className="dd-phase3 min-h-[80vh] flex items-center justify-center px-6">
          <div className="dd-close-cta text-center">
            <p className="text-cream/40 text-sm mb-6">That&apos;s the story of our {name}</p>
            <button
              onClick={handleClose}
              className="px-8 py-3 rounded-full border border-gold/40 text-gold font-heading text-lg hover:bg-gold/10 transition-colors pointer-events-auto"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}
