'use client';

import React, { useState, useEffect } from "react";
import { Menu, X, Globe } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");
    const { language, setLanguage, t } = useLanguage();

    const navItems = [
        { href: "#Home", label: t("Home", "Accueil") },
        { href: "#About", label: t("About", "A propos") },
        { href: "#Portofolio", label: "Portfolio" },
        { href: "#Contact", label: "Contact" },
    ];

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'fr' : 'en');
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            const sections = navItems.map(item => {
                const section = document.querySelector(item.href) as HTMLElement | null;
                if (section) {
                    return {
                        id: item.href.replace("#", ""),
                        offset: section.offsetTop - 550,
                        height: section.offsetHeight
                    };
                }
                return null;
            }).filter((s): s is { id: string; offset: number; height: number } => s !== null);

            const currentPosition = window.scrollY;
            const active = sections.find(section =>
                currentPosition >= section.offset &&
                currentPosition < section.offset + section.height
            );

            if (active) {
                setActiveSection(active.id);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [language]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const section = document.querySelector(href);
        if (section) {
            const top = (section as HTMLElement).offsetTop - 100;
            window.scrollTo({
                top: top,
                behavior: "smooth"
            });
        }
        setIsOpen(false);
    };

    return (
        <nav
            className={`fixed w-full top-0 z-50 transition-all duration-500 ${
                isOpen
                    ? "bg-[#030014]"
                    : scrolled
                    ? "bg-[#030014]/50 backdrop-blur-xl"
                    : "bg-transparent"
            }`}
        >
            <div className="mx-auto px-[5%] sm:px-[5%] lg:px-[10%]">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a
                            href="#Home"
                            onClick={(e) => scrollToSection(e, "#Home")}
                            className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#a855f7] to-[#6366f1] bg-clip-text text-transparent"
                        >
                            Maria
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-10">
                            {navItems.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={(e) => scrollToSection(e, item.href)}
                                    className="group relative px-1 py-2 text-base lg:text-lg font-medium"
                                >
                                    <span
                                        className={`relative z-10 transition-colors duration-300 ${
                                            activeSection === item.href.substring(1)
                                                ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-semibold"
                                                : "text-[#e2d3fd] group-hover:text-white"
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                    <span
                                        className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] transform origin-left transition-transform duration-300 ${
                                            activeSection === item.href.substring(1)
                                                ? "scale-x-100"
                                                : "scale-x-0 group-hover:scale-x-100"
                                        }`}
                                    />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right side buttons - Desktop */}
                    <div className="hidden md:flex items-center space-x-8">
                        {/* Language Toggle */}
                        <button
                            onClick={toggleLanguage}
                            className="group flex items-center gap-2 hover:opacity-80 transition-all duration-300"
                            title={language === 'en' ? 'Switch to French' : 'Switch to English'}
                        >
                            <Globe className="w-6 h-6 text-[#e2d3fd] group-hover:text-white transition-colors" />
                            <span className="text-base font-medium text-[#e2d3fd] group-hover:text-white transition-colors uppercase">
                                {language}
                            </span>
                        </button>

                        {/* Login Button */}
                        <Link
                            href="/admin/login"
                            className="group hover:opacity-80 transition-all duration-300"
                            title={language === 'en' ? 'Admin Login' : 'Connexion Admin'}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/admin-icon.svg" alt="Login" className="w-7 h-7" />
                        </Link>
                    </div>

                    {/* Mobile Menu Button & Icons */}
                    <div className="md:hidden flex items-center space-x-5">
                        {/* Language Toggle - Mobile */}
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-2 hover:opacity-80 transition-all"
                            title={language === 'en' ? 'Switch to French' : 'Switch to English'}
                        >
                            <Globe className="w-6 h-6 text-[#e2d3fd]" />
                            <span className="text-sm text-[#e2d3fd] uppercase">{language}</span>
                        </button>

                        {/* Login Button - Mobile */}
                        <Link
                            href="/admin/login"
                            className="hover:opacity-80 transition-all"
                            title={language === 'en' ? 'Admin Login' : 'Connexion Admin'}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/admin-icon.svg" alt="Login" className="w-7 h-7" />
                        </Link>

                        {/* Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`relative p-2 text-[#e2d3fd] hover:text-white transition-transform duration-300 ease-in-out transform ${
                                isOpen ? "rotate-90 scale-125" : "rotate-0 scale-100"
                            }`}
                        >
                            {isOpen ? (
                                <X className="w-7 h-7" />
                            ) : (
                                <Menu className="w-7 h-7" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out ${
                    isOpen
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                }`}
            >
                <div className="px-4 py-8 space-y-5">
                    {navItems.map((item, index) => (
                        <a
                            key={item.href}
                            href={item.href}
                            onClick={(e) => scrollToSection(e, item.href)}
                            className={`block px-4 py-3 text-xl font-medium transition-all duration-300 ease ${
                                activeSection === item.href.substring(1)
                                    ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-semibold"
                                    : "text-[#e2d3fd] hover:text-white"
                            }`}
                            style={{
                                transitionDelay: `${index * 100}ms`,
                                transform: isOpen ? "translateX(0)" : "translateX(50px)",
                                opacity: isOpen ? 1 : 0,
                            }}
                        >
                            {item.label}
                        </a>
                    ))}

                    {/* Mobile Menu - Language & Login */}
                    <div
                        className="flex items-center justify-between px-4 pt-6 border-t border-white/10"
                        style={{
                            transitionDelay: `${navItems.length * 100}ms`,
                            transform: isOpen ? "translateX(0)" : "translateX(50px)",
                            opacity: isOpen ? 1 : 0,
                        }}
                    >
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-3 text-[#e2d3fd] hover:text-white transition-colors"
                        >
                            <Globe className="w-6 h-6" />
                            <span className="text-base uppercase">{language}</span>
                        </button>

                        <Link
                            href="/admin/login"
                            className="flex items-center gap-3 text-[#e2d3fd] hover:text-white transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/admin-icon.svg" alt="Login" className="w-6 h-6" />
                            <span className="text-base">
                                {language === 'en' ? 'Admin' : 'Admin'}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
