"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import DishDetail from "./DishDetail";

gsap.registerPlugin(ScrollTrigger);

const MenuCard3D = dynamic(() => import("./MenuCard3D"), { ssr: false });

const menuCategories = [
  {
    name: "Chicken Pulao",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80",
    detailImage: "/images/pulao.png",
    video: "/videos/Steaming_hyderabadi_biryani_plate_delpmaspu_.mp4",
    accent: "#91288c",
    items: [
      "Pulao Kabab — Rs. 395",
      "Pulao Special — Rs. 745",
      "Family Pulao — Rs. 1,890",
      "Half Pulao — Rs. 275",
    ],
    frontColor: "#2a1530",
  },
  {
    name: "Savour Krispo",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80",
    detailImage: "/images/krispo.png",
    accent: "#c9a84c",
    items: [
      "2 Pcs Broast — Rs. 595",
      "4 Pcs Broast — Rs. 1,095",
      "Wings (6 Pcs) — Rs. 595",
      "Nuggets (8 Pcs) — Rs. 495",
    ],
    frontColor: "#1a2520",
  },
  {
    name: "Chicken",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&q=80",
    detailImage: "/images/roast.png",
    accent: "#ec1164",
    items: [
      "Chicken Roast — Rs. 1,450",
      "Chicken Karahi — Rs. 1,750",
      "Chicken Tikka — Rs. 595",
      "Chicken Sajji — Rs. 1,650",
    ],
    frontColor: "#2a1020",
  },
  {
    name: "Meals",
    image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=400&q=80",
    detailImage: "/images/karahi.png",
    accent: "#c0704a",
    items: [
      "Mutton Pulao — Rs. 595",
      "Biryani — Rs. 395",
      "Nihari — Rs. 495",
      "Haleem — Rs. 395",
    ],
    frontColor: "#1a1a10",
  },
  {
    name: "Sweets",
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80",
    detailImage: "/images/kheer.png",
    accent: "#f3dfac",
    items: [
      "Kheer — Rs. 195",
      "Zarda — Rs. 195",
      "Gulab Jamun — Rs. 150",
      "Firni — Rs. 195",
    ],
    frontColor: "#0a1a2a",
  },
  {
    name: "Deals",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
    detailImage: "/images/deals.png",
    accent: "#91288c",
    items: [
      "Family Deal — Rs. 2,195",
      "Krispo Deal — Rs. 1,195",
      "Pulao Deal — Rs. 895",
      "Party Deal — Rs. 3,495",
    ],
    frontColor: "#1a0a2a",
  },
];

type SelectedDish = {
  name: string;
  image: string;
  video?: string;
  items: string[];
  accent: string;
} | null;

export default function Menu() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedDish, setSelectedDish] = useState<SelectedDish>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".menu-header-anim", { y: 60, opacity: 0 });
      gsap.to(".menu-header-anim", {
        y: 0, opacity: 1, duration: 1,
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%", once: true },
      });
      gsap.set(".menu-card-anim", { y: 80, opacity: 0 });
      gsap.to(".menu-card-anim", {
        y: 0, opacity: 1, stagger: 0.15, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: ".menu-grid-anim", start: "top 70%", once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleCardClick = (cat: typeof menuCategories[number]) => {
    setSelectedDish({
      name: cat.name,
      image: cat.detailImage,
      video: cat.video,
      items: cat.items,
      accent: cat.accent,
    });
  };

  return (
    <>
      <section id="menu" ref={sectionRef} className="relative py-20 md:py-40 px-6 md:px-8 lg:px-16 min-h-screen bg-dark-light">
        <div className="menu-header-anim text-center max-w-[600px] mx-auto mb-12 md:mb-24">
          <span className="text-xs tracking-[0.4em] uppercase text-gold mb-4 block">Our Menu</span>
          <h2 className="font-heading text-[clamp(2rem,4vw,3.5rem)] font-bold mb-4">Flavors to Remember</h2>
          <p className="text-base text-cream/50 leading-relaxed">Hover or tap to discover each category</p>
        </div>

        <div className="menu-grid-anim grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
          {menuCategories.map((cat) => (
            <div
              key={cat.name}
              className="menu-card-anim cursor-pointer"
              onClick={() => handleCardClick(cat)}
            >
              <MenuCard3D
                name={cat.name}
                image={cat.image}
                items={cat.items}
                frontColor={cat.frontColor}
              />
            </div>
          ))}
        </div>
      </section>

      {selectedDish && (
        <DishDetail
          name={selectedDish.name}
          image={selectedDish.image}
          video={selectedDish.video}
          items={selectedDish.items}
          accent={selectedDish.accent}
          onClose={() => setSelectedDish(null)}
        />
      )}
    </>
  );
}
