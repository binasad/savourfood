"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = mouseX - 4 + "px";
        dotRef.current.style.top = mouseY - 4 + "px";
      }
    };
    window.addEventListener("mousemove", onMove);

    let raf: number;
    const animate = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.left = ringX - 20 + "px";
        ringRef.current.style.top = ringY - 20 + "px";
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="fixed w-2 h-2 bg-gold rounded-full pointer-events-none z-[9999] mix-blend-difference" />
      <div ref={ringRef} className="fixed w-10 h-10 border border-gold/50 rounded-full pointer-events-none z-[9998]" style={{ transition: "width .3s, height .3s" }} />
    </>
  );
}
