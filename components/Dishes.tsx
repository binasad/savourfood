"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const dishes = [
  {
    id: 1,
    title: "Chicken Pulao",
    subtitle: "The Legend",
    price: "Rs. 395",
    desc: "Aromatic basmati rice layered with tender chicken, secret spices, and decades of tradition.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80",
    gradient: "from-[#2a1530] via-[#91288c] to-[#1a0a1a]",
    accent: "#91288c",
  },
  {
    id: 2,
    title: "Savour Krispo",
    subtitle: "Crispy Perfection",
    price: "Rs. 595",
    desc: "Golden, crispy broast chicken — crunchy on the outside, juicy within.",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80",
    gradient: "from-[#1a2010] via-[#c9a84c] to-[#1a0a1a]",
    accent: "#c9a84c",
  },
  {
    id: 3,
    title: "Chicken Roast",
    subtitle: "Whole & Grand",
    price: "Rs. 1,450",
    desc: "A whole roasted chicken, marinated for hours and slow-cooked to perfection.",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&q=80",
    gradient: "from-[#2a0a10] via-[#ec1164] to-[#1a0a1a]",
    accent: "#ec1164",
  },
  {
    id: 4,
    title: "Chicken Karahi",
    subtitle: "Sizzling & Bold",
    price: "Rs. 1,750",
    desc: "Tender chicken pieces in a traditional karahi with tomatoes, green chilies, and fresh spices.",
    image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=800&q=80",
    gradient: "from-[#1a1a0a] via-[#c0704a] to-[#1a0a1a]",
    accent: "#c0704a",
  },
  {
    id: 5,
    title: "Kheer & Zarda",
    subtitle: "Sweet Endings",
    price: "Rs. 195",
    desc: "Creamy rice kheer and vibrant sweet zarda — the perfect finale to a Savour meal.",
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&q=80",
    gradient: "from-[#0a1a2a] via-[#f3dfac] to-[#1a0a1a]",
    accent: "#f3dfac",
  },
];

export default function Dishes() {
  const container = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      const totalCards = cards.length;
      if (totalCards === 0) return;

      // Header animation
      gsap.set(".dishes-header", { y: 60, opacity: 0 });
      gsap.to(".dishes-header", {
        y: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: { trigger: container.current, start: "top 60%", once: true },
      });

      // Set initial states: first card visible, rest stacked below
      gsap.set(cards[0], { y: "0%", scale: 1, rotation: 0 });
      for (let i = 1; i < totalCards; i++) {
        gsap.set(cards[i], { y: "100%", scale: 1, rotation: 0 });
      }

      // Sticky card scroll timeline
      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".sticky-cards",
          start: "top top",
          end: `+=${window.innerHeight * (totalCards - 1)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentCard = cards[i];
        const nextCard = cards[i + 1];
        if (!currentCard || !nextCard) continue;

        scrollTimeline.to(
          currentCard,
          { scale: 0.7, rotation: 5, duration: 1, ease: "none" },
          i
        );
        scrollTimeline.to(
          nextCard,
          { y: "0%", duration: 1, ease: "none" },
          i
        );
      }

      const resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });
      if (container.current) {
        resizeObserver.observe(container.current);
      }

      return () => {
        resizeObserver.disconnect();
        scrollTimeline.kill();
      };
    },
    { scope: container }
  );

  return (
    <section id="dishes" ref={container} className="relative">
      {/* Header */}
      <div className="dishes-header text-center px-6 md:px-8 lg:px-16 pt-20 pb-10">
        <span className="text-xs tracking-[0.4em] uppercase text-gold mb-4 block">
          Signature Collection
        </span>
        <h2 className="font-heading text-[clamp(2rem,4vw,3.5rem)] font-bold mb-4">
          Our Legendary Dishes
        </h2>
        <p className="text-base text-cream/50">Scroll to explore the flavors</p>
      </div>

      {/* Sticky cards container */}
      <div className="sticky-cards relative flex h-screen w-full items-center justify-center overflow-hidden p-3 lg:p-8">
        <div className="relative h-[85%] w-full max-w-sm overflow-hidden rounded-2xl sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl">
          {dishes.map((dish, i) => (
            <div
              key={dish.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={cn(
                "absolute inset-0 h-full w-full rounded-2xl overflow-hidden",
              )}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${dish.gradient}`} />

              {/* Radial glow */}
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse at 50% 40%, ${dish.accent}33 0%, transparent 60%)`,
                }}
              />

              {/* Food image */}
              <img
                src={dish.image}
                alt={dish.title}
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 md:p-12 z-10">
                <div className="w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden mb-6 ring-2 ring-gold/30 shadow-2xl">
                  <img
                    src={dish.image}
                    alt={dish.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs tracking-[0.3em] uppercase text-gold/80 mb-3">
                  {dish.subtitle}
                </p>
                <h3 className="font-heading text-3xl md:text-5xl font-bold mb-4 text-cream drop-shadow-lg">
                  {dish.title}
                </h3>
                <p className="text-cream/50 text-sm md:text-base leading-relaxed max-w-[380px] mb-6">
                  {dish.desc}
                </p>
                <span className="text-gold font-heading text-2xl md:text-3xl font-bold">
                  {dish.price}
                </span>
              </div>

              {/* Bottom gradient fade */}
              <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-dark/70 to-transparent z-[5]" />

              {/* Card number */}
              <div className="absolute top-6 right-6 text-cream/15 font-heading text-7xl md:text-9xl font-bold z-[3]">
                {String(i + 1).padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
