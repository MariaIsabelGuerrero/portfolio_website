"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Lightbulb,
  FolderKanban,
  Briefcase,
  GraduationCap,
  FileText,
  Mail,
  Heart,
  TrendingUp,
  Eye,
  MessageSquare,
  Quote,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { fetchDashboardStats } from "@/lib/api-client";
import { useLanguage } from "@/lib/i18n";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<{
    skills: number;
    projects: number;
    experience: number;
    education: number;
    hobbies: number;
    unreadMessages: number;
    pendingTestimonials: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const statConfig = [
    { key: "skills" as const, nameEn: "Skills", nameFr: "Compétences", icon: Lightbulb, href: "/admin/skills", color: "from-[#5227FF] to-[#7B5CFF]" },
    { key: "projects" as const, nameEn: "Projects", nameFr: "Projets", icon: FolderKanban, href: "/admin/projects", color: "from-[#FF9FFC] to-[#FF6BF5]" },
    { key: "experience" as const, nameEn: "Experience", nameFr: "Experience", icon: Briefcase, href: "/admin/experience", color: "from-[#5227FF] to-[#FF9FFC]" },
    { key: "education" as const, nameEn: "Education", nameFr: "Formation", icon: GraduationCap, href: "/admin/education", color: "from-[#B19EEF] to-[#5227FF]" },
    { key: "hobbies" as const, nameEn: "Hobbies", nameFr: "Loisirs", icon: Heart, href: "/admin/hobbies", color: "from-[#FF9FFC] to-[#B19EEF]" },
  ];

  const quickActions = [
    { nameEn: "Add New Skill", nameFr: "Ajouter une compétence", href: "/admin/skills", icon: Lightbulb },
    { nameEn: "Add New Project", nameFr: "Ajouter un projet", href: "/admin/projects", icon: FolderKanban },
    { nameEn: "Update Resume", nameFr: "Mettre à jour le CV", href: "/admin/resume", icon: FileText },
    { nameEn: "Edit Contact Info", nameFr: "Modifier les coordonnées", href: "/admin/contact", icon: Mail },
  ];

  const loadStats = useCallback(async () => {
    try {
      const res = await fetchDashboardStats();
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#5227FF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">{t("Dashboard", "Tableau de bord")}</h1>
        <p className="text-[#B19EEF] mt-1">{t("Welcome back, Maria Isabel", "Bon retour, Maria Isabel")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statConfig.map((stat) => (
          <Link
            key={stat.key}
            href={stat.href}
            className="group bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl p-6 hover:border-[#FF9FFC]/50 transition-all hover:shadow-lg hover:shadow-[#5227FF]/20"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-[#B19EEF] text-sm">{t(stat.nameEn, stat.nameFr)}</p>
            <p className="text-white text-3xl font-bold mt-1">{stats?.[stat.key] ?? 0}</p>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#FF9FFC]" />
            {t("Quick Actions", "Actions rapides")}
          </h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.nameEn}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#5227FF]/10 hover:bg-[#5227FF]/20 text-[#B19EEF] hover:text-white transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#5227FF]/30 flex items-center justify-center group-hover:bg-[#5227FF] transition-colors">
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{t(action.nameEn, action.nameFr)}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="lg:col-span-2 space-y-4">
          <Link
            href="/admin/messages"
            className="flex items-center justify-between p-6 bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl hover:border-[#FF9FFC]/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5227FF] to-[#FF9FFC] flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">{t("Unread Messages", "Messages non lus")}</p>
                <p className="text-[#B19EEF] text-sm">{t("Contact form submissions", "Soumissions du formulaire de contact")}</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stats?.unreadMessages ?? 0}</p>
          </Link>

          <Link
            href="/admin/testimonials"
            className="flex items-center justify-between p-6 bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl hover:border-[#FF9FFC]/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF9FFC] to-[#B19EEF] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Quote className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">{t("Testimonials", "Témoignages")}</p>
                <p className="text-[#B19EEF] text-sm">{t("Manage testimonials", "Gérer les témoignages")}</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stats?.pendingTestimonials ?? 0}</p>
          </Link>
        </div>
      </div>

      {/* Portfolio Preview */}
      <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#FF9FFC]" />
            {t("Portfolio Preview", "Apercu du portfolio")}
          </h2>
          <Link
            href="/"
            target="_blank"
            className="text-[#FF9FFC] hover:text-white text-sm font-medium transition-colors"
          >
            {t("View Live Site", "Voir le site")} →
          </Link>
        </div>
        <div className="aspect-video rounded-xl bg-gradient-to-br from-[#5227FF]/20 to-[#FF9FFC]/20 border border-[#5227FF]/30 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#5227FF]/30 flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-[#B19EEF]" />
            </div>
            <p className="text-[#B19EEF]">{t("Portfolio preview will appear here", "L'apercu du portfolio apparaitra ici")}</p>
            <Link
              href="/"
              target="_blank"
              className="inline-block mt-4 px-6 py-2 bg-[#5227FF] text-white rounded-xl hover:bg-[#5227FF]/80 transition-colors"
            >
              {t("Open Portfolio", "Ouvrir le portfolio")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
