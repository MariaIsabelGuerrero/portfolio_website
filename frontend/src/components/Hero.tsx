'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-20 relative overflow-hidden bg-[#0C1B31]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[55%_45%] gap-8 items-center">
          <div className="space-y-5 lg:-ml-[450px]">
            {/* Hi, My name is */}
            <p className="text-intro">
              Hi, My name is
            </p>

            {/* Name  */}
            <h1 className="heading-primary">
              Maria Isabel Guerrero
            </h1>

            {/* Tagline  */}
            <h2 className="heading-secondary">
              I build systems that scale
            </h2>

            {/* Description */}
            <p className="text-description max-w-xl">
              I'm a Full-Stack developer specializing in building microservices and modern web applications.
            </p>

            {/* Check my resume button  */}
            <div className="pt-6">
              <Link
                href="/resume.pdf"
                className="inline-block px-8 py-4 border-2 border-[#4876CE] text-[#4876CE] rounded-xl font-['Radio_Canada'] text-lg font-semibold hover:bg-[#4876CE]/10 transition-all duration-300 shadow-[0_0_15px_rgba(72,118,206,0.3)] hover:shadow-[0_0_25px_rgba(72,118,206,0.5)]"
                target="_blank"
              >
                Check my resume
              </Link>
            </div>
          </div>

          {/* Profile Image */}
          <div className="relative flex justify-center lg:justify-end lg:-mr-[280px]">
            <div className="relative">
              {/* Decorative puzzle piece */}
              <div className="absolute -top-8 -right-8 w-32 h-32 text-[#4876CE] opacity-80">
                <svg viewBox="0 0 100 100" fill="currentColor">
                  <path d="M80,40 L80,20 C80,15 75,10 70,10 L50,10 C50,5 45,0 40,0 C35,0 30,5 30,10 L10,10 C5,10 0,15 0,20 L0,40 C5,40 10,45 10,50 C10,55 5,60 0,60 L0,80 C0,85 5,90 10,90 L30,90 C30,95 35,100 40,100 C45,100 50,95 50,90 L70,90 C75,90 80,85 80,80 L80,60 C85,60 90,55 90,50 C90,45 85,40 80,40Z" />
                </svg>
              </div>

              {/* Profile image placeholder */}
              <div className="w-64 h-80 md:w-80 md:h-96 relative">
                <div className="absolute inset-0 bg-[#4876CE]/20 rounded-lg transform translate-x-4 translate-y-4"></div>
                <div className="relative w-full h-full bg-[#112240] rounded-lg overflow-hidden border-2 border-[#4876CE]/30">
                  <div className="w-full h-full flex items-center justify-center text-[#4876CE]/50">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Left Side - GitHub icon */}
      <div className="hidden lg:flex fixed left-8 top-1/2 flex-col items-center">
        <a
          href="https://github.com/MariaIsabelGuerrero"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#7E7E7E] hover:text-[#4876CE] hover:-translate-y-1 transition-all mb-6"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
        {/* Vertical line  */}
        <div className="w-[2px] h-72 bg-[#7E7E7E]"></div>
      </div>

      {/* Right Side - Email */}
      <div className="hidden lg:flex fixed right-8 top-1/2 flex-col items-center">
        <a
          href="mailto:mariaigs2005@gmail.com"
          className="text-[#7E7E7E] hover:text-[#4876CE] transition-colors font-['Open_Sans'] text-sm font-semibold tracking-widest mb-6"
          style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}
        >
          mariaigs2005@gmail.com
        </a>
        {/* Vertical line */}
        <div className="w-[2px] h-72 bg-[#7E7E7E]"></div>
      </div>
    </section>
  );
}
