'use client';

import React, { useState, useEffect, useCallback, memo } from "react"
import { Github, Linkedin, Mail, ExternalLink, Sparkles } from "lucide-react"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useLanguage } from '@/lib/i18n'

// Memoized Components
const StatusBadge = memo(function StatusBadge({ label }: { label: string }) {
  return (
    <div className="inline-block animate-float lg:mx-0" data-aos="zoom-in" data-aos-delay="400">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative px-5 sm:px-8 py-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
          <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-transparent bg-clip-text text-base sm:text-lg font-medium flex items-center">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-400" />
            {label}
          </span>
        </div>
      </div>
    </div>
  );
});

const MainTitle = memo(function MainTitle({ line1, line2 }: { line1: string; line2: string }) {
  return (
    <div className="space-y-2" data-aos="fade-up" data-aos-delay="600">
      <h1 className="text-[2.75rem] sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-tight">
        <span className="relative inline-block">
          <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
          <span className="relative bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
            {line1}
          </span>
        </span>
        <br />
        <span className="relative inline-block mt-2">
          <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
          <span className="relative bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
            {line2}
          </span>
        </span>
      </h1>
    </div>
  );
});

const TechStack = memo(function TechStack({ tech }: { tech: string }) {
  return (
    <div className="px-6 py-3 hidden sm:block rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-lg text-gray-300 hover:bg-white/10 transition-colors">
      {tech}
    </div>
  );
});

const CTAButton = memo(function CTAButton({ href, text, icon: Icon }: { href: string; text: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <a href={href}>
      <button className="group relative w-[200px] sm:w-[240px]">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-50 blur-md group-hover:opacity-90 transition-all duration-700"></div>
        <div className="relative h-14 sm:h-16 bg-[#030014] backdrop-blur-xl rounded-xl border border-white/10 leading-none overflow-hidden">
          <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-[#4f52c9]/20 to-[#8644c5]/20"></div>
          <span className="absolute inset-0 flex items-center justify-center gap-3 text-lg sm:text-xl group-hover:gap-4 transition-all duration-300">
            <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-medium z-10">
              {text}
            </span>
            <Icon className={`w-6 h-6 text-gray-200 ${text === 'Contact' ? 'group-hover:translate-x-1' : 'group-hover:rotate-45'} transform transition-all duration-300 z-10`} />
          </span>
        </div>
      </button>
    </a>
  );
});

const SocialLink = memo(function SocialLink({ icon: Icon, link }: { icon: React.ComponentType<{ className?: string }>; link: string }) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <button className="group relative p-4">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
        <div className="relative rounded-xl bg-black/50 backdrop-blur-xl p-4 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
          <Icon className="w-7 h-7 text-gray-400 group-hover:text-white transition-colors" />
        </div>
      </button>
    </a>
  );
});

// Constants
const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 6000;
const WORDS_EN = ["Computer Science Student", "Tech Enthusiast"];
const WORDS_FR = ["Étudiante en informatique", "Passionnée de technologie"];
const TECH_STACK = ["React", "Javascript", "Node.js", "Tailwind"];
const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/MariaIsabelGuerrero" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/maria-isabel-guerrero-754114303/" },
];

const Home = () => {
  const { t, language } = useLanguage()
  const WORDS = language === "fr" ? WORDS_FR : WORDS_EN
  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Optimize AOS initialization
  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: true,
        offset: 10,
      });
    };

    initAOS();
    window.addEventListener('resize', initAOS);
    return () => window.removeEventListener('resize', initAOS);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  // Reset typing when language changes
  useEffect(() => {
    setText("");
    setCharIndex(0);
    setWordIndex(0);
    setIsTyping(true);
  }, [language]);

  // Optimize typing effect
  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText(prev => prev + WORDS[wordIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else {
        setWordIndex(prev => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    );
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  return (
    <div className="min-h-screen bg-[#030014] overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%]" id="Home">
      <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="min-h-screen">
          <div className="flex flex-col lg:flex-row items-center justify-center h-screen md:justify-between gap-8 lg:gap-12">
            {/* Left Column */}
            <div className="w-full lg:w-1/2 space-y-4 sm:space-y-5 text-left lg:text-left order-1 lg:order-1 lg:mt-0"
              data-aos="fade-right"
              data-aos-delay="200">
              <div className="space-y-4">
                <StatusBadge label={t("Ready to Innovate", "Prête à innover")} />
                <MainTitle line1={t("Full Stack", "Full Stack")} line2={t("Developer", "Développeuse")} />

                {/* Typing Effect */}
                <div className="h-16 sm:h-20 flex items-center mb-2 overflow-visible" data-aos="fade-up" data-aos-delay="800">
                  <span className="text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent font-light" style={{ lineHeight: '1.4', paddingBottom: '0.15em', display: 'inline-block' }}>
                    {text}
                  </span>
                  <span className="w-[4px] h-10 bg-gradient-to-t from-[#6366f1] to-[#a855f7] ml-1 animate-blink"></span>
                </div>

                {/* Description */}
                <p className="text-xl sm:text-2xl lg:text-3xl text-gray-400 max-w-2xl leading-relaxed font-light"
                  data-aos="fade-up"
                  data-aos-delay="1000">
                  {t("Building Scalable, Clean, and User-Focused Applications for Real-World Solutions.", "Créer des applications évolutives, propres et centrées sur l'utilisateur pour des solutions concrètes.")}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-start" data-aos="fade-up" data-aos-delay="1200">
                  {TECH_STACK.map((tech, index) => (
                    <TechStack key={index} tech={tech} />
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-row gap-3 w-full justify-start" data-aos="fade-up" data-aos-delay="1400">
                  <CTAButton href="#Portfolio" text={t("Projects", "Projets")} icon={ExternalLink} />
                  <CTAButton href="#Contact" text="Contact" icon={Mail} />
                </div>

                {/* Social Links */}
                <div className="hidden sm:flex gap-3 justify-start" data-aos="fade-up" data-aos-delay="1600">
                  {SOCIAL_LINKS.map((social, index) => (
                    <SocialLink key={index} {...social} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - WebM Video */}
            <div className="w-full py-0 md:py-[10%] sm:py-0 lg:w-1/2 h-[260px] sm:h-[400px] lg:h-[600px] xl:h-[750px] relative flex items-center justify-center order-2 lg:order-2 mt-5 sm:mt-0"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              data-aos="fade-left"
              data-aos-delay="600">
              <div className="relative w-full opacity-90">
                <div className={`absolute inset-0 bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 rounded-3xl blur-3xl transition-all duration-700 ease-in-out ${
                  isHovering ? "opacity-50 scale-105" : "opacity-20 scale-100"
                }`}>
                </div>

                <div className={`relative lg:left-12 z-10 w-full opacity-90 transform transition-transform duration-500 ${
                  isHovering ? "scale-105" : "scale-100"
                }`}>

                  <img
                    src="Animation1.gif"
                    alt="Developer Animation"
                    className={`w-full h-full object-contain transition-all duration-500 ${
                      isHovering
                        ? "scale-[95%] sm:scale-[90%] md:scale-[90%] lg:scale-[90%] rotate-2"
                        : "scale-[90%] sm:scale-[80%] md:scale-[80%] lg:scale-[80%]"
                    }`}
                  />
                </div>

                <div className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
                  isHovering ? "opacity-50" : "opacity-20"
                }`}>
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite] transition-all duration-700 ${
                    isHovering ? "scale-110" : "scale-100"
                  }`}>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Home);
