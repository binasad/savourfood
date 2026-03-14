"use client";
import { useState } from "react";

const links = [
  { href: "#hero", label: "Home" },
  { href: "#story", label: "Legacy" },
  { href: "#dishes", label: "Dishes" },
  { href: "#menu", label: "Menu" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    const lenis = (window as unknown as Record<string, any>).__lenis;
    if (el && lenis) lenis.scrollTo(el, { duration: 2 });
    setOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full px-6 md:px-8 lg:px-16 py-5 md:py-6 flex justify-between items-center z-[100] mix-blend-difference">
        <div className="font-heading text-lg md:text-xl font-bold tracking-wide text-gold">SAVOUR</div>

        <ul className="hidden md:flex gap-10">
          {links.map((l) => (
            <li key={l.href}>
              <button
                onClick={() => scrollTo(l.href)}
                className="text-[0.85rem] font-normal tracking-[0.15em] uppercase relative group cursor-pointer bg-transparent border-none text-cream"
              >
                {l.label}
                <span className="absolute bottom-[-4px] left-0 w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-300" />
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-[5px] cursor-pointer bg-transparent border-none p-1 z-[110]"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-[1.5px] bg-cream transition-all duration-300 ${open ? "rotate-45 translate-y-[6.5px]" : ""}`} />
          <span className={`block w-6 h-[1.5px] bg-cream transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-[1.5px] bg-cream transition-all duration-300 ${open ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-[105] bg-dark/95 backdrop-blur-md flex flex-col items-center justify-center gap-8 transition-all duration-500 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {links.map((l) => (
          <button
            key={l.href}
            onClick={() => scrollTo(l.href)}
            className="text-2xl font-heading tracking-[0.15em] uppercase cursor-pointer bg-transparent border-none text-cream hover:text-gold transition-colors duration-300"
          >
            {l.label}
          </button>
        ))}
      </div>
    </>
  );
}
