"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";

export default function SignIn() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !email.trim()) {
      setError(t("Email is required", "L'adresse e-mail est requise"));
      setLoading(false);
      return;
    }
    if (!password) {
      setError(t("Password is required", "Le mot de passe est requis"));
      setLoading(false);
      return;
    }

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if ("error" in result && result.error) {
        const errObj = result.error as { message?: string };
        setError(
          errObj?.message ||
            t(
              "Login failed. Please check your credentials.",
              "Connexion echouee. Veuillez verifier vos identifiants."
            )
        );
        setLoading(false);
        return;
      }

      let session = await authClient.getSession();
      let retries = 0;
      while (!session.data?.session && retries < 10) {
        await new Promise((r) => setTimeout(r, 200));
        session = await authClient.getSession();
        retries++;
      }

      if (!session.data?.session) {
        setError(
          t(
            "Failed to establish session. Please try again.",
            "Impossible d'etablir la session. Veuillez reessayer."
          )
        );
        setLoading(false);
        return;
      }

      await new Promise((r) => setTimeout(r, 500));

      const tokenResult = await authClient.token();
      if (tokenResult.data?.token) {
        router.push("/admin");
        return;
      } else {
        setError(
          t(
            "Failed to retrieve authentication token. Please try again.",
            "Impossible de recuperer le jeton d'authentification. Veuillez reessayer."
          )
        );
        setLoading(false);
      }
    } catch {
      setError(
        t(
          "Login failed. Please check your credentials.",
          "Connexion echouee. Veuillez verifier vos identifiants."
        )
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Language Toggle - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle />
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 bg-[#0f0520] flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-white text-center mb-6">
            {t("Sign in to Portfolio", "Connexion au Portfolio")}
          </h1>

          <p className="text-[#B19EEF] text-center text-sm mb-6">
            {t("Sign in to manage your portfolio", "Connectez-vous pour gerer votre portfolio")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B19EEF]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("Email", "Adresse e-mail")}
                className="w-full bg-[#1a0a2e] border border-[#5227FF]/30 rounded-lg py-4 pl-12 pr-4 text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC] transition-colors"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B19EEF]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("Password", "Mot de passe")}
                className="w-full bg-[#1a0a2e] border border-[#5227FF]/30 rounded-lg py-4 pl-12 pr-4 text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5227FF] text-white font-semibold py-4 rounded-full hover:bg-[#5227FF]/80 transition-colors shadow-lg shadow-[#5227FF]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? t("Signing in...", "Connexion...")
                : t("Sign In", "Se connecter")}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5227FF] via-[#7B2FFF] to-[#FF9FFC]">
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

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <h2 className="text-5xl font-bold text-white mb-8">
              {t("Welcome Back!", "Bon retour !")}
            </h2>

            <p className="text-white/80 text-xl">
              {t("Manage your portfolio content", "Gerez le contenu de votre portfolio")}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
