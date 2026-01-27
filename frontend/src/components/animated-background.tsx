"use client";

import LiquidEther from "./liquid-ether";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#0f0520]">
      <LiquidEther
        colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
        mouseForce={15}
        cursorSize={80}
        isViscous
        viscous={25}
        iterationsViscous={24}
        iterationsPoisson={24}
        resolution={0.4}
        isBounce={false}
        autoDemo
        autoSpeed={0.3}
        autoIntensity={1.5}
        takeoverDuration={0.25}
        autoResumeDelay={5000}
        autoRampDuration={0.8}
        style={{ width: "100%", height: "100%", opacity: 0.6 }}
      />
    </div>
  );
}
