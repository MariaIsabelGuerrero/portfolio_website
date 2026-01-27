"use client";

import Image from "next/image";
import { Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const featuredProjects = [
  {
    title: "Passion Sports Jerseys",
    description:
      "E-commerce platform for sports jerseys built with Spring Boot microservices. Led backend development featuring secure payments, inventory management, and responsive storefront.",
    technologies: ["Spring Boot", "Microservices", "Java", "PostgreSQL"],
    github: "#",
    live: "#",
    image: "/images/robot-developer.jpg",
    featured: true,
  },
  {
    title: "Pet Clinic Microservices",
    description:
      "Veterinary clinic management system built collaboratively using Spring Boot and React. Implemented services for appointments, billing, inventory, and customer management.",
    technologies: ["Spring Boot", "React", "Microservices", "MySQL"],
    github: "#",
    live: "#",
    image: "/images/robot-developer.jpg",
    featured: true,
  },
];

const otherProjects = [
  {
    title: "Task Manager App",
    description: "Full-stack task management application with user authentication and real-time updates.",
    technologies: ["Next.js", "TypeScript", "Prisma"],
  },
  {
    title: "Weather Dashboard",
    description: "Interactive weather dashboard with location-based forecasts and data visualization.",
    technologies: ["React", "Chart.js", "API Integration"],
  },
  {
    title: "Chat Application",
    description: "Real-time messaging application with WebSocket support and user presence indicators.",
    technologies: ["Node.js", "Socket.io", "MongoDB"],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 lg:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full lg:ml-24">
        {/* Section Header */}
        <motion.div 
          className="flex items-end mb-12"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Number 4 - SVG with rounded corners and drop shadow */}
          <svg 
            width="76" 
            height="93" 
            viewBox="0 0 76 93" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="-mr-2"
          >
            <g filter="url(#filter0_d_4_projects)">
              <path d="M4 60.4165C4 60.065 4.0926 59.7198 4.26848 59.4156L36.3025 3.99908C36.6599 3.38079 37.3198 3 38.034 3H56.6C57.7046 3 58.6 3.89543 58.6 5V54.28C58.6 55.3846 59.4954 56.28 60.6 56.28H67.64C68.7446 56.28 69.64 57.1754 69.64 58.28V68.92C69.64 70.0246 68.7446 70.92 67.64 70.92H60.6C59.4954 70.92 58.6 71.8154 58.6 72.92V83.8C58.6 84.9046 57.7046 85.8 56.6 85.8H43.92C42.8154 85.8 41.92 84.9046 41.92 83.8V72.92C41.92 71.8154 41.0246 70.92 39.92 70.92H6C4.89543 70.92 4 70.0246 4 68.92V60.4165ZM18.7869 59.7855C18.0245 61.1141 16.1126 61.1275 15.3317 59.8097L15.0294 59.2996C14.2393 57.9664 15.2003 56.28 16.75 56.28H39.92C41.0246 56.28 41.92 55.3846 41.92 54.28V14.0595C41.92 13.0928 42.8518 12.3995 43.7777 12.6773C44.6681 12.9444 45.0773 13.9714 44.6146 14.7777L18.7869 59.7855Z" fill="#5227FF"/>
              <path d="M56.5996 2.5C57.9803 2.5 59.0996 3.61929 59.0996 5V54.2803C59.0998 55.1084 59.7715 55.7801 60.5996 55.7803H67.6396C69.0204 55.7803 70.1396 56.8996 70.1396 58.2803V68.9199C70.1396 70.3006 69.0204 71.4199 67.6396 71.4199H60.5996C59.7714 71.4201 59.0997 72.0917 59.0996 72.9199V83.7998C59.0996 85.1805 57.9803 86.2998 56.5996 86.2998H43.9199C42.5392 86.2998 41.4199 85.1805 41.4199 83.7998V72.9199C41.4199 72.0915 40.7483 71.4199 39.9199 71.4199H6C4.61929 71.4199 3.5 70.3006 3.5 68.9199V60.416C3.50008 59.9769 3.61617 59.5452 3.83594 59.165L35.8691 3.74902C36.3159 2.97617 37.1415 2.5 38.0342 2.5H56.5996ZM21.6621 55.7803H39.9199C40.7483 55.7803 41.4198 55.1086 41.4199 54.2803V21.3477L21.6621 55.7803Z" stroke="#B19EEF"/>
            </g>
            <defs>
              <filter id="filter0_d_4_projects" x="0" y="0" width="75.64" height="92.8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dx="1" dy="2"/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.282353 0 0 0 0 0.462745 0 0 0 0 0.807843 0 0 0 1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4_projects"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4_projects" result="shape"/>
              </filter>
            </defs>
          </svg>
          {/* Title text with line */}
          <div className="flex items-start mb-1 -mt-4">
            <h2 className="font-sans font-semibold text-[32px] leading-none tracking-[-0.02em] text-[#F9F9F9] whitespace-nowrap ml-2">
              Some things I&apos;ve build
            </h2>
            {/* Line */}
            <div className="w-[300px] h-[1px] bg-[#5227FF]/50 hidden lg:block ml-3 mt-[16px]" />
          </div>
        </motion.div>

        {/* Featured Projects */}
        <div className="space-y-24">
          {featuredProjects.map((project, index) => (
            <motion.div 
              key={index} 
              className="relative"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <p className="text-accent text-sm mb-2">Featured project</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">{project.title}</h3>

              <div
                className={`grid lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-dense" : ""
                }`}
              >
                {/* Project Image */}
                {project.image && (
                  <div className={`${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-card border border-border">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover opacity-80 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </div>
                )}

                {/* Project Info */}
                <div className={`space-y-4 ${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                  <div className="bg-card p-6 rounded-lg border border-border">
                    <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="text-muted-foreground text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-foreground hover:border-accent hover:text-accent bg-transparent"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-foreground hover:border-accent hover:text-accent bg-transparent"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Link
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Other Noteworthy Projects */}
        <div className="mt-32">
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-12">
            Other Noteworthy Projects
          </h3>

<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project, index) => (
              <motion.div
                key={index}
                className="bg-card p-6 rounded-lg border border-border hover:border-accent transition-colors group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center">
                      <span className="text-accent text-xs">{"</>"}</span>
                    </div>
                    <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center">
                      <span className="text-accent text-xs">M</span>
                    </div>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {project.title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="text-muted-foreground text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
