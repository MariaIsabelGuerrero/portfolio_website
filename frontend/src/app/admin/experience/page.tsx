"use client";

import React from "react"

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Search, Briefcase } from "lucide-react";

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  responsibilities: string[];
}

const initialExperiences: Experience[] = [
  {
    id: "1",
    title: "Software Developer",
    company: "TechCorp Inc.",
    period: "2022 - Present",
    responsibilities: [
      "Developed and maintained full-stack web applications using React and Node.js",
      "Collaborated with cross-functional teams to deliver high-quality software solutions",
      "Implemented CI/CD pipelines and improved deployment processes",
    ],
  },
  {
    id: "2",
    title: "Junior Developer",
    company: "StartUp Labs",
    period: "2020 - 2022",
    responsibilities: [
      "Built responsive user interfaces using modern JavaScript frameworks",
      "Participated in code reviews and agile development processes",
      "Assisted in database design and optimization",
    ],
  },
];

export default function ExperienceManagement() {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    period: "",
    responsibilities: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredExperiences = experiences.filter((exp) =>
    exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingExperience(null);
    setFormData({ title: "", company: "", period: "", responsibilities: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (exp: Experience) => {
    setEditingExperience(exp);
    setFormData({
      title: exp.title,
      company: exp.company,
      period: exp.period,
      responsibilities: exp.responsibilities.join("\n"),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expData = {
      title: formData.title,
      company: formData.company,
      period: formData.period,
      responsibilities: formData.responsibilities.split("\n").filter(Boolean),
    };

    if (editingExperience) {
      setExperiences(experiences.map((e) =>
        e.id === editingExperience.id ? { ...e, ...expData } : e
      ));
    } else {
      const newExp: Experience = { id: Date.now().toString(), ...expData };
      setExperiences([...experiences, newExp]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setExperiences(experiences.filter((e) => e.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Work Experience</h1>
          <p className="text-[#B19EEF] mt-1">Manage your professional experience</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-[#5227FF] text-white rounded-xl hover:bg-[#5227FF]/80 transition-colors shadow-lg shadow-[#5227FF]/30"
        >
          <Plus className="w-5 h-5" />
          Add Experience
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B19EEF]" />
        <input
          type="text"
          placeholder="Search experience..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#0f0520] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
        />
      </div>

      {/* Experience Cards */}
      <div className="space-y-4">
        {filteredExperiences.map((exp) => (
          <div
            key={exp.id}
            className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl p-6 hover:border-[#FF9FFC]/50 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5227FF] to-[#FF9FFC] flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{exp.title}</h3>
                  <p className="text-[#FF9FFC]">{exp.company}</p>
                  <p className="text-[#B19EEF] text-sm mt-1">{exp.period}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(exp)}
                  className="p-2 rounded-lg bg-[#5227FF]/20 text-[#B19EEF] hover:bg-[#5227FF]/40 hover:text-white transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(exp.id)}
                  className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <ul className="mt-4 space-y-2 pl-16">
              {exp.responsibilities.map((resp, idx) => (
                <li key={idx} className="text-[#B19EEF] text-sm flex items-start gap-2">
                  <span className="text-[#5227FF] mt-1.5">•</span>
                  {resp}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {filteredExperiences.length === 0 && (
        <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl p-8 text-center text-[#B19EEF]">
          No experience found.
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingExperience ? "Edit Experience" : "Add New Experience"}
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
                <label className="block text-[#B19EEF] text-sm mb-2">Job Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
                  placeholder="Software Developer"
                />
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
                  placeholder="Company Name"
                />
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">Period</label>
                <input
                  type="text"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
                  placeholder="2022 - Present"
                />
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">Responsibilities (one per line)</label>
                <textarea
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC] resize-none"
                  placeholder="Developed web applications&#10;Collaborated with teams&#10;..."
                />
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
                  {editingExperience ? "Save Changes" : "Add Experience"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Delete Experience?</h2>
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
