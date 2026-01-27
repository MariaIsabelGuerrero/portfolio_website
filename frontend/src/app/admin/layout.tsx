"use client";

import React from "react"

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Quote
} from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Skills", href: "/admin/skills", icon: Lightbulb },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Experience", href: "/admin/experience", icon: Briefcase },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
  { name: "Resume", href: "/admin/resume", icon: FileText },
  { name: "Contact", href: "/admin/contact", icon: Mail },
  { name: "Hobbies", href: "/admin/hobbies", icon: Heart },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Testimonials", href: "/admin/testimonials", icon: Quote },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
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
                  <span className="font-medium">{link.name}</span>
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
            {sidebarOpen && <span className="font-medium">Back to Site</span>}
          </Link>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#FF9FFC] hover:bg-red-500/20 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
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
            <div className="text-right hidden sm:block">
              <p className="text-white font-medium text-sm">Maria Isabel</p>
              <p className="text-[#B19EEF] text-xs">Administrator</p>
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
