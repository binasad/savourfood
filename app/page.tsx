"use client";
import { useState, useCallback } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PlateHero from "@/components/PlateHero";
import Story from "@/components/Story";
import Dishes from "@/components/Dishes";
import Menu from "@/components/Menu";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const onLoaded = useCallback(() => setLoaded(true), []);

  return (
    <SmoothScroll>
      <div className="overflow-x-clip">
        <CustomCursor />
        <Loader onComplete={onLoaded} />
        {loaded && <Navbar />}
        <main>
          <Hero />
          <PlateHero />
          <Story />
          <Dishes />
          <Menu />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
