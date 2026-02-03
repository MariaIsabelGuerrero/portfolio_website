'use client';

import React, { useEffect } from 'react';
import { Briefcase, Calendar, MapPin, Building2 } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  period: string;
  type: string;
  description: string;
  responsibilities?: string[];
}

const experienceData: ExperienceItem[] = [
  {
    title: "Front-End Developer",
    company: "Freelance",
    location: "Remote",
    period: "2023 - Present",
    type: "Freelance",
    description: "Building modern, responsive web applications using React, Next.js, and Tailwind CSS for various clients.",
    responsibilities: [
      "Developed custom web applications with React and Next.js",
      "Implemented responsive designs using Tailwind CSS",
      "Collaborated with clients to deliver user-friendly solutions",
      "Optimized website performance and SEO"
    ]
  },
  {
    title: "Web Developer Intern",
    company: "Tech Company",
    location: "Cimahi, Indonesia",
    period: "2023",
    type: "Internship",
    description: "Gained hands-on experience in web development, working on real-world projects and learning industry best practices.",
    responsibilities: [
      "Assisted in developing front-end features",
      "Learned version control with Git",
      "Participated in code reviews and team meetings",
      "Built responsive UI components"
    ]
  }
];

const ExperienceCard = ({ experience, index }: { experience: ExperienceItem; index: number }) => {
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
        <div className={`flex-1 ${isEven ? 'lg:text-right lg:pr-12' : 'lg:text-left lg:pl-12'}`}>
          <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-all duration-300 group ${isEven ? 'lg:mr-4' : 'lg:ml-4'}`}>
            {/* Type badge */}
            <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/30 mb-4">
              {experience.type}
            </span>

            <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#6366f1] group-hover:to-[#a855f7] transition-all duration-300">
              {experience.title}
            </h3>

            <div className={`flex flex-wrap gap-4 mt-3 mb-4 text-gray-400 ${isEven ? 'lg:justify-end' : 'lg:justify-start'}`}>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#6366f1]" />
                <span className="text-lg text-[#a855f7] font-medium">{experience.company}</span>
              </div>
            </div>

            <div className={`flex flex-wrap gap-4 mb-4 text-gray-400 ${isEven ? 'lg:justify-end' : 'lg:justify-start'}`}>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#6366f1]" />
                <span>{experience.period}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#6366f1]" />
                <span>{experience.location}</span>
              </div>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              {experience.description}
            </p>

            {experience.responsibilities && experience.responsibilities.length > 0 && (
              <div className="mt-4">
                <h4 className={`text-white font-medium mb-3 text-lg ${isEven ? 'lg:text-right' : 'lg:text-left'}`}>Key Responsibilities:</h4>
                <ul className={`space-y-2 ${isEven ? 'lg:text-right' : 'lg:text-left'}`}>
                  {experience.responsibilities.map((item, i) => (
                    <li key={i} className={`flex items-start gap-3 text-gray-300 ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Timeline dot - centered */}
        <div className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 top-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] flex items-center justify-center shadow-lg shadow-purple-500/30 z-10">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Empty space for alternating layout */}
        <div className="flex-1 hidden lg:block" />
      </div>
    </div>
  );
};

const Experience = () => {
  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  return (
    <section className="py-20 px-[5%] sm:px-[5%] lg:px-[10%] bg-[#030014]" id="Experience">
      <div className="text-center mb-16">
        <h2
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
          data-aos="zoom-in-up"
          data-aos-duration="600"
        >
          Experience
        </h2>
        <p
          className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg sm:text-xl lg:text-2xl"
          data-aos="zoom-in-up"
          data-aos-duration="800"
        >
          My professional journey and work experience
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-16 relative">
        {/* Mobile icon */}
        <div className="lg:hidden flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
        </div>

        {experienceData.map((experience, index) => (
          <ExperienceCard key={index} experience={experience} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Experience;
