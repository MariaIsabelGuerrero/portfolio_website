"use client";

import React from "react"

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Search, Briefcase, MapPin, Loader2 } from "lucide-react";
import { fetchExperience as apiFetchExperience, createExperience, updateExperience, deleteExperience as apiDeleteExperience, type Experience } from "@/lib/api-client";
import { useLanguage } from "@/lib/i18n";

export default function ExperienceManagement() {
  const { t } = useLanguage();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    period: "",
    type: "",
    description: "",
    responsibilities: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadExperience = useCallback(async () => {
    try {
      const res = await apiFetchExperience();
      setExperiences(res.data);
    } catch (err) {
      console.error("Failed to load experience:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadExperience(); }, [loadExperience]);

  const filteredExperiences = experiences.filter((exp) =>
    exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingExperience(null);
    setFormData({ title: "", company: "", location: "", period: "", type: "", description: "", responsibilities: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (exp: Experience) => {
    setEditingExperience(exp);
    setFormData({
      title: exp.title,
      company: exp.company,
      location: exp.location || "",
      period: exp.period,
      type: exp.type || "",
      description: exp.description || "",
      responsibilities: exp.responsibilities.join("\n"),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const expData = {
      title: formData.title,
      company: formData.company,
      location: formData.location,
      period: formData.period,
      type: formData.type,
      description: formData.description,
      responsibilities: formData.responsibilities.split("\n").filter(Boolean),
    };

    try {
      if (editingExperience) {
        await updateExperience(editingExperience.id, expData);
      } else {
        await createExperience(expData);
      }
      setIsModalOpen(false);
      await loadExperience();
    } catch (err) {
      console.error("Failed to save experience:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDeleteExperience(id);
      setDeleteConfirm(null);
      await loadExperience();
    } catch (err) {
      console.error("Failed to delete experience:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#5227FF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{t("Work Experience", "Expérience professionnelle")}</h1>
          <p className="text-[#B19EEF] mt-1">{t("Manage your professional experience", "Gérez votre expérience professionnelle")}</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-[#5227FF] text-white rounded-xl hover:bg-[#5227FF]/80 transition-colors shadow-lg shadow-[#5227FF]/30"
        >
          <Plus className="w-5 h-5" />
          {t("Add Experience", "Ajouter une expérience")}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B19EEF]" />
        <input
          type="text"
          placeholder={t("Search experience...", "Rechercher une expérience...")}
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
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <p className="text-[#B19EEF] text-sm">{exp.period}</p>
                    {exp.location && (
                      <span className="text-[#B19EEF]/70 text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {exp.location}
                      </span>
                    )}
                    {exp.type && (
                      <span className="px-2 py-0.5 text-xs bg-[#5227FF]/20 text-[#B19EEF] rounded-full border border-[#5227FF]/30">
                        {exp.type}
                      </span>
                    )}
                  </div>
                  {exp.description && <p className="text-[#B19EEF]/80 text-sm mt-2">{exp.description}</p>}
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
          {t("No experience found.", "Aucune expérience trouvée.")}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingExperience ? t("Edit Experience", "Modifier l'expérience") : t("Add New Experience", "Ajouter une nouvelle expérience")}
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
                <label className="block text-[#B19EEF] text-sm mb-2">{t("Job Title", "Intitulé du poste")}</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
                  placeholder={t("Software Developer", "Développeur logiciel")}
                />
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">{t("Company", "Entreprise")}</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
                  placeholder={t("Company Name", "Nom de l'entreprise")}
                />
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">{t("Location", "Localisation")}</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
                  placeholder={t("Remote, City, Country", "Télétravail, Ville, Pays")}
                />
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">{t("Period", "Période")}</label>
                <input
                  type="text"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
                  placeholder={t("2022 - Present", "2022 - Présent")}
                />
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">{t("Employment Type", "Type d'emploi")}</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white focus:outline-none focus:border-[#FF9FFC]"
                >
                  <option value="">{t("Select type", "Sélectionner le type")}</option>
                  <option value="Full-time">{t("Full-time", "Temps plein")}</option>
                  <option value="Part-time">{t("Part-time", "Temps partiel")}</option>
                  <option value="Freelance">{t("Freelance", "Freelance")}</option>
                  <option value="Internship">{t("Internship", "Stage")}</option>
                  <option value="Contract">{t("Contract", "Contrat")}</option>
                </select>
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">{t("Description", "Description")}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC] resize-none"
                  placeholder={t("Brief overview of your role...", "Bref aperçu de votre rôle...")}
                />
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">{t("Responsibilities (one per line)", "Responsabilités (une par ligne)")}</label>
                <textarea
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC] resize-none"
                  placeholder={t("Developed web applications\nCollaborated with teams\n...", "Développé des applications web\nCollaboré avec des équipes\n...")}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-[#5227FF]/30 text-[#B19EEF] rounded-xl hover:bg-[#5227FF]/20 transition-colors"
                >
                  {t("Cancel", "Annuler")}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#5227FF] text-white rounded-xl hover:bg-[#5227FF]/80 transition-colors"
                >
                  {editingExperience ? t("Save Changes", "Enregistrer") : t("Add Experience", "Ajouter l'expérience")}
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
            <h2 className="text-xl font-semibold text-white mb-2">{t("Delete Experience?", "Supprimer l'expérience ?")}</h2>
            <p className="text-[#B19EEF] mb-6">{t("This action cannot be undone.", "Cette action est irréversible.")}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border border-[#5227FF]/30 text-[#B19EEF] rounded-xl hover:bg-[#5227FF]/20 transition-colors"
              >
                {t("Cancel", "Annuler")}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                {t("Delete", "Supprimer")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
