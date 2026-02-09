"use client";

import React from "react"

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Search, GraduationCap, Loader2 } from "lucide-react";
import { fetchEducation as apiFetchEducation, createEducation, updateEducation, deleteEducation as apiDeleteEducation, type Education } from "@/lib/api-client";
import { useLanguage } from "@/lib/i18n";

export default function EducationManagement() {
  const { t, l, language } = useLanguage();
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [formData, setFormData] = useState({
    degree_en: "",
    degree_fr: "",
    institution: "",
    location: "",
    period: "",
    description_en: "",
    description_fr: "",
  });
  const [formLang, setFormLang] = useState<"en" | "fr">("en");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadEducation = useCallback(async () => {
    try {
      const res = await apiFetchEducation();
      setEducations(res.data);
    } catch (err) {
      console.error("Failed to load education:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadEducation(); }, [loadEducation]);

  const filteredEducation = educations.filter((edu) =>
    l(edu.degree_en, edu.degree_fr).toLowerCase().includes(searchTerm.toLowerCase()) ||
    edu.institution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingEducation(null);
    setFormData({ degree_en: "", degree_fr: "", institution: "", location: "", period: "", description_en: "", description_fr: "" });
    setFormErrors({});
    setFormLang(language === "fr" ? "fr" : "en");
    setIsModalOpen(true);
  };

  const openEditModal = (edu: Education) => {
    setEditingEducation(edu);
    setFormData({
      degree_en: edu.degree_en || "",
      degree_fr: edu.degree_fr || "",
      institution: edu.institution,
      location: edu.location || "",
      period: edu.period,
      description_en: edu.description_en || "",
      description_fr: edu.description_fr || "",
    });
    setFormErrors({});
    setFormLang(language === "fr" ? "fr" : "en");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formData.degree_en.trim()) errors.degree_en = "Required";
    if (!formData.degree_fr.trim()) errors.degree_fr = "Required";
    if (!formData.institution.trim()) errors.institution = "Required";
    if (!formData.period.trim()) errors.period = "Required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const hasEn = !!errors.degree_en;
      const hasFr = !!errors.degree_fr;
      if (formLang === "en" && !hasEn && hasFr) setFormLang("fr");
      if (formLang === "fr" && !hasFr && hasEn) setFormLang("en");
      return;
    }
    setFormErrors({});

    const eduData = {
      degree_en: formData.degree_en,
      degree_fr: formData.degree_fr,
      institution: formData.institution,
      location: formData.location,
      period: formData.period,
      description_en: formData.description_en,
      description_fr: formData.description_fr,
    };

    try {
      if (editingEducation) {
        await updateEducation(editingEducation.id, eduData);
      } else {
        await createEducation(eduData);
      }
      setIsModalOpen(false);
      await loadEducation();
    } catch (err) {
      console.error("Failed to save education:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDeleteEducation(id);
      setDeleteConfirm(null);
      await loadEducation();
    } catch (err) {
      console.error("Failed to delete education:", err);
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
          <h1 className="text-3xl font-bold text-white">{t("Education", "Formation")}</h1>
          <p className="text-[#B19EEF] mt-1">{t("Manage your educational background", "Gérez votre parcours scolaire")}</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-[#5227FF] text-white rounded-xl hover:bg-[#5227FF]/80 transition-colors shadow-lg shadow-[#5227FF]/30"
        >
          <Plus className="w-5 h-5" />
          {t("Add Education", "Ajouter une formation")}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B19EEF]" />
        <input
          type="text"
          placeholder={t("Search education...", "Rechercher une formation...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#0f0520] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
        />
      </div>

      {/* Education Cards */}
      <div className="space-y-4">
        {filteredEducation.map((edu) => (
          <div
            key={edu.id}
            className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl p-6 hover:border-[#FF9FFC]/50 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B19EEF] to-[#5227FF] flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{l(edu.degree_en, edu.degree_fr)}</h3>
                  <p className="text-[#FF9FFC]">{edu.institution}</p>
                  <p className="text-[#B19EEF] text-sm mt-1">{edu.period}</p>
                  {edu.location && <p className="text-[#B19EEF]/70 text-sm">{edu.location}</p>}
                  {l(edu.description_en, edu.description_fr) && <p className="text-[#B19EEF]/80 text-sm mt-3">{l(edu.description_en, edu.description_fr)}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(edu)}
                  className="p-2 rounded-lg bg-[#5227FF]/20 text-[#B19EEF] hover:bg-[#5227FF]/40 hover:text-white transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(edu.id)}
                  className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEducation.length === 0 && (
        <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl p-8 text-center text-[#B19EEF]">
          {t("No education records found.", "Aucune formation trouvée.")}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingEducation ? t("Edit Education", "Modifier la formation") : t("Add New Education", "Ajouter une nouvelle formation")}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg hover:bg-[#5227FF]/20 text-[#B19EEF] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* EN/FR Language Tabs */}
              <div className="flex gap-2">
                <button type="button" onClick={() => setFormLang("en")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${formLang === "en" ? "bg-[#5227FF] text-white" : "bg-[#5227FF]/20 text-[#B19EEF] hover:bg-[#5227FF]/30"}`}>
                  EN
                  {formErrors.degree_en && formLang !== "en" && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />}
                </button>
                <button type="button" onClick={() => setFormLang("fr")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${formLang === "fr" ? "bg-[#5227FF] text-white" : "bg-[#5227FF]/20 text-[#B19EEF] hover:bg-[#5227FF]/30"}`}>
                  FR
                  {formErrors.degree_fr && formLang !== "fr" && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />}
                </button>
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">{formLang === "en" ? "Degree" : "Diplôme"} <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={formData[`degree_${formLang}`]}
                  onChange={(e) => { setFormData({ ...formData, [`degree_${formLang}`]: e.target.value }); setFormErrors(prev => { const n = {...prev}; delete n[`degree_${formLang}`]; return n; }); }}
                  className={`w-full px-4 py-3 bg-[#0a0314] border ${formErrors[`degree_${formLang}`] ? "border-red-500/50" : "border-[#5227FF]/30"} rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]`}
                  placeholder={formLang === "en" ? "Bachelor of Science in..." : "Licence en..."}
                />
                {formErrors[`degree_${formLang}`] && <p className="text-red-400 text-xs mt-1">{formLang === "en" ? "This field is required" : "Ce champ est requis"}</p>}
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">{formLang === "en" ? "Institution" : "Établissement"} <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => { setFormData({ ...formData, institution: e.target.value }); setFormErrors(prev => { const n = {...prev}; delete n.institution; return n; }); }}
                  className={`w-full px-4 py-3 bg-[#0a0314] border ${formErrors.institution ? "border-red-500/50" : "border-[#5227FF]/30"} rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]`}
                  placeholder={formLang === "en" ? "University Name" : "Nom de l'université"}
                />
                {formErrors.institution && <p className="text-red-400 text-xs mt-1">{formLang === "en" ? "This field is required" : "Ce champ est requis"}</p>}
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">{formLang === "en" ? "Location" : "Localisation"}</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
                  placeholder={formLang === "en" ? "City, Country" : "Ville, Pays"}
                />
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">{formLang === "en" ? "Period" : "Période"} <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={formData.period}
                  onChange={(e) => { setFormData({ ...formData, period: e.target.value }); setFormErrors(prev => { const n = {...prev}; delete n.period; return n; }); }}
                  className={`w-full px-4 py-3 bg-[#0a0314] border ${formErrors.period ? "border-red-500/50" : "border-[#5227FF]/30"} rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]`}
                  placeholder="2020 - 2024"
                />
                {formErrors.period && <p className="text-red-400 text-xs mt-1">{formLang === "en" ? "This field is required" : "Ce champ est requis"}</p>}
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">Description</label>
                <textarea
                  value={formData[`description_${formLang}`]}
                  onChange={(e) => setFormData({ ...formData, [`description_${formLang}`]: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC] resize-none"
                  placeholder={formLang === "en" ? "Brief description of your studies..." : "Brève description de vos études..."}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-[#5227FF]/30 text-[#B19EEF] rounded-xl hover:bg-[#5227FF]/20 transition-colors"
                >
                  {formLang === "en" ? "Cancel" : "Annuler"}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#5227FF] text-white rounded-xl hover:bg-[#5227FF]/80 transition-colors"
                >
                  {editingEducation ? (formLang === "en" ? "Save Changes" : "Enregistrer") : (formLang === "en" ? "Add Education" : "Ajouter la formation")}
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
            <h2 className="text-xl font-semibold text-white mb-2">{t("Delete Education?", "Supprimer la formation ?")}</h2>
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
