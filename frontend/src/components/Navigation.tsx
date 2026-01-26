'use client';

import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { name: 'About', href: '#about', number: '1.' },
  { name: 'Experience', href: '#experience', number: '2.' },
  { name: 'Projects', href: '#projects', number: '3.' },
  { name: 'Activity', href: '#activity', number: '4.' },
  { name: 'Contact', href: '#contact', number: '5.' },
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0C1B31]/95 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center lg:-ml-[200px] group">
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="18"
                cy="18"
                r="16"
                stroke="#4876CE"
                strokeWidth="3"
                fill="transparent"
                className="group-hover:fill-[#4876CE] transition-all duration-300"
              />
              <text
                x="18"
                y="23"
                textAnchor="middle"
                fill="#4876CE"
                fontSize="16"
                fontWeight="bold"
                fontFamily="Open Sans, sans-serif"
                className="group-hover:!fill-[#0C1B31] transition-all duration-300"
              >
                M
              </text>
            </svg>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center justify-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white hover:text-[#4876CE] transition-colors font-['Radio_Canada'] text-[14px]"
              >
                <span className="text-[#4876CE] mr-1">{link.number}</span>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Resume Button - Right */}
          <div className="hidden md:block lg:-mr-16">
            <Link
              href="/resume.pdf"
              className="bg-[#4876CE] text-white px-8 py-3 rounded-xl font-['Radio_Canada'] text-[14px] font-medium hover:bg-[#5a85d6] transition-all"
              target="_blank"
            >
              Resume
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden ml-auto text-[#4876CE] p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#112240] border-t border-[#4876CE]/30">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-white hover:text-[#4876CE] transition-colors font-['Radio_Canada']"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-[#4876CE] mr-2">{link.number}</span>
                {link.name}
              </Link>
            ))}
            <Link
              href="/resume.pdf"
              className="inline-block bg-[#4876CE] text-white px-6 py-2 rounded-xl font-['Radio_Canada'] text-sm font-medium mt-4"
              target="_blank"
            >
              Resume
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
