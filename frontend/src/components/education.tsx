"use client";

import { motion } from "framer-motion";

export default function Education() {
  const education = [
    {
      degree: "DEC in Computer Science",
      school: "Champlain College",
      period: "2023.08 - Present",
    },
  ];

  return (
    <section id="education" className="py-20 lg:py-32 bg-[#0f0520]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full lg:ml-24">
        {/* Section Header */}
        <motion.div 
          className="flex items-end mb-12"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Number 3 - SVG with violet colors */}
          <svg 
            width="71" 
            height="95" 
            viewBox="0 0 71 95" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="-mr-2"
          >
            <g filter="url(#filter0_d_3_edu)">
              <path d="M4.63948 76.9411C3.87143 76.263 3.79082 75.1056 4.41983 74.2968L11.1188 65.6839C11.8723 64.715 13.3095 64.6522 14.2153 65.4804C16.3271 67.4115 18.613 68.9447 21.0729 70.08C24.2729 71.52 27.7929 72.24 31.6329 72.24C36.3529 72.24 40.1929 71.24 43.1529 69.24C46.1929 67.16 47.7129 64.2 47.7129 60.36C47.7129 58.04 47.0329 56 45.6729 54.24C44.3929 52.4 42.5129 50.96 40.0329 49.92C37.5529 48.88 34.4329 48.36 30.6729 48.36H22.2329C21.1283 48.36 20.2329 47.4646 20.2329 46.36V39.8013C20.2329 39.287 20.4311 38.7924 20.7862 38.4204L37.1656 21.261C38.3805 19.9882 37.4784 17.88 35.7189 17.88H8.31292C7.20835 17.88 6.31291 16.9846 6.31291 15.88V5C6.31291 3.89543 7.20834 3 8.31291 3H59.5129C60.6175 3 61.5129 3.89543 61.5129 5V13.2212C61.5129 13.7459 61.3067 14.2496 60.9387 14.6237L42.7215 33.1429C41.5436 34.3403 42.2755 36.4057 43.9198 36.7484C47.061 37.4032 49.9254 38.4337 52.5129 39.84C56.2729 41.84 59.1929 44.56 61.2729 48C63.3529 51.44 64.3929 55.56 64.3929 60.36C64.3929 66.2 62.9529 71.12 60.0729 75.12C57.1929 79.12 53.3929 82.12 48.6729 84.12C43.9529 86.12 38.7929 87.12 33.1929 87.12C27.0329 87.12 21.4729 86.16 16.5129 84.24C12.176 82.5337 8.21818 80.1007 4.63948 76.9411Z" fill="#5227FF"/>
              <path d="M59.5131 2.5C60.8937 2.50011 62.0131 3.61935 62.0131 5V13.2207C62.0131 13.8766 61.7553 14.507 61.2953 14.9746L43.0776 33.4932C42.2101 34.375 42.7182 35.987 44.0219 36.2588C47.205 36.9223 50.1145 37.9681 52.7475 39.3984C56.5822 41.4382 59.5711 44.2194 61.7006 47.7412C63.8362 51.2732 64.893 55.487 64.893 60.3604C64.8929 66.2851 63.4308 71.3123 60.4789 75.4121C57.5432 79.4895 53.6684 82.5459 48.8676 84.5801C44.0805 86.6085 38.8535 87.6201 33.1928 87.6201C26.9807 87.6201 21.3583 86.6516 16.3324 84.7061L16.3295 84.7051C11.9374 82.977 7.93005 80.5133 4.30901 77.3164C3.33332 76.455 3.24219 74.9969 4.02483 73.9902L10.724 65.377C11.6722 64.1579 13.451 64.1035 14.5531 65.1113C16.6291 67.0095 18.8721 68.5134 21.2826 69.626C24.4111 71.033 27.859 71.7402 31.6332 71.7402C36.2836 71.7402 40.0163 70.7548 42.8705 68.8271C45.7674 66.845 47.2132 64.0435 47.2133 60.3604C47.2133 58.146 46.5669 56.2143 45.2778 54.5459L45.2699 54.5361L45.2621 54.5254C44.0463 52.7778 42.2493 51.3915 39.8393 50.3809C37.4398 49.3747 34.3911 48.8604 30.6733 48.8604H22.2328C20.8523 48.8603 19.733 47.7409 19.7328 46.3604V39.8018C19.7328 39.1589 19.9804 38.5402 20.4242 38.0752L36.8041 20.916C37.7152 19.9615 37.0386 18.3801 35.7192 18.3799H8.31291C6.9322 18.3799 5.81291 17.2606 5.81291 15.8799V5C5.81291 3.61929 6.9322 2.5 8.31291 2.5H59.5131Z" stroke="#B19EEF"/>
            </g>
            <defs>
              <filter id="filter0_d_3_edu" x="0" y="0" width="70.3929" height="94.12" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dx="1" dy="2"/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.322 0 0 0 0 0.153 0 0 0 0 1 0 0 0 1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3_edu"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3_edu" result="shape"/>
              </filter>
            </defs>
          </svg>
          {/* Title text with line */}
          <div className="flex items-start mb-1 -mt-4">
            <h2 className="font-sans font-semibold text-[32px] leading-none tracking-[-0.02em] text-[#F9F9F9] whitespace-nowrap ml-2">
              Education
            </h2>
            {/* Line */}
            <div className="w-[417px] h-[1px] bg-[#5227FF]/50 hidden lg:block ml-3 mt-[16px]" />
          </div>
        </motion.div>

        <div className="space-y-8 ml-[90px]">
          {education.map((edu, index) => (
            <motion.div 
              key={index} 
              className="flex gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Left side - Degree badge with only left vertical line */}
              <div className="flex h-fit mt-2">
                <div className="w-[4px] bg-[#5227FF]" />
                <div className="bg-[#1a0a2e] px-4 py-3 whitespace-nowrap">
                  <span className="text-[#FF9FFC] font-sans font-medium text-base">
                    {edu.degree}
                  </span>
                </div>
              </div>
              
              {/* Right side - Details */}
              <div className="space-y-4 flex-1">
                <div>
                  <h3 className="text-[24px] font-semibold text-[#F9F9F9] font-sans">
                    {edu.degree} at{" "}
                    <span className="text-[#B19EEF] underline">{edu.school}</span>
                  </h3>
                  <span className="text-[#B19EEF] text-base font-sans">{edu.period}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
