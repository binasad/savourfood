"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { count: 1000000, label: "Meals Served", suffix: "+" },
  { count: 30, label: "Cities", suffix: "+" },
  { count: 1, label: "Legendary Recipe", suffix: "" },
];

export default function Story() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.set(".story-img-left", { x: -200, rotate: -12, opacity: 0, scale: 0.85 });
      gsap.set(".story-img-right", { x: 200, rotate: 15, opacity: 0, scale: 0.85 });
      gsap.set(".story-label", { y: 30, opacity: 0 });
      gsap.set(".story-heading", { y: 50, opacity: 0 });

      const imgTl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 85%", once: true },
      });

      imgTl.to(".story-img-left", {
        x: 0, rotate: 0, opacity: 1, scale: 1,
        duration: 1.4, ease: "power3.out",
      })
      .to(".story-img-right", {
        x: 0, rotate: 0, opacity: 1, scale: 1,
        duration: 1.2, ease: "power3.out",
      }, "-=0.8");

      gsap.to(".story-label", {
        y: 0, opacity: 1, duration: 0.8,
        scrollTrigger: { trigger: section, start: "top 80%", once: true },
      });
      gsap.to(".story-heading", {
        y: 0, opacity: 1, duration: 1,
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
      });

      // Word-by-word
      section.querySelectorAll<HTMLElement>("[data-animate-words]").forEach((p) => {
        const text = p.textContent || "";
        p.innerHTML = text.split(" ").map((w) => `<span class="inline-block mr-[0.3em]">${w}</span>`).join("");
        const spans = p.querySelectorAll("span");
        gsap.set(spans, { opacity: 0, y: 10 });
        gsap.to(spans, {
          opacity: 1, y: 0, stagger: 0.02, duration: 0.5, ease: "power2.out",
          scrollTrigger: { trigger: p, start: "top 90%", once: true },
        });
      });

      // Counter
      section.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const target = parseInt(el.dataset.count || "0");
        const suffix = el.dataset.suffix || "";
        gsap.to(el, {
          innerText: target,
          duration: 2.5,
          ease: "power2.out",
          snap: { innerText: 1 },
          scrollTrigger: { trigger: el, start: "top 95%", once: true },
          onUpdate() {
            const val = Math.round(parseFloat(el.innerText));
            if (val >= 1000000) {
              el.innerText = (val / 1000000).toFixed(val >= 1000000 ? 0 : 1) + "M" + suffix;
            } else if (val >= 1000) {
              el.innerText = val.toLocaleString() + suffix;
            } else {
              el.innerText = val + suffix;
            }
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="story" ref={sectionRef} className="relative py-20 md:py-40 px-6 md:px-8 lg:px-16 min-h-screen flex items-center overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 max-w-[1400px] mx-auto w-full items-center">
        {/* Image Column */}
        <div className="relative">
          <div className="story-img-left relative overflow-hidden rounded-lg will-change-transform">
            <img
              src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80"
              alt="Savour Foods Chicken Pulao"
              className="w-full h-[280px] md:h-[400px] lg:h-[600px] object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent rounded-lg" />
            <p className="absolute bottom-4 left-4 text-gold/80 text-sm tracking-wider">Savour Foods Kitchen</p>
          </div>
          <div className="story-img-right absolute w-[100px] md:w-[150px] lg:w-[200px] right-[-15px] md:right-[-30px] lg:right-[-60px] bottom-[-15px] md:bottom-[-30px] lg:bottom-[-60px] rounded-lg overflow-hidden shadow-2xl will-change-transform">
            <img
              src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80"
              alt="Crispy Chicken"
              className="w-full aspect-square object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Text Column */}
        <div className="lg:pl-8">
          <span className="story-label text-xs tracking-[0.4em] uppercase text-gold mb-8 inline-block">Our Legacy</span>
          <h2 className="story-heading font-heading text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.15] mb-8">
            Where Every Grain Tells a Story
          </h2>
          <p data-animate-words className="text-base leading-[1.8] text-cream/60 mb-6">
            From a humble eatery on Gordon College Road, Rawalpindi, Savour Foods has grown into Pakistan&apos;s most iconic culinary destination. Our legendary Chicken Pulao, crafted with a secret blend of aromatic spices and the finest basmati rice, has become a symbol of taste and tradition that unites millions across the nation.
          </p>
          <p data-animate-words className="text-base leading-[1.8] text-cream/60 mb-6">
            Every plate we serve carries forward a legacy of passion, precision, and the unwavering commitment to quality that has made Savour Foods a household name. This is more than food. This is tradition on a plate.
          </p>
          <div className="flex gap-6 md:gap-8 lg:gap-12 mt-8 md:mt-12 pt-8 md:pt-12 border-t border-gold/15">
            {stats.map((s) => (
              <div key={s.label}>
                <div data-count={s.count} data-suffix={s.suffix} className="font-heading text-[1.8rem] md:text-[2.5rem] font-bold text-gold">0</div>
                <div className="text-[0.65rem] md:text-xs tracking-wider text-cream/50 mt-1 md:mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
