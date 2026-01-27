"use client";

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
  Clock
} from "lucide-react";
import Link from "next/link";

const stats = [
  { name: "Skills", count: 18, icon: Lightbulb, href: "/admin/skills", color: "from-[#5227FF] to-[#7B5CFF]" },
  { name: "Projects", count: 5, icon: FolderKanban, href: "/admin/projects", color: "from-[#FF9FFC] to-[#FF6BF5]" },
  { name: "Experience", count: 3, icon: Briefcase, href: "/admin/experience", color: "from-[#5227FF] to-[#FF9FFC]" },
  { name: "Education", count: 2, icon: GraduationCap, href: "/admin/education", color: "from-[#B19EEF] to-[#5227FF]" },
  { name: "Hobbies", count: 4, icon: Heart, href: "/admin/hobbies", color: "from-[#FF9FFC] to-[#B19EEF]" },
];

const quickActions = [
  { name: "Add New Skill", href: "/admin/skills", icon: Lightbulb },
  { name: "Add New Project", href: "/admin/projects", icon: FolderKanban },
  { name: "Update Resume", href: "/admin/resume", icon: FileText },
  { name: "Edit Contact Info", href: "/admin/contact", icon: Mail },
];

const recentActivity = [
  { action: "Added new skill", item: "React", time: "2 hours ago" },
  { action: "Updated project", item: "Pet Clinic Microservices", time: "5 hours ago" },
  { action: "Modified experience", item: "Software Developer at TechCorp", time: "1 day ago" },
  { action: "Added education", item: "Master's in Computer Science", time: "2 days ago" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-[#B19EEF] mt-1">Welcome back, Maria Isabel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="group bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl p-6 hover:border-[#FF9FFC]/50 transition-all hover:shadow-lg hover:shadow-[#5227FF]/20"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-[#B19EEF] text-sm">{stat.name}</p>
            <p className="text-white text-3xl font-bold mt-1">{stat.count}</p>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#FF9FFC]" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#5227FF]/10 hover:bg-[#5227FF]/20 text-[#B19EEF] hover:text-white transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#5227FF]/30 flex items-center justify-center group-hover:bg-[#5227FF] transition-colors">
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{action.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#FF9FFC]" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-[#5227FF]/5 border border-[#5227FF]/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#FF9FFC]" />
                  <div>
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-[#B19EEF] text-sm">{activity.item}</p>
                  </div>
                </div>
                <span className="text-[#B19EEF]/60 text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Preview */}
      <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#FF9FFC]" />
            Portfolio Preview
          </h2>
          <Link
            href="/"
            target="_blank"
            className="text-[#FF9FFC] hover:text-white text-sm font-medium transition-colors"
          >
            View Live Site →
          </Link>
        </div>
        <div className="aspect-video rounded-xl bg-gradient-to-br from-[#5227FF]/20 to-[#FF9FFC]/20 border border-[#5227FF]/30 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#5227FF]/30 flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-[#B19EEF]" />
            </div>
            <p className="text-[#B19EEF]">Portfolio preview will appear here</p>
            <Link
              href="/"
              target="_blank"
              className="inline-block mt-4 px-6 py-2 bg-[#5227FF] text-white rounded-xl hover:bg-[#5227FF]/80 transition-colors"
            >
              Open Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
