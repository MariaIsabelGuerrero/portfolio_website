"use client";

import React from "react"

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";

type SkillCategory = "soft" | "languages" | "frontend" | "databases" | "tools" | "other";

interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
}

const initialSkills: Skill[] = [
  { id: "1", name: "Teaching/Mentoring", category: "soft" },
  { id: "2", name: "Communication", category: "soft" },
  { id: "3", name: "Collaboration", category: "soft" },
  { id: "4", name: "Problem-solving", category: "soft" },
  { id: "5", name: "Adaptability", category: "soft" },
  { id: "6", name: "Patience", category: "soft" },
  { id: "7", name: "Java", category: "languages" },
  { id: "8", name: "JavaScript/TypeScript", category: "languages" },
  { id: "9", name: "Python", category: "languages" },
  { id: "10", name: "SQL", category: "languages" },
  { id: "11", name: "HTML/CSS", category: "languages" },
  { id: "12", name: "C#", category: "languages" },
  { id: "13", name: "React", category: "frontend" },
  { id: "14", name: "Next.js", category: "frontend" },
  { id: "15", name: "Tailwind CSS", category: "frontend" },
  { id: "16", name: "PostgreSQL", category: "databases" },
  { id: "17", name: "MySQL", category: "databases" },
  { id: "18", name: "SQL Server", category: "databases" },
];

const categories: { value: SkillCategory; label: string }[] = [
  { value: "soft", label: "Soft Skills" },
  { value: "languages", label: "Programming Languages" },
  { value: "frontend", label: "Frontend" },
  { value: "databases", label: "Databases" },
  { value: "tools", label: "Tools" },
  { value: "other", label: "Other Technical" },
];

export default function SkillsManagement() {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<SkillCategory | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({ name: "", category: "soft" as SkillCategory });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || skill.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingSkill(null);
    setFormData({ name: "", category: "soft" });
    setIsModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({ name: skill.name, category: skill.category });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSkill) {
      setSkills(skills.map((s) => 
        s.id === editingSkill.id ? { ...s, ...formData } : s
      ));
    } else {
      const newSkill: Skill = {
        id: Date.now().toString(),
        ...formData,
      };
      setSkills([...skills, newSkill]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
    setDeleteConfirm(null);
  };

  const getCategoryColor = (category: SkillCategory) => {
    const colors = {
      soft: "bg-[#FF9FFC]/20 text-[#FF9FFC] border-[#FF9FFC]/30",
      languages: "bg-[#5227FF]/20 text-[#B19EEF] border-[#5227FF]/30",
      frontend: "bg-[#5227FF]/20 text-[#FF9FFC] border-[#5227FF]/30",
      databases: "bg-[#B19EEF]/20 text-[#B19EEF] border-[#B19EEF]/30",
      tools: "bg-[#5227FF]/20 text-white border-[#5227FF]/30",
      other: "bg-[#FF9FFC]/20 text-[#FF9FFC] border-[#FF9FFC]/30",
    };
    return colors[category];
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Skills</h1>
          <p className="text-[#B19EEF] mt-1">Manage your skills and expertise</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-[#5227FF] text-white rounded-xl hover:bg-[#5227FF]/80 transition-colors shadow-lg shadow-[#5227FF]/30"
        >
          <Plus className="w-5 h-5" />
          Add Skill
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B19EEF]" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#0f0520] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as SkillCategory | "all")}
          className="px-4 py-3 bg-[#0f0520] border border-[#5227FF]/30 rounded-xl text-white focus:outline-none focus:border-[#FF9FFC]"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Skills Table */}
      <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#5227FF]/30">
                <th className="text-left px-6 py-4 text-[#B19EEF] font-medium">Skill Name</th>
                <th className="text-left px-6 py-4 text-[#B19EEF] font-medium">Category</th>
                <th className="text-right px-6 py-4 text-[#B19EEF] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSkills.map((skill) => (
                <tr key={skill.id} className="border-b border-[#5227FF]/10 hover:bg-[#5227FF]/5">
                  <td className="px-6 py-4 text-white font-medium">{skill.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm border ${getCategoryColor(skill.category)}`}>
                      {categories.find((c) => c.value === skill.category)?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(skill)}
                        className="p-2 rounded-lg bg-[#5227FF]/20 text-[#B19EEF] hover:bg-[#5227FF]/40 hover:text-white transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(skill.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSkills.length === 0 && (
          <div className="p-8 text-center text-[#B19EEF]">
            No skills found matching your criteria.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg hover:bg-[#5227FF]/20 text-[#B19EEF] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">Skill Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
                  placeholder="Enter skill name"
                />
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as SkillCategory })}
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white focus:outline-none focus:border-[#FF9FFC]"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-[#5227FF]/30 text-[#B19EEF] rounded-xl hover:bg-[#5227FF]/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#5227FF] text-white rounded-xl hover:bg-[#5227FF]/80 transition-colors"
                >
                  {editingSkill ? "Save Changes" : "Add Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Delete Skill?</h2>
            <p className="text-[#B19EEF] mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border border-[#5227FF]/30 text-[#B19EEF] rounded-xl hover:bg-[#5227FF]/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
