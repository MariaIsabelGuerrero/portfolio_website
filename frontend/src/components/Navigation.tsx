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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a192f]/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="text-[#64ffda] text-2xl font-bold">
            <svg
              width="42"
              height="42"
              viewBox="0 0 42 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon
                points="21,2 40,12 40,32 21,42 2,32 2,12"
                stroke="#64ffda"
                strokeWidth="2"
                fill="transparent"
              />
              <text
                x="21"
                y="27"
                textAnchor="middle"
                fill="#64ffda"
                fontSize="18"
                fontFamily="monospace"
              >
                D
              </text>
            </svg>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[#ccd6f6] hover:text-[#64ffda] transition-colors text-sm"
              >
                <span className="text-[#64ffda] mr-1">{link.number}</span>
                {link.name}
              </Link>
            ))}
            <Link
              href="/resume.pdf"
              className="btn-primary text-sm"
              target="_blank"
            >
              Resume
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#64ffda] p-2"
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
        <div className="md:hidden bg-[#112240] border-t border-[#233554]">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-[#ccd6f6] hover:text-[#64ffda] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-[#64ffda] mr-2">{link.number}</span>
                {link.name}
              </Link>
            ))}
            <Link
              href="/resume.pdf"
              className="inline-block btn-primary text-sm mt-4"
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
