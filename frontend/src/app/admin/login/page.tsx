"use client";

import React from "react"

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign in
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 bg-[#0f0520] flex items-center justify-center p-8">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-white text-center mb-6">
            Sign in to Portfolio
          </h1>


          <p className="text-[#B19EEF] text-center text-sm mb-6">
            or use your email account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B19EEF]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-[#1a0a2e] border border-[#5227FF]/30 rounded-lg py-4 pl-12 pr-4 text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC] transition-colors"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B19EEF]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-[#1a0a2e] border border-[#5227FF]/30 rounded-lg py-4 pl-12 pr-4 text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC] transition-colors"
              />
            </div>

            <div className="text-center">
              <Link href="#" className="text-[#B19EEF] text-sm hover:text-[#FF9FFC] underline">
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#5227FF] text-white font-semibold py-4 rounded-full hover:bg-[#5227FF]/80 transition-colors shadow-lg shadow-[#5227FF]/30"
            >
              Sign In
            </button>
          </form>
        </motion.div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        {/* Hexagon Pattern Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5227FF] via-[#7B2FFF] to-[#FF9FFC]">
          {/* Hexagon SVG Pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                <polygon 
                  points="25,0 50,14.4 50,43.4 25,57.8 0,43.4 0,14.4" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.3)" 
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <h2 className="text-5xl font-bold text-white mb-8">
              Welcome Back!
            </h2>
            
            <p className="text-white/80 text-xl mb-8">
              {"Don't have an account?"}
            </p>

            <Link
              href="/sign-up"
              className="inline-block bg-white text-[#5227FF] font-semibold px-12 py-4 rounded-full hover:bg-white/90 transition-colors shadow-lg"
            >
              Sign Up
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Mobile Sign Up Link */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#5227FF] to-[#FF9FFC] p-6 text-center">
        <p className="text-white mb-3">{"Don't have an account?"}</p>
        <Link
          href="/sign-up"
          className="inline-block bg-white text-[#5227FF] font-semibold px-8 py-3 rounded-full"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
