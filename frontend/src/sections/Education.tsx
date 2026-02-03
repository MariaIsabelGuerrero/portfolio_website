'use client';

import React, { useEffect } from 'react';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  description: string;
  achievements?: string[];
}

const educationData: EducationItem[] = [
  {
    degree: "Computer Network & Telecommunications Engineering",
    institution: "SMK Negeri 1 Cimahi",
    location: "Cimahi, Indonesia",
    period: "2021 - 2024",
    description: "Specialized in network infrastructure, telecommunications systems, and web development fundamentals.",
    achievements: [
      "Focused on Front-End Development",
      "Completed multiple web development projects",
      "Strong foundation in networking and telecommunications"
    ]
  }
];

const EducationCard = ({ education, index }: { education: EducationItem; index: number }) => {
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
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#6366f1]" />
              <span className="text-lg">{education.location}</span>
            </div>
          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            {education.description}
          </p>

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
  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

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
          <EducationCard key={index} education={education} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Education;
