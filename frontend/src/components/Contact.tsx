"use client";

import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import LiquidEther from "./liquid-ether";

export default function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    
    // Simulate form submission - replace with actual API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus("sent");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section 
      id="contact" 
      className="py-20 lg:py-32 relative overflow-hidden"
    >
      {/* Animated LiquidEther Background */}
      <div className="absolute inset-0 z-0 bg-[#0f0520]">
        <LiquidEther
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          mouseForce={15}
          cursorSize={80}
          isViscous
          viscous={25}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.4}
          isBounce={false}
          autoDemo
          autoSpeed={0.3}
          autoIntensity={1.5}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
          style={{ width: "100%", height: "100%", opacity: 0.6 }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Number and Title */}
        <motion.div 
          className="flex items-end mb-16"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Number 8 - Styled text to match design */}
          <span
            className="font-sans font-bold text-[80px] leading-none text-[#5227FF] -mr-2"
            style={{
              WebkitTextStroke: '1px #B19EEF',
              textShadow: '1px 2px 4px rgba(82, 39, 255, 0.5)',
            }}
          >
            8
          </span>
          {/* Title text with line */}
          <div className="flex items-start mb-1 -mt-4">
            <h2 className="font-sans font-semibold text-[32px] leading-none tracking-[-0.02em] text-[#F9F9F9] whitespace-nowrap ml-2">
              What&apos;s Next?
            </h2>
            {/* Line */}
            <div className="w-[380px] h-[1px] bg-[#5227FF]/50 hidden lg:block ml-3 mt-[16px]" />
          </div>
        </motion.div>

        {/* Centered Content */}
        <div className="text-center">
          {/* Get In Touch Title */}
          <motion.h3 
            className="font-sans font-bold text-[48px] sm:text-[56px] lg:text-[64px] text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            Get In Touch
          </motion.h3>
          
          {/* Subtitle */}
          <motion.p 
            className="text-[#B19EEF] font-sans text-lg sm:text-xl max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            My inbox is always open. Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
          </motion.p>

          {/* Contact Form Card - Violet Palette */}
          <motion.div 
            className="bg-[#1a0a2e]/90 backdrop-blur-sm border border-[#5227FF]/30 rounded-2xl p-8 sm:p-10 max-w-xl mx-auto shadow-2xl shadow-[#5227FF]/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* First Name & Last Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name*"
                    required
                    className="w-full bg-[#0f0520] border border-[#5227FF]/50 text-white placeholder-[#B19EEF]/60 px-4 py-3.5 rounded-lg font-sans text-sm focus:outline-none focus:border-[#FF9FFC] transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name*"
                    required
                    className="w-full bg-[#0f0520] border border-[#5227FF]/50 text-white placeholder-[#B19EEF]/60 px-4 py-3.5 rounded-lg font-sans text-sm focus:outline-none focus:border-[#FF9FFC] transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email*"
                  required
                  className="w-full bg-[#0f0520] border border-[#5227FF]/50 text-white placeholder-[#B19EEF]/60 px-4 py-3.5 rounded-lg font-sans text-sm focus:outline-none focus:border-[#FF9FFC] transition-colors"
                />
              </div>

              {/* Phone Number */}
              <div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number*"
                  required
                  className="w-full bg-[#0f0520] border border-[#5227FF]/50 text-white placeholder-[#B19EEF]/60 px-4 py-3.5 rounded-lg font-sans text-sm focus:outline-none focus:border-[#FF9FFC] transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message..."
                  required
                  rows={5}
                  className="w-full bg-[#0f0520] border border-[#5227FF]/50 text-white placeholder-[#B19EEF]/60 px-4 py-3.5 rounded-lg font-sans text-sm focus:outline-none focus:border-[#FF9FFC] transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-gradient-to-r from-[#5227FF] to-[#8B5CF6] text-white font-sans font-semibold text-base py-4 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-[#5227FF]/40"
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>

              {status === "sent" && (
                <p className="text-[#FF9FFC] text-sm font-sans text-center">Message sent successfully!</p>
              )}
              {status === "error" && (
                <p className="text-red-400 text-sm font-sans text-center">Failed to send message. Please try again.</p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
