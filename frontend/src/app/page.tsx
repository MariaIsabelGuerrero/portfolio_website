"use client";

import { useState } from "react";
import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import About from "@/components/about";
import Experience from "@/components/experience";
import Education from "@/components/education";
import Projects from "@/components/projects";
import Hobbies from "@/components/hobbies";
import Testimonials from "@/components/testimonials";
import Skills from "@/components/skills";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import Welcome from "@/components/welcome";
import AnimatedBackground from "@/components/animated-background";

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);

  const triggerWelcome = () => {
    setShowWelcome(true);
  };

  return (
    <>
      {showWelcome && <Welcome onComplete={() => setShowWelcome(false)} />}
      {/* Persistent animated LiquidEther background */}
      <AnimatedBackground />
      <main className={`min-h-screen relative z-10 ${showWelcome ? "fixed inset-0 overflow-hidden" : ""}`}>
        <Navigation onLogoClick={triggerWelcome} />
        <Hero />
        <About />
        <Experience />
        <Education />
        <Projects />
        <Hobbies />
        <Testimonials />
        <Skills />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
