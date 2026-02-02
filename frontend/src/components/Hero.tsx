"use client";

import { motion } from "framer-motion";
import { personalInfo, socialLinks } from "@/config/portfolio";
import { heroText } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-16 bg-background relative">
      {/* Left Side - GitHub Icon with Line (anchored from bottom) */}
      <motion.div
        className="hidden lg:flex fixed left-[8px] bottom-0 flex-col items-center gap-4 pb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors">
          <svg 
            className="w-[16px] h-[16px]" 
            viewBox="0 0 16 16" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" clipRule="evenodd" />
          </svg>
        </a>
        <div className="w-[2px] h-[120px] bg-primary" />
      </motion.div>

      {/* Right Side - Email with Line (anchored from bottom) */}
      <motion.div
        className="hidden lg:flex fixed right-[11px] bottom-0 flex-col items-center gap-4 pb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <a
          href={`mailto:${personalInfo.email}`}
          className="font-sans font-semibold text-[16px] leading-[140%] tracking-[-0.02em] text-muted-foreground hover:text-accent transition-colors"
          style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
        >
          {personalInfo.email}
        </a>
        <div className="w-[2px] h-[120px] bg-primary" />
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full lg:ml-24">
        <div className="space-y-6">
          {/* Hi, My name is */}
          <motion.p
            className="font-sans font-semibold text-[28px] leading-[140%] tracking-[-0.02em] text-accent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {heroText.greeting}
          </motion.p>

          {/* Name */}
          <motion.h1
            className="font-sans font-bold text-[40px] sm:text-[56px] lg:text-[72px] leading-[140%] tracking-[-0.02em] text-foreground text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {personalInfo.name}
          </motion.h1>

          {/* Tagline */}
          <motion.h2
            className="font-display font-bold text-[40px] sm:text-[56px] lg:text-[72px] leading-[140%] tracking-[-0.02em] text-white text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {heroText.tagline}
          </motion.h2>

          {/* Description */}
          <motion.p
            className="font-sans font-semibold text-[28px] leading-[140%] tracking-[-0.02em] text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {heroText.description}
          </motion.p>

          {/* Check my resume button */}
          <motion.button
            className="mt-4 w-[243px] h-[66px] bg-background text-accent font-display font-semibold text-[24px] leading-[140%] tracking-[-0.02em] rounded-[12px] border border-primary hover:bg-primary/20 transition-colors shadow-[0_4px_14px_0_var(--primary-shadow)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {heroText.resumeButton}
          </motion.button>
        </div>
      </div>
    </section>
  );
}
