'use client';

import { useState } from 'react';

const experiences = [
  {
    id: 1,
    company: 'Miras Company',
    role: 'Front-end developer',
    period: '2024.01 - 2025.03',
    responsibilities: [
      'Developed and maintained responsive, user-friendly web applications using HTML, CSS, JavaScript, and modern frameworks like React and Vue.js.',
      'Collaborated closely with UI/UX designers to transform wireframes and mockups into functional, visually appealing interfaces.',
      'Integrated RESTful APIs and backend services to ensure seamless data flow and dynamic content rendering.',
      'Optimized web performance for faster load times and improved user experience across multiple devices and browsers.',
      'Conducted cross-browser testing and debugging to ensure compatibility and resolve issues.',
      'Worked in an Agile environment, participating in sprint planning, code reviews, and daily stand-ups to deliver high-quality features on time.',
    ],
  },
];

export default function Experience() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="experience" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-12">
          <span className="section-number">2</span>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-[#e6f1ff] mb-2">
              Where I&apos;ve worked
            </h2>
            <div className="accent-line w-full max-w-xs"></div>
          </div>
        </div>

        {/* Experience Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Tabs */}
          <div className="flex md:flex-col overflow-x-auto md:overflow-visible border-b md:border-b-0 md:border-l border-[#233554]">
            {experiences.map((exp, index) => (
              <button
                key={exp.id}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-3 text-sm font-mono whitespace-nowrap transition-all text-left
                  ${activeTab === index
                    ? 'text-[#64ffda] bg-[#112240] border-b-2 md:border-b-0 md:border-l-2 border-[#64ffda] -mb-[2px] md:mb-0 md:-ml-[2px]'
                    : 'text-[#8892b0] hover:text-[#64ffda] hover:bg-[#112240]/50'
                  }`}
              >
                {exp.role}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 min-h-[400px]">
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className={`${activeTab === index ? 'block' : 'hidden'}`}
              >
                <h3 className="text-xl font-medium text-[#e6f1ff]">
                  {exp.role}{' '}
                  <span className="text-[#64ffda]">@ {exp.company}</span>
                </h3>
                <p className="text-[#8892b0] font-mono text-sm mt-1 mb-6">
                  {exp.period}
                </p>
                <ul className="space-y-4">
                  {exp.responsibilities.map((item, i) => (
                    <li key={i} className="flex gap-4 text-[#8892b0]">
                      <span className="text-[#64ffda] mt-1.5">▹</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
