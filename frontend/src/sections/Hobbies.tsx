'use client';

import React, { useEffect } from 'react';
import { Dumbbell, Heart, Plane, Music } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface HobbyItem {
  name: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

const hobbiesData: HobbyItem[] = [
  {
    name: "Gymnastics",
    icon: Dumbbell,
    description: "Staying active and building strength through gymnastics training",
    color: "from-rose-500 to-pink-600"
  },
  {
    name: "Yoga",
    icon: Heart,
    description: "Finding balance and peace through mindful yoga practice",
    color: "from-emerald-500 to-teal-600"
  },
  {
    name: "Travel",
    icon: Plane,
    description: "Exploring new places and experiencing different cultures",
    color: "from-sky-500 to-blue-600"
  },
  {
    name: "Music",
    icon: Music,
    description: "Enjoying and discovering new music across various genres",
    color: "from-violet-500 to-purple-600"
  }
];

const HobbyCard = ({ hobby, index }: { hobby: HobbyItem; index: number }) => {
  const Icon = hobby.icon;

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={index * 100}
      data-aos-duration="800"
      className="group relative"
    >
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 overflow-hidden">
        {/* Background gradient on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${hobby.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

        {/* Icon */}
        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${hobby.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
          <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#6366f1] group-hover:to-[#a855f7] transition-all duration-300">
          {hobby.name}
        </h3>

        <p className="text-gray-400 text-lg leading-relaxed">
          {hobby.description}
        </p>

        {/* Decorative element */}
        <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br ${hobby.color} rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
      </div>
    </div>
  );
};

const Hobbies = () => {
  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  return (
    <section className="py-20 px-[5%] sm:px-[5%] lg:px-[10%] bg-[#030014]" id="Hobbies">
      <div className="text-center mb-16">
        <h2
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
          data-aos="zoom-in-up"
          data-aos-duration="600"
        >
          Hobbies
        </h2>
        <p
          className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg sm:text-xl lg:text-2xl"
          data-aos="zoom-in-up"
          data-aos-duration="800"
        >
          What I enjoy doing in my free time
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {hobbiesData.map((hobby, index) => (
          <HobbyCard key={index} hobby={hobby} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Hobbies;
