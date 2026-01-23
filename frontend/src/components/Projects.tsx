'use client';

const featuredProjects = [
  {
    id: 1,
    title: 'Digikala Clone',
    description: 'A full-featured e-commerce platform clone with product listings, cart functionality, user authentication, and payment integration. Built with modern web technologies for optimal performance.',
    technologies: ['React', 'Material UI', 'React Query'],
    github: 'https://github.com',
    live: 'https://example.com',
    image: '/projects/digikala.png',
    align: 'right',
  },
  {
    id: 2,
    title: 'Portfolio',
    description: 'A personal portfolio website showcasing projects, skills, and experience. Features smooth animations, responsive design, and dark mode support.',
    technologies: ['TypeScript', 'Next.js', 'Tailwind CSS'],
    github: 'https://github.com',
    live: 'https://example.com',
    image: '/projects/portfolio.png',
    align: 'left',
  },
  {
    id: 3,
    title: 'Aparat Clone',
    description: 'A video sharing platform clone with video upload, streaming, comments, and user interactions. Implements lazy loading and optimized video delivery.',
    technologies: ['React', 'Material UI', 'React Query'],
    github: 'https://github.com',
    live: 'https://example.com',
    image: '/projects/aparat.png',
    align: 'right',
  },
];

const otherProjects = [
  {
    id: 1,
    title: 'Netflix Clone',
    description: 'A streaming platform UI clone with responsive design and smooth animations.',
    technologies: ['React', 'Firebase', 'TMDB API'],
    github: 'https://github.com',
    live: 'https://example.com',
  },
  {
    id: 2,
    title: 'Weather App',
    description: 'Real-time weather application with location-based forecasts and beautiful UI.',
    technologies: ['Vue.js', 'OpenWeather API', 'CSS'],
    github: 'https://github.com',
    live: 'https://example.com',
  },
  {
    id: 3,
    title: 'Task Manager',
    description: 'A productivity app for managing tasks with drag-and-drop functionality.',
    technologies: ['React', 'Redux', 'Node.js'],
    github: 'https://github.com',
    live: 'https://example.com',
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-12">
          <span className="section-number">3</span>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-[#e6f1ff] mb-2">
              Some things I&apos;ve built
            </h2>
            <div className="accent-line w-full max-w-xs"></div>
          </div>
        </div>

        {/* Featured Projects */}
        <div className="space-y-24">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className={`relative grid lg:grid-cols-12 gap-4 items-center ${
                project.align === 'left' ? 'lg:text-left' : 'lg:text-right'
              }`}
            >
              {/* Project Image */}
              <div
                className={`lg:col-span-7 ${
                  project.align === 'left' ? 'lg:order-2 lg:col-start-6' : 'lg:order-1'
                }`}
              >
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative group"
                >
                  <div className="absolute inset-0 bg-[#64ffda]/20 group-hover:bg-transparent transition-all duration-300 rounded-lg z-10"></div>
                  <div className="relative aspect-video bg-[#112240] rounded-lg overflow-hidden">
                    {/* Placeholder for project image */}
                    <div className="w-full h-full bg-gradient-to-br from-[#112240] to-[#1d3a5f] flex items-center justify-center">
                      <span className="text-[#64ffda]/30 text-6xl font-bold">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  </div>
                </a>
              </div>

              {/* Project Content */}
              <div
                className={`lg:col-span-6 ${
                  project.align === 'left'
                    ? 'lg:order-1 lg:col-start-1'
                    : 'lg:order-2 lg:col-start-7'
                } relative z-20`}
              >
                <p className="text-[#64ffda] font-mono text-sm mb-2">Featured Project</p>
                <h3 className="text-2xl font-bold text-[#e6f1ff] mb-4">
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#64ffda] transition-colors"
                  >
                    {project.title}
                  </a>
                </h3>
                <div className="bg-[#112240] p-6 rounded-lg shadow-xl mb-4">
                  <p className="text-[#8892b0]">{project.description}</p>
                </div>
                <ul
                  className={`flex flex-wrap gap-4 mb-4 font-mono text-sm text-[#8892b0] ${
                    project.align === 'left' ? 'lg:justify-start' : 'lg:justify-end'
                  }`}
                >
                  {project.technologies.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
                <div
                  className={`flex gap-4 ${
                    project.align === 'left' ? 'lg:justify-start' : 'lg:justify-end'
                  }`}
                >
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#e6f1ff] hover:text-[#64ffda] transition-colors"
                    aria-label="GitHub"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#e6f1ff] hover:text-[#64ffda] transition-colors"
                    aria-label="External Link"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Other Noteworthy Projects */}
        <div className="mt-32">
          <h3 className="text-2xl font-bold text-[#e6f1ff] text-center mb-12">
            Other Noteworthy Projects
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project) => (
              <div
                key={project.id}
                className="bg-[#112240] rounded-lg p-6 card-hover group"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <svg
                    className="text-[#64ffda]"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  <div className="flex gap-4">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8892b0] hover:text-[#64ffda] transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8892b0] hover:text-[#64ffda] transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Content */}
                <h4 className="text-xl font-bold text-[#e6f1ff] mb-2 group-hover:text-[#64ffda] transition-colors">
                  {project.title}
                </h4>
                <p className="text-[#8892b0] text-sm mb-6">{project.description}</p>

                {/* Technologies */}
                <ul className="flex flex-wrap gap-3 font-mono text-xs text-[#8892b0]">
                  {project.technologies.map((tech) => (
                    <li key={tech}>{tech}</li>
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
