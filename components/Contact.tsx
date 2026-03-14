"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const details = [
  { label: "Location", value: "Gordon College Road, Rawalpindi" },
  { label: "Hours", value: "Daily: 3:00 PM - 12:30 AM" },
  { label: "UAN", value: "051-111-728-687" },
  { label: "WhatsApp", value: "0300-0728-687" },
  { label: "Email", value: "delivery@savourfoods.com.pk" },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".contact-info-anim > *", { y: 40, opacity: 0 });
      gsap.to(".contact-info-anim > *", {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%", once: true },
      });
      gsap.set(".contact-form-anim > *", { y: 40, opacity: 0 });
      gsap.to(".contact-form-anim > *", {
        y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".contact-form-anim", start: "top 70%", once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="relative py-20 md:py-40 px-6 md:px-8 lg:px-16 min-h-screen flex items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 max-w-[1200px] mx-auto w-full">
        <div className="contact-info-anim">
          <span className="text-xs tracking-[0.4em] uppercase text-gold mb-8 block">Visit Us</span>
          <h2 className="font-heading text-[clamp(2rem,4vw,3.5rem)] font-bold mb-8">Come Taste the Legend</h2>
          <p className="text-base leading-[1.8] text-cream/60 mb-8">
            Visit us at our iconic location in Rawalpindi, or order online for delivery. Every bite is worth the journey.
          </p>
          {details.map((d) => (
            <div key={d.label} className="mb-6">
              <div className="text-xs tracking-[0.3em] uppercase text-gold mb-2">{d.label}</div>
              <div className="text-base text-cream/80 whitespace-pre-line">{d.value}</div>
            </div>
          ))}
          <div className="mt-8 flex gap-4">
            <a
              href="https://www.facebook.com/SavourFoodsPakistan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cream/50 hover:text-gold transition-colors tracking-wider"
            >
              Facebook
            </a>
            <span className="text-cream/20">|</span>
            <a
              href="https://www.instagram.com/savourfoodspk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cream/50 hover:text-gold transition-colors tracking-wider"
            >
              Instagram
            </a>
          </div>
        </div>

        <form className="contact-form-anim flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          {[
            { id: "name", label: "Your Name", type: "text" },
            { id: "phone", label: "Phone Number", type: "tel" },
          ].map((f) => (
            <div key={f.id} className="form-group relative">
              <input
                type={f.type}
                id={f.id}
                placeholder=" "
                className="w-full bg-transparent border-b border-gold/20 py-4 text-base text-cream outline-none focus:border-gold transition-colors"
              />
              <label htmlFor={f.id} className="absolute left-0 top-4 text-sm text-cream/40 pointer-events-none transition-all duration-300">
                {f.label}
              </label>
            </div>
          ))}
          <div className="form-group relative">
            <textarea
              id="message"
              placeholder=" "
              className="w-full bg-transparent border-b border-gold/20 py-4 text-base text-cream outline-none focus:border-gold transition-colors resize-none h-[120px]"
            />
            <label htmlFor="message" className="absolute left-0 top-4 text-sm text-cream/40 pointer-events-none transition-all duration-300">
              Your Message
            </label>
          </div>
          <button
            type="submit"
            className="submit-btn self-start bg-transparent border border-gold text-gold px-12 py-4 text-sm tracking-[0.2em] uppercase cursor-pointer relative overflow-hidden hover:text-cream transition-colors duration-400"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
