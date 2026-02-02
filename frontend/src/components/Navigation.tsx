"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, Globe, User } from "lucide-react";
import { navLinks, buttons } from "@/lib/constants";

interface NavigationProps {
  onLogoClick?: () => void;
}

export default function Navigation({ onLogoClick }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<"EN" | "FR">("EN");

  const toggleLanguage = () => {
    setLanguage(language === "EN" ? "FR" : "EN");
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onLogoClick) {
      onLogoClick();
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0520]/90 backdrop-blur-sm border-b border-[#5227FF]/30">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Violet Ring with M letter 24x24 */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center cursor-pointer"
            aria-label="Go to welcome screen"
          >
            <div className="w-[24px] h-[24px] rounded-full border-[2px] border-[#FF9FFC] bg-transparent flex items-center justify-center hover:bg-[#FF9FFC]/20 transition-colors">
              <span className="text-[#FF9FFC] text-[10px] font-semibold leading-none">M</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-0.5 text-[13px] leading-[140%] tracking-[-0.02em] font-[var(--font-display)] font-normal transition-colors hover:opacity-80"
              >
                <span className="text-[#FF9FFC] tabular-nums">{index + 1}.</span>
                <span className="text-white">{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Language Toggle, Sign In & Resume Button */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#5227FF]/50 hover:border-[#FF9FFC] transition-colors"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4 text-[#FF9FFC]" />
              <span className="text-[#B19EEF] text-sm font-medium">{language}</span>
            </button>

            {/* Sign In Icon */}
            <Link
              href="/sign-in"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-[#5227FF]/50 hover:border-[#FF9FFC] hover:bg-[#5227FF]/20 transition-all"
              aria-label="Sign in"
            >
              <User className="w-5 h-5 text-[#FF9FFC]" />
            </Link>
            
            <button
              className="bg-[#5227FF] text-white font-[var(--font-display)] font-medium text-[14px] leading-[140%] tracking-[-0.02em] px-8 py-2.5 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
              style={{
                boxShadow: "0 4px 14px 0 rgba(82, 39, 255, 0.39), inset 0 1px 0 0 rgba(255,255,255,0.2)"
              }}
            >
              {buttons.resume}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-[#5227FF]/30">
            <div className="flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-1 text-[16px] leading-[140%] tracking-[-0.02em] font-[var(--font-display)] font-normal px-4 py-2 transition-colors hover:opacity-80"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-[#FF9FFC]">{index + 1}.</span>
                  <span className="text-white">{link.name}</span>
                </Link>
              ))}
              <div className="px-4 pt-2">
                <button
                  className="bg-[#5227FF] text-white font-[var(--font-display)] font-medium text-[16px] leading-[140%] tracking-[-0.02em] px-12 py-3 rounded-xl shadow-lg w-full hover:opacity-90 transition-opacity"
                  style={{
                    boxShadow: "0 4px 14px 0 rgba(82, 39, 255, 0.39), inset 0 1px 0 0 rgba(255,255,255,0.2)"
                  }}
                >
                  {buttons.resume}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
