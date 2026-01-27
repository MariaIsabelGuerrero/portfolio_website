"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LiquidEther from "./liquid-ether";

export default function Welcome({ onComplete }: { onComplete: () => void }) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentLang, setCurrentLang] = useState(0);
  
  const texts = ["Welcome!", "Bienvenue!"];
  
  useEffect(() => {
    // Show Welcome first, then Bienvenue, no loop
    const langTimer = setTimeout(() => {
      setCurrentLang(1); // Switch to Bienvenue!
    }, 1500);

    // After both shown, start slide up
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(langTimer);
    };
  }, []);

  useEffect(() => {
    if (!showWelcome) {
      // Wait for exit animation to complete before calling onComplete
      const exitTimer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(exitTimer);
    }
  }, [showWelcome, onComplete]);

  const currentText = texts[currentLang];

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* LiquidEther Background */}
          <div className="absolute inset-0 bg-[#0f0520]">
            <LiquidEther
              colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
              mouseForce={20}
              cursorSize={100}
              isViscous
              viscous={30}
              iterationsViscous={32}
              iterationsPoisson={32}
              resolution={0.5}
              isBounce={false}
              autoDemo
              autoSpeed={0.5}
              autoIntensity={2.2}
              takeoverDuration={0.25}
              autoResumeDelay={3000}
              autoRampDuration={0.6}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          {/* Animated Text */}
          <div className="relative z-10 text-center px-4">
            <AnimatePresence mode="wait">
              <motion.h1 
                key={currentLang}
                className="font-sans font-bold text-[36px] sm:text-[56px] lg:text-[72px] text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {currentText.split("").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.08,
                      delay: index * 0.04,
                      ease: "easeOut",
                    }}
                    className="inline-block"
                    style={{ whiteSpace: char === " " ? "pre" : "normal" }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.h1>
            </AnimatePresence>

            {/* Language indicator dots */}
            <div className="flex justify-center gap-3 mt-8">
              {[0, 1].map((index) => (
                <motion.div
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full ${currentLang === index ? "bg-[#FF9FFC]" : "bg-[#5227FF]/50"}`}
                  animate={{ scale: currentLang === index ? 1.3 : 1 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
