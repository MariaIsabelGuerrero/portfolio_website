'use client';

import React, { useEffect, useState, memo, useMemo } from "react"
import { FileText, Code, Globe, ArrowUpRight, Sparkles } from "lucide-react"
import { fetchResumes, type ResumeFile } from "@/lib/api-client"
import { getProjects } from "@/lib/public-api"
import { useLanguage } from "@/lib/i18n"
import AOS from 'aos'
import 'aos/dist/aos.css'

// Memoized Components
const Header = memo(function Header({ t }: { t: (en: string, fr: string) => string }) {
  return (
    <div className="text-center lg:mb-8 mb-4 px-[5%]">
      <div className="inline-block relative group">
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
          data-aos="zoom-in-up"
          data-aos-duration="600"
        >
          {t("About Me", "À propos de moi")}
        </h2>
      </div>
      <p
        className="mt-3 text-gray-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg flex items-center justify-center gap-3"
        data-aos="zoom-in-up"
        data-aos-duration="800"
      >
        <Sparkles className="w-5 h-5 text-purple-400" />
        {t("Transforming ideas into digital experiences", "Transformer les idées en expériences numériques")}
        <Sparkles className="w-5 h-5 text-purple-400" />
      </p>
    </div>
  );
});

const ProfileImage = memo(function ProfileImage() {
  return (
    <div className="flex justify-end items-center sm:p-12 sm:py-0 sm:pb-0 p-0 py-2 pb-2">
      <div
        className="relative group"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        {/* Optimized gradient backgrounds with reduced complexity for mobile */}
        <div className="absolute -inset-6 opacity-[25%] z-0 hidden sm:block">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 rounded-full blur-2xl animate-spin-slower" />
          <div className="absolute inset-0 bg-gradient-to-l from-fuchsia-500 via-rose-500 to-pink-600 rounded-full blur-2xl animate-pulse-slow opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600 via-cyan-500 to-teal-400 rounded-full blur-2xl animate-float opacity-50" />
        </div>

        <div className="relative">
          <div className="w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-[0_0_40px_rgba(120,119,198,0.3)] transform transition-all duration-700 group-hover:scale-105">
            <div className="absolute inset-0 border-4 border-white/20 rounded-full z-20 transition-all duration-700 group-hover:border-white/40 group-hover:scale-105" />

            {/* Optimized overlay effects - disabled on mobile */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10 transition-opacity duration-700 group-hover:opacity-0 hidden sm:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-transparent to-blue-500/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden sm:block" />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Photo.jpeg"
              alt="Profile"
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
              loading="lazy"
            />

            {/* Advanced hover effects - desktop only */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 z-20 hidden sm:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/10 to-transparent transform translate-y-full group-hover:-translate-y-full transition-transform duration-1000 delay-100" />
              <div className="absolute inset-0 rounded-full border-8 border-white/10 scale-0 group-hover:scale-100 transition-transform duration-700 animate-pulse-slow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  value: number;
  label: string;
  description: string;
  animation: string;
}

const StatCard = memo(function StatCard({ icon: Icon, color, value, label, description, animation }: StatCardProps) {
  return (
    <div data-aos={animation} data-aos-duration={1300} className="relative group">
      <div className="relative z-10 bg-gray-900/50 backdrop-blur-lg rounded-2xl p-5 border border-white/10 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full flex flex-col justify-between">
        <div className={`absolute -z-10 inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>

        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 transition-transform group-hover:rotate-6">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span
            className="text-3xl lg:text-4xl font-bold text-white"
            data-aos="fade-up-left"
            data-aos-duration="1500"
            data-aos-anchor-placement="top-bottom"
          >
            {value}
          </span>
        </div>

        <div>
          <p
            className="text-xs lg:text-sm uppercase tracking-wider text-gray-300 mb-1"
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-anchor-placement="top-bottom"
          >
            {label}
          </p>
          <div className="flex items-center justify-between">
            <p
              className="text-xs text-gray-400"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-anchor-placement="top-bottom"
            >
              {description}
            </p>
            <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
});

const AboutPage = () => {
  const { t, language } = useLanguage();
  const [activeResumes, setActiveResumes] = useState<ResumeFile[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);

  useEffect(() => {
    fetchResumes()
      .then((res) => setActiveResumes(res.data))
      .catch(() => {});
    getProjects()
      .then((res) => setTotalProjects(res.data.length))
      .catch(() => {});
  }, []);

  const enResume = activeResumes.find((r) => r.language === "en");
  const frResume = activeResumes.find((r) => r.language === "fr");

  const YearExperience = useMemo(() => {
    const startDate = new Date("2021-11-06");
    const today = new Date();
    return today.getFullYear() - startDate.getFullYear() -
      (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0);
  }, []);

  // Optimized AOS initialization
  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: false,
      });
    };

    initAOS();

    // Debounced resize handler
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initAOS, 250);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Memoized stats data
  const statsData = useMemo(() => [
    {
      icon: Code,
      color: "from-[#6366f1] to-[#a855f7]",
      value: totalProjects,
      label: t("Total Projects", "Projets totaux"),
      description: t("Innovative web solutions crafted", "Solutions web innovantes créées"),
      animation: "fade-right",
    },
    {
      icon: Globe,
      color: "from-[#6366f1] to-[#a855f7]",
      value: YearExperience,
      label: t("Years of Experience", "Années d'expérience"),
      description: t("Continuous learning journey", "Parcours d'apprentissage continu"),
      animation: "fade-left",
    },
  ], [totalProjects, YearExperience, t]);

  return (
    <div
      className="h-auto pb-[10%] text-white overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] mt-10 sm-mt-0"
      id="About"
    >
      <Header t={t} />

      <div className="w-full mx-auto pt-8 sm:pt-12 relative">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                {t("Hello, I'm", "Bonjour, je suis")}
              </span>
              <span
                className="block mt-2 text-gray-200"
                data-aos="fade-right"
                data-aos-duration="1300"
              >
                Maria Isabel Guerrero
              </span>
            </h2>

            <p
              className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed text-justify pb-4 sm:pb-0"
              data-aos="fade-right"
              data-aos-duration="1500"
            >
              {t(
                "A Computer Science Technology student with a strong focus on full-stack development. I specialize in building robust backend systems and modern web applications, always striving to turn complex problems into elegant, efficient solutions in every project I work on.",
                "Une étudiante en techniques de l'informatique avec un fort intérêt pour le développement full-stack. Je me spécialise dans la création de systèmes backend robustes et d'applications web modernes, cherchant toujours à transformer des problèmes complexes en solutions élégantes et efficaces dans chaque projet."
              )}
            </p>

            {/* Quote Section */}
            <div
              className="relative bg-gradient-to-br from-[#6366f1]/5 via-transparent to-[#a855f7]/5 border border-gradient-to-r border-[#6366f1]/30 rounded-2xl p-6 my-6 backdrop-blur-md shadow-2xl overflow-hidden"
              data-aos="fade-up"
              data-aos-duration="1700"
            >
              {/* Floating orbs background */}
              <div className="absolute top-2 right-4 w-16 h-16 bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-2 w-12 h-12 bg-gradient-to-r from-[#a855f7]/20 to-[#6366f1]/20 rounded-full blur-lg"></div>

              {/* Quote icon */}
              <div className="absolute top-3 left-4 text-[#6366f1] opacity-30">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                </svg>
              </div>

              <blockquote className="text-gray-300 text-center lg:text-left italic font-medium text-sm lg:text-base relative z-10 pl-8">
                &quot;{t(
                  "Driven by curiosity, fueled by clean code, and committed to continuous learning.",
                  "Guidée par la curiosité, alimentée par un code propre, et engagée dans l'apprentissage continu."
                )}&quot;
              </blockquote>
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-6 lg:px-0 w-full">
              {(enResume || frResume) && (
                <a
                  href={(language === "fr" ? frResume?.fileUrl : enResume?.fileUrl) || frResume?.fileUrl || enResume?.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full lg:w-auto"
                >
                  <button
                    data-aos="fade-up"
                    data-aos-duration="800"
                    className="w-full lg:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white text-base font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-3 shadow-lg hover:shadow-xl"
                  >
                    <FileText className="w-5 h-5" /> {t("Download CV", "Télécharger le CV")}
                  </button>
                </a>
              )}
              <a href="#Portfolio" className="w-full lg:w-auto">
                <button
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  className="w-full lg:w-auto px-6 py-3 rounded-xl border border-[#a855f7]/50 text-[#a855f7] text-base font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-3 hover:bg-[#a855f7]/10"
                >
                  <Code className="w-5 h-5" /> {t("View Projects", "Voir les projets")}
                </button>
              </a>
            </div>
          </div>

          <ProfileImage />
        </div>

        <a href="#Portfolio">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 cursor-pointer">
            {statsData.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </a>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin-slower {
          to { transform: rotate(360deg); }
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s infinite;
        }
        .animate-spin-slower {
          animation: spin-slower 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default memo(AboutPage);
