"use client";

import { motion } from "framer-motion";

export default function Testimonials() {
  const testimonials = [
    {
      name: "John Doe",
      role: "Project Manager",
      company: "Tech Company",
      text: "Maria is an exceptional developer who consistently delivers high-quality work. Her attention to detail and problem-solving skills are outstanding.",
    },
    {
      name: "Jane Smith",
      role: "Team Lead",
      company: "Software Inc",
      text: "Working with Maria was a pleasure. She is highly skilled, communicative, and always goes above and beyond to meet project requirements.",
    },
    {
      name: "Alex Johnson",
      role: "Senior Developer",
      company: "Dev Studio",
      text: "Maria's technical abilities and dedication to learning make her a valuable team member. I highly recommend her for any development project.",
    },
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-[#0f0520]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full lg:ml-24">
        {/* Section Header */}
        <motion.div 
          className="flex items-end mb-12"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Number 6 - SVG with text-based approach */}
          <svg 
            width="75.64" 
            height="92.8" 
            viewBox="0 0 75.64 92.8" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="-mr-2"
          >
            <g filter="url(#filter0_d_6_testimonials)">
              <text 
                x="3" 
                y="82" 
                fill="#5227FF" 
                stroke="#B19EEF" 
                strokeWidth="1" 
                fontFamily="Radio Canada, system-ui, sans-serif" 
                fontSize="80" 
                fontWeight="bold"
              >
                6
              </text>
            </g>
            <defs>
              <filter id="filter0_d_6_testimonials" x="0" y="0" width="75.64" height="92.8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dx="1" dy="2"/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.322 0 0 0 0 0.153 0 0 0 0 1 0 0 0 1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6_testimonials"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6_testimonials" result="shape"/>
              </filter>
            </defs>
          </svg>
          {/* Title text with line */}
          <div className="flex items-start mb-1 -mt-4">
            <h2 className="font-sans font-semibold text-[32px] leading-none tracking-[-0.02em] text-[#F9F9F9] whitespace-nowrap ml-2">
              Testimonials
            </h2>
            {/* Line */}
            <div className="w-[380px] h-[1px] bg-[#5227FF]/50 hidden lg:block ml-3 mt-[16px]" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-[90px]">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              className="bg-[#1a0a2e] border-l-4 border-[#5227FF] p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-[#B19EEF] font-sans text-sm mb-4 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div>
                <h4 className="text-[#F9F9F9] font-sans font-semibold text-base">
                  {testimonial.name}
                </h4>
                <p className="text-[#FF9FFC] font-sans text-sm">
                  {testimonial.role} at {testimonial.company}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
