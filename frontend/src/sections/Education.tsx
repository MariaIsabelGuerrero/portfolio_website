'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GraduationCap, Calendar, MapPin, Loader2 } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { getEducation, type EducationData } from '@/lib/public-api';

const EducationCard = ({ education, index }: { education: EducationData; index: number }) => {
  return (
    <div
      className="relative"
      data-aos="fade-up"
      data-aos-delay={index * 200}
      data-aos-duration="1000"
    >
      {/* Timeline connector */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#6366f1] to-[#a855f7] hidden md:block" />

      <div className="relative flex gap-6">
        {/* Timeline dot */}
        <div className="hidden md:flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] flex items-center justify-center shadow-lg shadow-purple-500/20">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Card content */}
        <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-all duration-300 group">
          {/* Mobile icon */}
          <div className="md:hidden w-14 h-14 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#6366f1] group-hover:to-[#a855f7] transition-all duration-300">
                {education.degree}
              </h3>
              <p className="text-xl text-[#a855f7] font-medium mt-1">
                {education.institution}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-4 text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#6366f1]" />
              <span className="text-lg">{education.period}</span>
            </div>
            {education.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#6366f1]" />
                <span className="text-lg">{education.location}</span>
              </div>
            )}
          </div>

          {education.description && (
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              {education.description}
            </p>
          )}

          {education.achievements && education.achievements.length > 0 && (
            <div className="mt-4">
              <h4 className="text-white font-medium mb-3 text-lg">Highlights:</h4>
              <ul className="space-y-2">
                {education.achievements.map((achievement, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] mt-2 flex-shrink-0" />
                    <span className="text-lg">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Education = () => {
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
      <section className="py-20 px-[5%] sm:px-[5%] lg:px-[10%] bg-[#030014]" id="Education">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-[#6366f1] animate-spin" />
        </div>
      </section>
    );
  }

  if (educationData.length === 0) return null;

  return (
    <section className="py-20 px-[5%] sm:px-[5%] lg:px-[10%] bg-[#030014]" id="Education">
      <div className="text-center mb-16">
        <h2
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
          data-aos="zoom-in-up"
          data-aos-duration="600"
        >
          Education
        </h2>
        <p
          className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg sm:text-xl lg:text-2xl"
          data-aos="zoom-in-up"
          data-aos-duration="800"
        >
          My academic journey and qualifications
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {educationData.map((education, index) => (
          <EducationCard key={education.id} education={education} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Education;
