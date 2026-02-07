"use client";

import React from "react"

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Lightbulb,
  FolderKanban,
  Briefcase,
  GraduationCap,
  FileText,
  Mail,
  Heart,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  MessageSquare,
  Quote,
  Award
} from "lucide-react";
import { useAdminAccess } from "@/lib/hooks/useAdminAccess";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";

const sidebarLinks = [
  { nameEn: "Dashboard", nameFr: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
  { nameEn: "Skills", nameFr: "Compétences", href: "/admin/skills", icon: Lightbulb },
  { nameEn: "Projects", nameFr: "Projets", href: "/admin/projects", icon: FolderKanban },
  { nameEn: "Experience", nameFr: "Expérience", href: "/admin/experience", icon: Briefcase },
  { nameEn: "Education", nameFr: "Formation", href: "/admin/education", icon: GraduationCap },
  { nameEn: "Resume", nameFr: "CV", href: "/admin/resume", icon: FileText },
  { nameEn: "Certificates", nameFr: "Certificats", href: "/admin/certificates", icon: Award },
  { nameEn: "Contact", nameFr: "Contact", href: "/admin/contact", icon: Mail },
  { nameEn: "Hobbies", nameFr: "Loisirs", href: "/admin/hobbies", icon: Heart },
  { nameEn: "Messages", nameFr: "Messages", href: "/admin/messages", icon: MessageSquare },
  { nameEn: "Testimonials", nameFr: "Témoignages", href: "/admin/testimonials", icon: Quote },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { authorized, loading } = useAdminAccess();
  const { t } = useLanguage();

  // Login page: render without sidebar/topbar and skip auth guard
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0314] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#5227FF]/30 border-t-[#5227FF] rounded-full animate-spin" />
      </div>
    );
  }

  // Not authorized — hook handles redirect to /admin/login
  if (!authorized) {
    return null;
  }

  const handleLogout = async () => {
    try {
      const authUrl =
        process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:3001";
      await fetch(`${authUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      await authClient.signOut();
      router.push("/admin/login");
      window.location.reload();
    } catch {
      router.push("/admin/login");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0314] flex">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen bg-[#0f0520] border-r border-[#5227FF]/30
          transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${sidebarOpen ? "w-64" : "w-20"}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#5227FF]/30">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5227FF] to-[#FF9FFC] flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            {sidebarOpen && (
              <span className="text-white font-semibold text-lg">Admin</span>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#5227FF]/20 transition-colors"
          >
            <ChevronLeft className={`w-5 h-5 text-[#B19EEF] transition-transform ${!sidebarOpen ? "rotate-180" : ""}`} />
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-[#B19EEF]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                title={!sidebarOpen ? t(link.nameEn, link.nameFr) : undefined}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive
                    ? "bg-[#5227FF] text-white shadow-lg shadow-[#5227FF]/30"
                    : "text-[#B19EEF] hover:bg-[#5227FF]/20 hover:text-white"
                  }
                `}
              >
                <link.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="font-medium">{t(link.nameEn, link.nameFr)}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-4 left-0 right-0 px-4 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#B19EEF] hover:bg-[#5227FF]/20 hover:text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">{t("Back to Site", "Retour au site")}</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#FF9FFC] hover:bg-red-500/20 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">{t("Logout", "Déconnexion")}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 bg-[#0f0520]/80 backdrop-blur-sm border-b border-[#5227FF]/30 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden text-[#B19EEF] hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 lg:flex-none" />

          <div className="flex items-center gap-4">
            <LanguageToggle />
            <div className="text-right hidden sm:block">
              <p className="text-white font-medium text-sm">Maria Isabel</p>
              <p className="text-[#B19EEF] text-xs">{t("Administrator", "Administratrice")}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5227FF] to-[#FF9FFC] flex items-center justify-center">
              <span className="text-white font-semibold">MI</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
