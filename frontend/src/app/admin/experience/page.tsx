"use client";

import React from "react"

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Search, Briefcase, MapPin, Loader2 } from "lucide-react";
import { fetchExperience as apiFetchExperience, createExperience, updateExperience, deleteExperience as apiDeleteExperience, type Experience } from "@/lib/api-client";
import { useLanguage } from "@/lib/i18n";

export default function ExperienceManagement() {
  const { t, l, la, language } = useLanguage();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [formData, setFormData] = useState({
    title_en: "",
    title_fr: "",
    company: "",
    location: "",
    period: "",
    type: "",
    description_en: "",
    description_fr: "",
    responsibilities_en: "",
    responsibilities_fr: "",
  });
  const [formLang, setFormLang] = useState<"en" | "fr">("en");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const requiredFields = ["title_en", "title_fr", "company", "period"];

  const validateField = (name: string, value: string): string | null => {
    if (requiredFields.includes(name) && !value.trim()) return "Required";
    return null;
  };

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setFormErrors(prev => {
        if (error) return { ...prev, [name]: error };
        const n = { ...prev }; delete n[name]; return n;
      });
    }
  };

  const handleFieldBlur = (name: string, value: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setFormErrors(prev => {
      if (error) return { ...prev, [name]: error };
      const n = { ...prev }; delete n[name]; return n;
    });
  };

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
    l(exp.title_en, exp.title_fr).toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingExperience(null);
    setFormData({ title_en: "", title_fr: "", company: "", location: "", period: "", type: "", description_en: "", description_fr: "", responsibilities_en: "", responsibilities_fr: "" });
    setFormErrors({});
    setTouched({});
    setFormLang(language === "fr" ? "fr" : "en");
    setIsModalOpen(true);
  };

  const openEditModal = (exp: Experience) => {
    setEditingExperience(exp);
    setFormData({
      title_en: exp.title_en || "",
      title_fr: exp.title_fr || "",
      company: exp.company,
      location: exp.location || "",
      period: exp.period,
      type: exp.type || "",
      description_en: exp.description_en || "",
      description_fr: exp.description_fr || "",
      responsibilities_en: (exp.responsibilities_en || []).join("\n"),
      responsibilities_fr: (exp.responsibilities_fr || []).join("\n"),
    });
    setFormErrors({});
    setTouched({});
    setFormLang(language === "fr" ? "fr" : "en");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(Object.fromEntries(requiredFields.map(f => [f, true])));
    const errors: Record<string, string> = {};
    if (!formData.title_en.trim()) errors.title_en = "Required";
    if (!formData.title_fr.trim()) errors.title_fr = "Required";
    if (!formData.company.trim()) errors.company = "Required";
    if (!formData.period.trim()) errors.period = "Required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const hasEn = !!errors.title_en;
      const hasFr = !!errors.title_fr;
      if (formLang === "en" && !hasEn && hasFr) setFormLang("fr");
      if (formLang === "fr" && !hasFr && hasEn) setFormLang("en");
      return;
    }
    setFormErrors({});

    const expData = {
      title_en: formData.title_en,
      title_fr: formData.title_fr,
      company: formData.company,
      location: formData.location,
      period: formData.period,
      type: formData.type,
      description_en: formData.description_en,
      description_fr: formData.description_fr,
      responsibilities_en: formData.responsibilities_en.split("\n").filter(Boolean),
      responsibilities_fr: formData.responsibilities_fr.split("\n").filter(Boolean),
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
                  <h3 className="text-xl font-semibold text-white">{l(exp.title_en, exp.title_fr)}</h3>
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
                  {l(exp.description_en, exp.description_fr) && <p className="text-[#B19EEF]/80 text-sm mt-2">{l(exp.description_en, exp.description_fr)}</p>}
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
              {la(exp.responsibilities_en || [], exp.responsibilities_fr || []).map((resp, idx) => (
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
              {/* EN/FR Language Tabs */}
              <div className="flex gap-2">
                <button type="button" onClick={() => setFormLang("en")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${formLang === "en" ? "bg-[#5227FF] text-white" : "bg-[#5227FF]/20 text-[#B19EEF] hover:bg-[#5227FF]/30"}`}>
                  EN
                  {formErrors.title_en && formLang !== "en" && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />}
                </button>
                <button type="button" onClick={() => setFormLang("fr")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${formLang === "fr" ? "bg-[#5227FF] text-white" : "bg-[#5227FF]/20 text-[#B19EEF] hover:bg-[#5227FF]/30"}`}>
                  FR
                  {formErrors.title_fr && formLang !== "fr" && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />}
                </button>
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">{formLang === "en" ? "Job Title" : "Intitulé du poste"} <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={formData[`title_${formLang}`]}
                  onChange={(e) => handleFieldChange(`title_${formLang}`, e.target.value)}
                  onBlur={(e) => handleFieldBlur(`title_${formLang}`, e.target.value)}
                  className={`w-full px-4 py-3 bg-[#0a0314] border ${formErrors[`title_${formLang}`] ? "border-red-500/50" : "border-[#5227FF]/30"} rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]`}
                  placeholder={formLang === "en" ? "Software Developer" : "Développeur logiciel"}
                />
                {formErrors[`title_${formLang}`] && <p className="text-red-400 text-xs mt-1">{formLang === "en" ? "This field is required" : "Ce champ est requis"}</p>}
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">{formLang === "en" ? "Company" : "Entreprise"} <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleFieldChange("company", e.target.value)}
                  onBlur={(e) => handleFieldBlur("company", e.target.value)}
                  className={`w-full px-4 py-3 bg-[#0a0314] border ${formErrors.company ? "border-red-500/50" : "border-[#5227FF]/30"} rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]`}
                  placeholder={formLang === "en" ? "Company Name" : "Nom de l'entreprise"}
                />
                {formErrors.company && <p className="text-red-400 text-xs mt-1">{formLang === "en" ? "This field is required" : "Ce champ est requis"}</p>}
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">{formLang === "en" ? "Location" : "Localisation"}</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
                  placeholder={formLang === "en" ? "Remote, City, Country" : "Télétravail, Ville, Pays"}
                />
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">{formLang === "en" ? "Period" : "Période"} <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={formData.period}
                  onChange={(e) => handleFieldChange("period", e.target.value)}
                  onBlur={(e) => handleFieldBlur("period", e.target.value)}
                  className={`w-full px-4 py-3 bg-[#0a0314] border ${formErrors.period ? "border-red-500/50" : "border-[#5227FF]/30"} rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]`}
                  placeholder={formLang === "en" ? "2022 - Present" : "2022 - Présent"}
                />
                {formErrors.period && <p className="text-red-400 text-xs mt-1">{formLang === "en" ? "This field is required" : "Ce champ est requis"}</p>}
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">{formLang === "en" ? "Employment Type" : "Type d'emploi"}</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white focus:outline-none focus:border-[#FF9FFC]"
                >
                  <option value="">{formLang === "en" ? "Select type" : "Sélectionner le type"}</option>
                  <option value="Full-time">{formLang === "en" ? "Full-time" : "Temps plein"}</option>
                  <option value="Part-time">{formLang === "en" ? "Part-time" : "Temps partiel"}</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">{formLang === "en" ? "Internship" : "Stage"}</option>
                  <option value="Contract">{formLang === "en" ? "Contract" : "Contrat"}</option>
                </select>
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">Description</label>
                <textarea
                  value={formData[`description_${formLang}`]}
                  onChange={(e) => setFormData({ ...formData, [`description_${formLang}`]: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC] resize-none"
                  placeholder={formLang === "en" ? "Brief overview of your role..." : "Bref aperçu de votre rôle..."}
                />
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">{formLang === "en" ? "Responsibilities (one per line)" : "Responsabilités (une par ligne)"}</label>
                <textarea
                  value={formData[`responsibilities_${formLang}`]}
                  onChange={(e) => setFormData({ ...formData, [`responsibilities_${formLang}`]: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC] resize-none"
                  placeholder={formLang === "en" ? "Developed web applications\nCollaborated with teams\n..." : "Développé des applications web\nCollaboré avec des équipes\n..."}
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
                  {editingExperience ? (formLang === "en" ? "Save Changes" : "Enregistrer") : (formLang === "en" ? "Add Experience" : "Ajouter l'expérience")}
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
