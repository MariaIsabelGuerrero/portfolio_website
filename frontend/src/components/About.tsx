'use client';

import Image from 'next/image';

const technologies = [
  ['Java Script', 'React', 'HTML/CSS'],
  ['Vue.js', 'Angular', 'Java Script'],
];

export default function About() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-[#0C1B31]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="lg:-ml-[200px]">
            {/* Number 1 + About me */}
            <div className="relative mb-8">
              {/* Number 1 */}
              <span
                className="text-[120px] md:text-[150px] leading-none font-bold font-['Open_Sans']"
                style={{
                  color: '#4876CE',
                  WebkitTextStroke: '1px #5A92E3',
                  paintOrder: 'stroke fill',
                  textShadow: '0 0 15px rgba(72, 118, 206, 0.3)',
                }}
              >
                1
              </span>

              {/* About me + line at middle/bottom of 1 */}
              <div className="absolute bottom-6 left-16 md:left-20 flex items-center gap-4">
                <h2 className="heading-section whitespace-nowrap">
                  About me
                </h2>
                {/* Horizontal line */}
                <div className="w-48 md:w-[400px] lg:w-[500px] h-[1px] bg-[#4876CE]"></div>
              </div>
            </div>

              {/* Description - aligned with About me */}
              <div className="text-body space-y-4 max-w-lg ml-[62px] md:ml-[78px]">
                <p>
                  Hi, I&apos;m Maria Isabel, a Full-Stack Developer with experience in building
                  scalable applications. I specialize in creating clean, responsive, and user-friendly
                  web interfaces using HTML, CSS, JavaScript, and modern frameworks like React.
                </p>
                <p>
                  I enjoy turning design ideas into functional, interactive experiences and
                  have a strong passion for learning and staying updated with the latest
                  frontend technologies. Let&apos;s build something amazing together!
                </p>
                <p>Here are a few technologies I&apos;ve been working with recently:</p>
              </div>

              {/* Technologies Grid - aligned with About me */}
              <div className="mt-8 ml-[62px] md:ml-[78px] grid grid-cols-3 gap-y-6 gap-x-10 md:gap-x-16">
                {technologies.flat().map((tech, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {/* Triangle arrow */}
                    <svg
                      width="8"
                      height="10"
                      viewBox="0 0 8 10"
                      fill="#4876CE"
                      className="flex-shrink-0"
                    >
                      <polygon points="0,0 8,5 0,10" />
                    </svg>
                    <span className="text-tech">
                      {tech}
                    </span>
                  </div>
                ))}
              </div>
          </div>

          {/* Right Content - 3D Character Image */}
          <div className="flex justify-center lg:justify-end items-start">
            <div className="relative w-[300px] h-[350px] md:w-[400px] md:h-[450px]">
              <Image
                src="/images/about-character.png"
                alt="3D Character holding code screen"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
