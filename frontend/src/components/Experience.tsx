"use client";

import { motion } from "framer-motion";

const experiences = [
  {
    title: "Gymnastics Coach",
    company: "Club Gym Richelieu",
    period: "2022.03 - Present",
    responsibilities: [
      "Coach artistic gymnastics for children ages 7+ in recreational and advanced programs",
      "Develop age-appropriate training programs focusing on technique, safety, and skill progression",
      "Demonstrate strong communication skills while instructing in both French and English",
      "Maintain detailed progress evaluations and ensure safe, engaging learning environments",
    ],
  },
  {
    title: "Programming Tutor",
    company: "Champlain College",
    period: "2025.09 - 2025.11",
    responsibilities: [
      "Provide personalized Java programming instruction to first-year CEGEP students through tutoring sessions",
      "Develop customized learning approaches to accommodate diverse learning styles and skill levels",
      "Assist students with debugging techniques, algorithm development, and best coding practices",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-20 lg:py-32 bg-card">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full lg:ml-24">
        {/* Section Header */}
        <motion.div 
          className="flex items-end mb-12"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Number 2 - SVG with rounded corners and drop shadow */}
          <svg 
            width="81" 
            height="107" 
            viewBox="0 0 81 107" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="-mr-2"
          >
            <g filter="url(#filter0_d_2_91)">
              <path d="M10.4371 23.401C9.78602 22.5871 9.86674 21.4067 10.6473 20.7159C12.9615 18.6677 15.3872 16.8424 17.9243 15.24C21.0443 13.24 24.3643 11.72 27.8843 10.68C31.4843 9.56 35.2843 9 39.2843 9C44.5643 9 49.3243 10.08 53.5643 12.24C57.8843 14.4 61.2843 17.4 63.7643 21.24C66.2443 25 67.4843 29.32 67.4843 34.2C67.4843 37.56 66.8443 40.88 65.5643 44.16C64.3643 47.36 62.4043 50.68 59.6843 54.12C56.9643 57.48 53.3243 61.24 48.7643 65.4L38.3199 74.879C36.9656 76.1081 37.8351 78.36 39.664 78.36H66.6843C67.7889 78.36 68.6843 79.2554 68.6843 80.36V91.12C68.6843 92.2246 67.7889 93.12 66.6843 93.12H12.6043C11.4998 93.12 10.6043 92.2246 10.6043 91.12V82.9161C10.6043 82.3811 10.8186 81.8685 11.1994 81.4927L38.4443 54.6C41.3243 51.64 43.6043 49.12 45.2843 47.04C47.0443 44.88 48.3243 42.92 49.1243 41.16C49.9243 39.32 50.3243 37.52 50.3243 35.76C50.3243 33.68 49.8443 31.8 48.8843 30.12C47.9243 28.36 46.5243 27 44.6843 26.04C42.8443 25 40.5243 24.48 37.7243 24.48C35.3243 24.48 33.0443 24.88 30.8843 25.68C28.7243 26.4 26.6443 27.48 24.6443 28.92C23.2633 29.8982 21.8822 31.042 20.5012 32.3514C19.6243 33.1828 18.2143 33.1225 17.4594 32.1789L10.4371 23.401Z" fill="#5227FF"/>
              <path d="M39.2843 8.5C44.6329 8.5 49.4705 9.59468 53.7873 11.793H53.7882C58.182 13.9899 61.6507 17.0473 64.1818 20.9648L64.4162 21.3271C66.7981 25.0898 67.9845 29.3862 67.9845 34.2002C67.9845 37.6252 67.3319 41.0068 66.0304 44.3418C64.8077 47.5998 62.8181 50.9622 60.0763 54.4297L60.0734 54.4346C57.3325 57.8204 53.6731 61.5992 49.1017 65.7695L49.1007 65.7705L38.6564 75.249C37.6407 76.1709 38.2926 77.8604 39.6642 77.8604H66.6847C68.0653 77.8606 69.1847 78.9798 69.1847 80.3604V91.1201C69.1847 92.5006 68.0652 93.6199 66.6847 93.6201H12.6046C11.224 93.6201 10.1047 92.5008 10.1046 91.1201V82.916C10.1047 82.2474 10.372 81.6064 10.8478 81.1367L38.0929 54.2441C40.964 51.293 43.2304 48.7874 44.8957 46.7256L44.8966 46.7246C46.6403 44.5846 47.8928 42.6611 48.6691 40.9531C49.4434 39.1699 49.8244 37.4398 49.8244 35.7598C49.8243 33.7602 49.3639 31.9669 48.4503 30.3682L48.4455 30.3594C47.5347 28.6897 46.2085 27.3992 44.4533 26.4834L44.4455 26.4795L44.4386 26.4756C42.6943 25.4896 40.4654 24.9805 37.7248 24.9805C35.3815 24.9805 33.1599 25.3699 31.0578 26.1484L31.0421 26.1543C28.9339 26.8571 26.899 27.9133 24.9367 29.3262L24.9337 29.3281C23.5743 30.2911 22.2108 31.4189 20.8449 32.7139C19.7674 33.7354 18.0173 33.6757 17.0695 32.4912L10.047 23.7129C9.23582 22.6987 9.32855 21.2157 10.3156 20.3418C12.6493 18.2763 15.0969 16.4346 17.6574 14.8174C20.8159 12.7931 24.1778 11.2534 27.7423 10.2002C31.3913 9.06572 35.2395 8.5 39.2843 8.5Z" stroke="#B19EEF"/>
            </g>
            <defs>
              <filter id="filter0_d_2_91" x="0" y="0" width="80.6843" height="106.12" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dx="1" dy="2"/>
                <feGaussianBlur stdDeviation="5"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.282353 0 0 0 0 0.462745 0 0 0 0 0.807843 0 0 0 1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_91"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_91" result="shape"/>
              </filter>
            </defs>
          </svg>
          {/* Title text with line */}
          <div className="flex items-start mb-1 -mt-4">
            <h2 className="font-sans font-semibold text-[32px] leading-none tracking-[-0.02em] text-[#F9F9F9] whitespace-nowrap ml-2">
              Where I&apos;ve worked
            </h2>
            {/* Line */}
            <div className="w-[417px] h-[1px] bg-[#5227FF]/50 hidden lg:block ml-3 mt-[16px]" />
          </div>
        </motion.div>

        <div className="space-y-8 ml-[90px]">
          {experiences.map((exp, index) => (
            <motion.div 
              key={index} 
              className="flex gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Left side - Job title badge with only left vertical line (line matches badge height) */}
              <div className="flex h-fit mt-2">
                <div className="w-[4px] bg-[#5227FF]" />
                <div className="bg-[#1a0a2e] px-4 py-3 whitespace-nowrap">
                  <span className="text-[#FF9FFC] font-sans font-medium text-base">
                    {exp.title}
                  </span>
                </div>
              </div>
              
              {/* Right side - Details */}
              <div className="space-y-4 flex-1">
                <div>
                  <h3 className="text-[24px] font-semibold text-[#F9F9F9] font-sans">
                    {exp.title} at{" "}
                    <span className="text-[#B19EEF] underline">{exp.company}</span>
                  </h3>
                  <span className="text-[#B19EEF] text-base font-sans">{exp.period}</span>
                </div>

                {/* Arrow and bullet list */}
                <div className="flex gap-4">
                  {/* Arrow SVG */}
                  <svg 
                    width="32" 
                    height="32" 
                    viewBox="0 0 32 32" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0 mt-1"
                  >
                    <path d="M13.36 24.9067L17.64 20.6267L20.2667 18.0133C21.3733 16.9067 21.3733 15.1067 20.2667 14L13.36 7.09335C12.4533 6.18668 10.9067 6.84001 10.9067 8.10668V15.5867L10.9067 23.8933C10.9067 25.1733 12.4533 25.8133 13.36 24.9067Z" fill="#5227FF"/>
                  </svg>

                  <ul className="space-y-2">
                    {exp.responsibilities.map((item, idx) => (
                      <li key={idx} className="flex gap-2 text-[#B19EEF] text-sm leading-relaxed font-sans">
                        <span className="text-[#B19EEF] flex-shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
