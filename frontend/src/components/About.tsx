'use client';

const technologies = [
  'JavaScript',
  'React',
  'HTML/CSS',
  'Vue.js',
  'Angular',
  'TypeScript',
];

export default function About() {
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div>
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
              <span className="section-number">1</span>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-[#e6f1ff] mb-2">
                  About me
                </h2>
                <div className="accent-line w-full max-w-xs"></div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 text-[#8892b0]">
              <p>
                Hi, I&apos;m Dianne, a Frontend Developer with over 2 years of experience.
                I specialize in creating clean, responsive, and user-friendly web interfaces
                using HTML, CSS, JavaScript, and modern frameworks like React.
              </p>
              <p>
                I enjoy turning design ideas into functional, interactive experiences and
                have a strong passion for learning and staying updated with the latest
                frontend technologies. Let&apos;s build something amazing together!
              </p>
              <p>Here are a few technologies I&apos;ve been working with recently:</p>
            </div>

            {/* Technologies Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
              {technologies.map((tech) => (
                <div key={tech} className="tech-tag">
                  {tech}
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-[#64ffda]/20 rounded-lg transform translate-x-4 translate-y-4"></div>
              <div className="relative w-64 h-64 md:w-80 md:h-80 bg-[#112240] rounded-lg overflow-hidden border-2 border-[#64ffda]/30">
                {/* Placeholder for about image */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-[#112240] to-[#1d3a5f]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
