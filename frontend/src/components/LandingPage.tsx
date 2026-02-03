'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import Navbar from './Navbar';
import AnimatedBackground from './Background';
import Footer from './Footer';

import Home from '../sections/Home';
import About from '../sections/About';
import Education from '../sections/Education';
import Experience from '../sections/Experience';
import Hobbies from '../sections/Hobbies';
import Portofolio from '../sections/Portofolio';
import ContactPage from '../sections/Contact';
import WelcomeScreen from '../sections/WelcomeScreen';

export default function LandingPage() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {!showWelcome && (
        <>
          <Navbar />
          <AnimatedBackground />
          <Home />
          <About />
          <Education />
          <Experience />
          <Portofolio />
          <Hobbies />
          <ContactPage />
          <Footer />
        </>
      )}
    </>
  );
}
