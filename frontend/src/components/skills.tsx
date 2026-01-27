"use client";

import React from "react"

import { motion } from "framer-motion";
import { 
  Users, 
  MessageCircle, 
  GitBranch, 
  Wrench, 
  RefreshCw, 
  Clock,
  Coffee,
  Code,
  Database,
  FileCode,
  Globe,
  Hash,
  Layers,
  Server,
  Box,
  Github,
  Settings,
  Cpu,
  Network,
  Shield,
  FileText,
  CheckSquare,
  GitPullRequest
} from "lucide-react";

// Glass Icon Component
function GlassIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      {/* Glass Icon */}
      <div className="relative mb-4">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#5227FF] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-[#5227FF]/30 transform rotate-3 hover:rotate-0 transition-transform">
          <div className="text-white">
            {icon}
          </div>
        </div>
        {/* Shadow/depth effect */}
        <div className="absolute -bottom-2 -right-2 w-24 h-24 rounded-2xl bg-[#5227FF]/30 -z-10 transform rotate-6" />
      </div>
      <span className="text-[#B19EEF] font-sans text-sm text-center max-w-[120px]">{label}</span>
    </motion.div>
  );
}

export default function Skills() {
  // Soft Skills (removed Leadership)
  const softSkills = [
    { icon: <Users className="w-7 h-7" />, label: "Teaching/Mentoring" },
    { icon: <MessageCircle className="w-7 h-7" />, label: "Communication" },
    { icon: <GitBranch className="w-7 h-7" />, label: "Collaboration" },
    { icon: <Wrench className="w-7 h-7" />, label: "Problem-solving" },
    { icon: <RefreshCw className="w-7 h-7" />, label: "Adaptability" },
    { icon: <Clock className="w-7 h-7" />, label: "Patience" },
  ];

  // Programming Languages with logos
  const languages = [
    { name: "Java", icon: <Coffee className="w-8 h-8" /> },
    { name: "JavaScript/TypeScript", icon: <FileCode className="w-8 h-8" /> },
    { name: "Python", icon: <Code className="w-8 h-8" /> },
    { name: "SQL", icon: <Database className="w-8 h-8" /> },
    { name: "HTML/CSS", icon: <Globe className="w-8 h-8" /> },
    { name: "C#", icon: <Hash className="w-8 h-8" /> },
  ];

  // Frontend with logos
  const frontend = [
    { name: "React", icon: <Layers className="w-8 h-8" /> },
    { name: "Next.js", icon: <Server className="w-8 h-8" /> },
    { name: "Tailwind CSS", icon: <Code className="w-8 h-8" /> },
  ];

  // Databases with logos
  const databases = [
    { name: "PostgreSQL", icon: <Database className="w-8 h-8" /> },
    { name: "MySQL", icon: <Database className="w-8 h-8" /> },
    { name: "SQL Server", icon: <Database className="w-8 h-8" /> },
  ];

  // Tools
  const tools = [
    { icon: <Box className="w-7 h-7" />, label: "Docker" },
    { icon: <Github className="w-7 h-7" />, label: "Git/GitHub" },
    { icon: <Network className="w-7 h-7" />, label: "REST APIs" },
    { icon: <Cpu className="w-7 h-7" />, label: "Microservices" },
    { icon: <Shield className="w-7 h-7" />, label: "Better Auth" },
  ];

  // Other Technical
  const otherTechnical = [
    { icon: <Settings className="w-7 h-7" />, label: "OOP" },
    { icon: <Layers className="w-7 h-7" />, label: "MVC Architecture" },
    { icon: <CheckSquare className="w-7 h-7" />, label: "Agile/Scrum" },
    { icon: <GitPullRequest className="w-7 h-7" />, label: "Code Reviews" },
  ];

  return (
    <section id="skills" className="py-20 lg:py-32 bg-transparent relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full lg:ml-24">
        {/* Section Header */}
        <motion.div 
          className="flex items-end mb-12"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Number 7 - SVG with text-based approach */}
          <svg 
            width="75.64" 
            height="92.8" 
            viewBox="0 0 75.64 92.8" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="-mr-2"
          >
            <g filter="url(#filter0_d_7_skills)">
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
                7
              </text>
            </g>
            <defs>
              <filter id="filter0_d_7_skills" x="0" y="0" width="75.64" height="92.8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dx="1" dy="2"/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.322 0 0 0 0 0.153 0 0 0 0 1 0 0 0 1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_7_skills"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_7_skills" result="shape"/>
              </filter>
            </defs>
          </svg>
          {/* Title text with line */}
          <div className="flex items-start mb-1 -mt-4">
            <h2 className="font-sans font-semibold text-[32px] leading-none tracking-[-0.02em] text-[#F9F9F9] whitespace-nowrap ml-2">
              Skills
            </h2>
            {/* Line */}
            <div className="w-[450px] h-[1px] bg-[#5227FF]/50 hidden lg:block ml-3 mt-[16px]" />
          </div>
        </motion.div>

        <div className="ml-[90px] space-y-20">
          {/* Soft Skills Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <h3 className="text-[#FF9FFC] font-sans font-semibold text-2xl mb-12">Soft Skills</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-20 gap-y-16">
              {softSkills.map((skill, index) => (
                <GlassIcon key={index} icon={skill.icon} label={skill.label} />
              ))}
            </div>
          </motion.div>

          {/* Programming Languages Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <h3 className="text-[#FF9FFC] font-sans font-semibold text-2xl mb-12">Programming Languages</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-12 gap-y-12">
              {languages.map((lang, index) => (
                <motion.div
                  key={index}
                  className="bg-[#1a0a2e]/80 border border-[#5227FF]/30 rounded-xl p-4 flex flex-col items-center gap-3 hover:border-[#FF9FFC] transition-colors backdrop-blur-sm"
                  whileHover={{ y: -5 }}
                >
                  <div className="text-[#B19EEF]">{lang.icon}</div>
                  <span className="text-[#E2DDDD] font-sans text-sm text-center">{lang.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Frontend Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <h3 className="text-[#FF9FFC] font-sans font-semibold text-2xl mb-12">Frontend</h3>
            <div className="grid grid-cols-3 gap-8">
              {frontend.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-[#1a0a2e]/80 border border-[#5227FF]/30 rounded-xl p-6 flex flex-col items-center gap-4 hover:border-[#FF9FFC] transition-colors backdrop-blur-sm"
                  whileHover={{ y: -5 }}
                >
                  <div className="text-[#B19EEF]">{item.icon}</div>
                  <span className="text-[#E2DDDD] font-sans text-base">{item.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Databases Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <h3 className="text-[#FF9FFC] font-sans font-semibold text-2xl mb-12">Databases</h3>
            <div className="grid grid-cols-3 gap-8">
              {databases.map((db, index) => (
                <motion.div
                  key={index}
                  className="bg-[#1a0a2e]/80 border border-[#5227FF]/30 rounded-xl p-6 flex flex-col items-center gap-4 hover:border-[#FF9FFC] transition-colors backdrop-blur-sm"
                  whileHover={{ y: -5 }}
                >
                  <div className="text-[#B19EEF]">{db.icon}</div>
                  <span className="text-[#E2DDDD] font-sans text-base">{db.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tools Section - Glass Icons Style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <h3 className="text-[#FF9FFC] font-sans font-semibold text-2xl mb-12">Tools</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-16 gap-y-12">
              {tools.map((tool, index) => (
                <GlassIcon key={index} icon={tool.icon} label={tool.label} />
              ))}
            </div>
          </motion.div>

          {/* Other Technical Section - Glass Icons Style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <h3 className="text-[#FF9FFC] font-sans font-semibold text-2xl mb-12">Other Technical</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-16 gap-y-12">
              {otherTechnical.map((item, index) => (
                <GlassIcon key={index} icon={item.icon} label={item.label} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
