'use client';

import React, { useState, useEffect, useCallback, memo, useMemo } from "react"
import { Github, Linkedin, Mail, ExternalLink, Sparkles } from "lucide-react"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useLanguage } from '@/lib/i18n'
import { useProfile, useContact } from '@/lib/site-content'

// Memoized Components
const StatusBadge = memo(function StatusBadge({ label }: { label: string }) {
  return (
    <div className="inline-block animate-float lg:mx-0" data-aos="zoom-in" data-aos-delay="400">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative px-3 sm:px-5 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
          <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-transparent bg-clip-text text-xs sm:text-sm font-medium flex items-center">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-blue-400" />
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
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
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
    <div className="px-3 py-1.5 hidden sm:block rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors">
      {tech}
    </div>
  );
});

const CTAButton = memo(function CTAButton({ href, text, icon: Icon }: { href: string; text: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <a href={href}>
      <button className="group relative w-[160px] sm:w-[180px]">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-50 blur-md group-hover:opacity-90 transition-all duration-700"></div>
        <div className="relative h-11 sm:h-12 bg-[#030014] backdrop-blur-xl rounded-xl border border-white/10 leading-none overflow-hidden">
          <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-[#4f52c9]/20 to-[#8644c5]/20"></div>
          <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm sm:text-base group-hover:gap-3 transition-all duration-300">
            <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-medium z-10">
              {text}
            </span>
            <Icon className={`w-5 h-5 text-gray-200 ${text === 'Contact' ? 'group-hover:translate-x-1' : 'group-hover:rotate-45'} transform transition-all duration-300 z-10`} />
          </span>
        </div>
      </button>
    </a>
  );
});

const SocialLink = memo(function SocialLink({ icon: Icon, link }: { icon: React.ComponentType<{ className?: string }>; link: string }) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <button className="group relative p-3">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
        <div className="relative rounded-xl bg-black/50 backdrop-blur-xl p-2.5 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
          <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
        </div>
      </button>
    </a>
  );
});

const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 6000;

const Home = () => {
  const { t, language } = useLanguage()
  const profile = useProfile()
  const contact = useContact()

  const WORDS = useMemo(() => {
    const list = language === "fr" ? profile.typingWords_fr : profile.typingWords_en
    return list && list.length > 0 ? list : [""]
  }, [language, profile.typingWords_en, profile.typingWords_fr])

  const socialLinks = useMemo(() => {
    return [
      contact.github ? { icon: Github, link: contact.github } : null,
      contact.linkedin ? { icon: Linkedin, link: contact.linkedin } : null,
    ].filter((s): s is { icon: typeof Github; link: string } => s !== null)
  }, [contact.github, contact.linkedin])

  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

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

  // Reset typing when language or word list changes
  useEffect(() => {
    setText("");
    setCharIndex(0);
    setWordIndex(0);
    setIsTyping(true);
  }, [language, WORDS]);

  const handleTyping = useCallback(() => {
    const currentWord = WORDS[wordIndex] || ""
    if (isTyping) {
      if (charIndex < currentWord.length) {
        setText(prev => prev + currentWord[charIndex]);
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
  }, [charIndex, isTyping, wordIndex, WORDS]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    );
    return () => clearTimeout(timeout);
  }, [handleTyping, isTyping]);

  return (
    <div className="min-h-screen bg-[#030014] overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%]" id="Home">
      <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="min-h-screen">
          <div className="flex flex-col items-center justify-center min-h-screen gap-8 pt-24">
            <div className="w-full max-w-3xl mx-auto space-y-4 sm:space-y-5 text-left lg:text-left"
              data-aos="fade-right"
              data-aos-delay="200">
              <div className="space-y-4">
                <StatusBadge label={t(profile.heroBadge_en, profile.heroBadge_fr)} />
                <MainTitle
                  line1={t(profile.heroTitleLine1_en, profile.heroTitleLine1_fr)}
                  line2={t(profile.heroTitleLine2_en, profile.heroTitleLine2_fr)}
                />

                {/* Typing Effect */}
                <div className="h-10 sm:h-12 flex items-center mb-2 overflow-visible" data-aos="fade-up" data-aos-delay="800">
                  <span className="text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent font-light whitespace-nowrap" style={{ lineHeight: '1.4', paddingBottom: '0.15em', display: 'inline-block' }}>
                    {text}
                  </span>
                  <span className="w-[3px] h-8 bg-gradient-to-t from-[#6366f1] to-[#a855f7] ml-1 animate-blink"></span>
                </div>

                {/* Description */}
                <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl leading-relaxed font-light"
                  data-aos="fade-up"
                  data-aos-delay="1000">
                  {t(profile.heroDescription_en, profile.heroDescription_fr)}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-start" data-aos="fade-up" data-aos-delay="1200">
                  {profile.techStack.map((tech, index) => (
                    <TechStack key={index} tech={tech} />
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-row gap-3 w-full justify-start" data-aos="fade-up" data-aos-delay="1400">
                  <CTAButton href="#Portfolio" text={t("Projects", "Projets")} icon={ExternalLink} />
                  <CTAButton href="#Contact" text="Contact" icon={Mail} />
                </div>

                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <div className="hidden sm:flex gap-3 justify-start" data-aos="fade-up" data-aos-delay="1600">
                    {socialLinks.map((social, index) => (
                      <SocialLink key={index} {...social} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Home);
