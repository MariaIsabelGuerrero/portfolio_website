'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GraduationCap, Calendar, MapPin, Loader2 } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { getEducation, type EducationData } from '@/lib/public-api';
import { useLanguage } from '@/lib/i18n';

const EducationCard = ({ education, index, l }: { education: EducationData; index: number; l: (en: string, fr: string) => string }) => {
  return (
    <div
      className="relative"
      data-aos="fade-up"
      data-aos-delay={index * 200}
      data-aos-duration="1000"
    >
      {/* Timeline connector */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#6366f1] to-[#a855f7] hidden md:block" />

      <div className="relative flex gap-5">
        {/* Timeline dot */}
        <div className="hidden md:flex flex-col items-center">
          <div className="w-11 h-11 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] flex items-center justify-center shadow-lg shadow-purple-500/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Card content */}
        <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-5 hover:bg-white/10 transition-all duration-300 group">
          {/* Mobile icon */}
          <div className="md:hidden w-10 h-10 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] flex items-center justify-center mb-3 shadow-lg shadow-purple-500/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#6366f1] group-hover:to-[#a855f7] transition-all duration-300">
                {l(education.degree_en, education.degree_fr)}
              </h3>
              <p className="text-base text-[#a855f7] font-medium mt-1">
                {education.institution}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-3 text-gray-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#6366f1]" />
              <span className="text-sm">{education.period}</span>
            </div>
            {education.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#6366f1]" />
                <span className="text-sm">{education.location}</span>
              </div>
            )}
          </div>

          {l(education.description_en, education.description_fr) && (
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              {l(education.description_en, education.description_fr)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const Education = () => {
  const { t, l } = useLanguage();
  const [educationData, setEducationData] = useState<EducationData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const res = await getEducation();
      setEducationData(res.data);
    } catch (err) {
      console.error('Failed to load education:', err);
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
      <section className="py-16 px-[5%] sm:px-[5%] lg:px-[10%] bg-[#030014]" id="Education">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-[#6366f1] animate-spin" />
        </div>
      </section>
    );
  }

  if (educationData.length === 0) return null;

  return (
    <section className="py-16 px-[5%] sm:px-[5%] lg:px-[10%] bg-[#030014]" id="Education">
      <div className="text-center mb-12">
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
          data-aos="zoom-in-up"
          data-aos-duration="600"
        >
          {t("Education", "Formation")}
        </h2>
        <p
          className="mt-3 text-gray-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg"
          data-aos="zoom-in-up"
          data-aos-duration="800"
        >
          {t("My academic journey and qualifications", "Mon parcours académique et mes qualifications")}
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {educationData.map((education, index) => (
          <EducationCard key={education.id} education={education} index={index} l={l} />
        ))}
      </div>
    </section>
  );
};

export default Education; 
