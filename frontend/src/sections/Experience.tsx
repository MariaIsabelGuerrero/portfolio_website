'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Briefcase, Calendar, MapPin, Building2, Loader2 } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { getExperience, type ExperienceData } from '@/lib/public-api';
import { useLanguage } from '@/lib/i18n';

const ExperienceCard = ({ experience, index, t, l, la }: { experience: ExperienceData; index: number; t: (en: string, fr: string) => string; l: (en: string, fr: string) => string; la: (en: string[], fr: string[]) => string[] }) => {
  const isEven = index % 2 === 0;

  return (
    <div
      className="relative"
      data-aos={isEven ? "fade-right" : "fade-left"}
      data-aos-delay={index * 150}
      data-aos-duration="1000"
    >
      {/* Timeline line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#6366f1] to-[#a855f7] hidden lg:block" />

      <div className={`flex flex-col lg:flex-row gap-8 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
        {/* Content */}
        <div className={`flex-1 lg:text-left ${isEven ? 'lg:pr-12' : 'lg:pl-12'}`}>
          <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 hover:bg-white/10 transition-all duration-300 group ${isEven ? 'lg:mr-4' : 'lg:ml-4'}`}>
            {/* Type badge */}
            {experience.type && (
              <span className="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/30 mb-3">
                {experience.type}
              </span>
            )}

            <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#6366f1] group-hover:to-[#a855f7] transition-all duration-300">
              {l(experience.title_en, experience.title_fr)}
            </h3>

            <div className={`flex flex-wrap gap-3 mt-2 mb-3 text-gray-400 lg:justify-start`}>
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#6366f1]" />
                <span className="text-sm text-[#a855f7] font-medium">{experience.company}</span>
              </div>
            </div>

            <div className={`flex flex-wrap gap-3 mb-3 text-gray-400 text-sm lg:justify-start`}>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#6366f1]" />
                <span>{experience.period}</span>
              </div>
              {experience.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#6366f1]" />
                  <span>{experience.location}</span>
                </div>
              )}
            </div>

            {l(experience.description_en, experience.description_fr) && (
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                {l(experience.description_en, experience.description_fr)}
              </p>
            )}

            {la(experience.responsibilities_en || [], experience.responsibilities_fr || []).length > 0 && (
              <div className="mt-3">
                <h4 className="text-white font-medium mb-2 text-sm lg:text-left">{t("Key Responsibilities:", "Responsabilités clés:")}</h4>
                <ul className="space-y-1.5 lg:text-left">
                  {la(experience.responsibilities_en || [], experience.responsibilities_fr || []).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] mt-1.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Timeline dot - centered */}
        <div className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 top-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] flex items-center justify-center shadow-lg shadow-purple-500/30 z-10">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Empty space for alternating layout */}
        <div className="flex-1 hidden lg:block" />
      </div>
    </div>
  );
};

const Experience = () => {
  const { t, l, la } = useLanguage();
  const [experienceData, setExperienceData] = useState<ExperienceData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const res = await getExperience();
      setExperienceData(res.data);
    } catch (err) {
      console.error('Failed to load experience:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    AOS.init({ once: false });
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <section className="py-16 px-[5%] sm:px-[5%] lg:px-[10%] bg-[#030014]" id="Experience">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-[#6366f1] animate-spin" />
        </div>
      </section>
    );
  }

  if (experienceData.length === 0) return null;

  return (
    <section className="py-16 px-[5%] sm:px-[5%] lg:px-[10%] bg-[#030014]" id="Experience">
      <div className="text-center mb-12">
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
          data-aos="zoom-in-up"
          data-aos-duration="600"
        >
          {t("Experience", "Expérience")}
        </h2>
        <p
          className="mt-3 text-gray-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg"
          data-aos="zoom-in-up"
          data-aos-duration="800"
        >
          {t("My professional journey and work experience", "Mon parcours professionnel et mon expérience de travail")}
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-12 relative">
        <div className="lg:hidden flex justify-center mb-6">
          <div className="w-11 h-11 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
        </div>

        {experienceData.map((experience, index) => (
          <ExperienceCard key={experience.id} experience={experience} index={index} t={t} l={l} la={la} />
        ))}
      </div>
    </section>
  );
};

export default Experience;
