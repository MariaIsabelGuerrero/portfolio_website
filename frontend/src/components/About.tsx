"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { personalInfo } from "@/config/portfolio";
import { sectionTitles } from "@/lib/constants";

export default function About() {
  return (
    <section id="about" className="py-20 lg:py-32 bg-background overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full lg:ml-24">
        <div className="relative">
          {/* Left Content */}
          <div>
            {/* Section Header */}
            <motion.div 
              className="flex items-end mb-12"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Number 1 - SVG with rounded corners and drop shadow */}
              <svg 
                width="64" 
                height="93" 
                viewBox="0 0 64 93" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="-mr-2"
              >
                <g filter="url(#filter0_d_2_61)">
                  <path d="M6.3607 85.8C5.25613 85.8 4.3607 84.9046 4.3607 83.8V74.96C4.3607 73.8554 5.25613 72.96 6.3607 72.96H21.0807C22.1853 72.96 23.0807 72.0646 23.0807 70.96V23.0534C23.0807 21.6227 21.6223 20.6547 20.3039 21.2104L10.4226 25.3752C9.39738 25.8074 8.2166 25.3198 7.79497 24.2902L4.14994 15.3896C3.73475 14.3757 4.2125 13.2165 5.22148 12.7897L27.9871 3.15807C28.2336 3.05375 28.4986 3 28.7664 3H37.7607C38.8653 3 39.7607 3.89543 39.7607 5V70.96C39.7607 72.0646 40.6561 72.96 41.7607 72.96H55.5207C56.6253 72.96 57.5207 73.8554 57.5207 74.96V83.8C57.5207 84.9046 56.6253 85.8 55.5207 85.8H6.3607Z" fill="#5227FF"/>
                  <path d="M37.761 2.5C39.1416 2.50019 40.261 3.61941 40.261 5V70.96C40.261 71.7884 40.9326 72.46 41.761 72.46H55.5208C56.9015 72.46 58.0208 73.5793 58.0208 74.96V83.7998C58.0208 85.1805 56.9015 86.2997 55.5208 86.2998H6.36066C4.97996 86.2998 3.86066 85.1805 3.86066 83.7998V74.96C3.86068 73.5793 4.97998 72.46 6.36066 72.46H21.0804C21.9088 72.46 22.5804 71.7884 22.5804 70.96V23.0537C22.5804 21.9808 21.487 21.2544 20.4984 21.6709L10.6165 25.8359C9.33506 26.3759 7.85934 25.7664 7.33234 24.4795L3.68683 15.5791C3.16791 14.3118 3.76549 12.8627 5.02667 12.3291L27.7923 2.69727C28.1003 2.56697 28.4315 2.50006 28.7659 2.5H37.761Z" stroke="#B19EEF"/>
                </g>
                <defs>
                  <filter id="filter0_d_2_61" x="0" y="0" width="63.5207" height="92.8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dx="1" dy="2"/>
                    <feGaussianBlur stdDeviation="2"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0.282353 0 0 0 0 0.462745 0 0 0 0 0.807843 0 0 0 1 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_61"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_61" result="shape"/>
                  </filter>
                </defs>
              </svg>
              {/* About me text with line */}
              <div className="flex items-start mb-1">
                <h2 className="font-sans font-semibold text-[32px] leading-none tracking-[-0.02em] text-foreground whitespace-nowrap ml-2">
                  {sectionTitles.about}
                </h2>
                {/* Line - aligned to top of About me text */}
                <div className="w-[417px] h-px bg-primary/50 hidden lg:block ml-3 mt-[16px]" />
              </div>
            </motion.div>

            {/* Bio Text with left border - aligned under "About me" text, width matches About me + line */}
            <motion.div
              className="max-w-[620px] border-l-2 border-primary/50 pl-6 ml-[70px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <p className="font-sans font-normal text-[16px] leading-[140%] tracking-[-0.02em] text-muted-foreground">
                {personalInfo.bio}
              </p>
            </motion.div>
          </div>

          {/* Right Content - Image */}
          <motion.div 
            className="absolute right-[-50px] top-[-30px] hidden lg:block pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Image
              src="/images/funny-coding-r1ubgelhk4ffxyrt-202.png"
              alt="3D Figure holding code screen"
              width={350}
              height={348}
              className="object-contain"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
