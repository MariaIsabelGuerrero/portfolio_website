"use client";

import React from "react"

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Pencil, Trash2, X, Search, Loader2,
  Dumbbell, Heart, Plane, Music, Gamepad2, Camera, Book, Palette,
  Bike, Mountain, Coffee, Utensils, Headphones, Tv, PenTool, Globe, Star
} from "lucide-react";
import { fetchHobbies as apiFetchHobbies, createHobby, updateHobby, deleteHobby as apiDeleteHobby, type Hobby } from "@/lib/api-client";
import { useLanguage } from "@/lib/i18n";

const iconMap: Record<string, React.ElementType> = {
  Dumbbell, Heart, Plane, Music, Gamepad2, Camera, Book, Palette,
  Bike, Mountain, Coffee, Utensils, Headphones, Tv, PenTool, Globe, Star,
};

const iconColorMap: Record<string, string> = {
  Dumbbell: "from-rose-500 to-pink-600",
  Heart: "from-pink-500 to-fuchsia-600",
  Plane: "from-cyan-500 to-teal-600",
  Music: "from-violet-500 to-purple-600",
  Gamepad2: "from-indigo-500 to-blue-600",
  Camera: "from-orange-500 to-red-600",
  Book: "from-emerald-500 to-green-600",
  Palette: "from-pink-500 to-fuchsia-600",
  Bike: "from-blue-500 to-indigo-600",
  Mountain: "from-emerald-500 to-green-600",
  Coffee: "from-orange-500 to-red-600",
  Utensils: "from-rose-500 to-pink-600",
  Headphones: "from-violet-500 to-purple-600",
  Tv: "from-indigo-500 to-blue-600",
  PenTool: "from-cyan-500 to-teal-600",
  Globe: "from-blue-500 to-indigo-600",
  Star: "from-orange-500 to-red-600",
};

const iconOptions = Object.keys(iconMap);

function getIcon(iconName: string): React.ElementType | null {
  return iconMap[iconName] || null;
}

export default function HobbiesManagement() {
  const { t, l, language } = useLanguage();
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHobby, setEditingHobby] = useState<Hobby | null>(null);
  const [formData, setFormData] = useState({ name_en: "", name_fr: "", description_en: "", description_fr: "", icon: "", color: "" });
  const [formLang, setFormLang] = useState<"en" | "fr">("en");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [iconError, setIconError] = useState(false);

  const loadHobbies = useCallback(async () => {
    try {
      const res = await apiFetchHobbies();
      setHobbies(res.data);
    } catch (err) {
      console.error("Failed to load hobbies:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadHobbies(); }, [loadHobbies]);

  const filteredHobbies = hobbies.filter((hobby) =>
    l(hobby.name_en, hobby.name_fr).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingHobby(null);
    setFormData({ name_en: "", name_fr: "", description_en: "", description_fr: "", icon: "", color: "" });
    setFormErrors({});
    setFormLang(language === "fr" ? "fr" : "en");
    setIsModalOpen(true);
  };

  const openEditModal = (hobby: Hobby) => {
    setEditingHobby(hobby);
    setFormData({ name_en: hobby.name_en || "", name_fr: hobby.name_fr || "", description_en: hobby.description_en || "", description_fr: hobby.description_fr || "", icon: hobby.icon || "", color: hobby.color || "" });
    setFormErrors({});
    setFormLang(language === "fr" ? "fr" : "en");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formData.name_en.trim()) errors.name_en = "Required";
    if (!formData.name_fr.trim()) errors.name_fr = "Required";
    if (!formData.description_en.trim()) errors.description_en = "Required";
    if (!formData.description_fr.trim()) errors.description_fr = "Required";
    if (!formData.icon) errors.icon = "Required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIconError(!!errors.icon);
      const hasEn = ["name_en", "description_en"].some(f => errors[f]);
      const hasFr = ["name_fr", "description_fr"].some(f => errors[f]);
      if (formLang === "en" && !hasEn && hasFr) setFormLang("fr");
      if (formLang === "fr" && !hasFr && hasEn) setFormLang("en");
      return;
    }
    setFormErrors({});
    setIconError(false);

    const dataToSave = {
      name_en: formData.name_en,
      name_fr: formData.name_fr,
      description_en: formData.description_en,
      description_fr: formData.description_fr,
      icon: formData.icon,
      color: iconColorMap[formData.icon] || "from-violet-500 to-purple-600",
    };
    try {
      if (editingHobby) {
        await updateHobby(editingHobby.id, dataToSave);
      } else {
        await createHobby(dataToSave);
      }
      setIsModalOpen(false);
      await loadHobbies();
    } catch (err) {
      console.error("Failed to save hobby:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDeleteHobby(id);
      setDeleteConfirm(null);
      await loadHobbies();
    } catch (err) {
      console.error("Failed to delete hobby:", err);
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
          <h1 className="text-3xl font-bold text-white">{t("Hobbies", "Loisirs")}</h1>
          <p className="text-[#B19EEF] mt-1">{t("Manage your hobbies and interests", "Gérez vos loisirs et centres d'intérêt")}</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-[#5227FF] text-white rounded-xl hover:bg-[#5227FF]/80 transition-colors shadow-lg shadow-[#5227FF]/30"
        >
          <Plus className="w-5 h-5" />
          {t("Add Hobby", "Ajouter un loisir")}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B19EEF]" />
        <input
          type="text"
          placeholder={t("Search hobbies...", "Rechercher des loisirs...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#0f0520] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
        />
      </div>

      {/* Hobbies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredHobbies.map((hobby) => {
          const Icon = getIcon(hobby.icon);
          const color = hobby.color || "from-violet-500 to-purple-600";
          return (
            <div
              key={hobby.id}
              className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl p-6 hover:border-[#FF9FFC]/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                  {Icon && <Icon className="w-6 h-6 text-white" />}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(hobby)}
                    className="p-2 rounded-lg bg-[#5227FF]/20 text-[#B19EEF] hover:bg-[#5227FF]/40 hover:text-white transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(hobby.id)}
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white">{l(hobby.name_en, hobby.name_fr)}</h3>
              {l(hobby.description_en, hobby.description_fr) && <p className="text-[#B19EEF]/70 text-sm mt-1">{l(hobby.description_en, hobby.description_fr)}</p>}
            </div>
          );
        })}
      </div>

      {filteredHobbies.length === 0 && (
        <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl p-8 text-center text-[#B19EEF]">
          {t("No hobbies found.", "Aucun loisir trouvé.")}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingHobby ? t("Edit Hobby", "Modifier le loisir") : t("Add New Hobby", "Ajouter un nouveau loisir")}
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
                  {(formErrors.name_en || formErrors.description_en) && formLang !== "en" && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />}
                </button>
                <button type="button" onClick={() => setFormLang("fr")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${formLang === "fr" ? "bg-[#5227FF] text-white" : "bg-[#5227FF]/20 text-[#B19EEF] hover:bg-[#5227FF]/30"}`}>
                  FR
                  {(formErrors.name_fr || formErrors.description_fr) && formLang !== "fr" && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />}
                </button>
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">{formLang === "en" ? "Hobby Name" : "Nom du loisir"} <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={formData[`name_${formLang}`]}
                  onChange={(e) => { setFormData({ ...formData, [`name_${formLang}`]: e.target.value }); setFormErrors(prev => { const n = {...prev}; delete n[`name_${formLang}`]; return n; }); }}
                  className={`w-full px-4 py-3 bg-[#0a0314] border ${formErrors[`name_${formLang}`] ? "border-red-500/50" : "border-[#5227FF]/30"} rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]`}
                  placeholder={formLang === "en" ? "Enter hobby name..." : "Entrez le nom du loisir..."}
                />
                {formErrors[`name_${formLang}`] && <p className="text-red-400 text-xs mt-1">{formLang === "en" ? "This field is required" : "Ce champ est requis"}</p>}
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">Description <span className="text-red-400">*</span></label>
                <textarea
                  value={formData[`description_${formLang}`]}
                  onChange={(e) => { setFormData({ ...formData, [`description_${formLang}`]: e.target.value }); setFormErrors(prev => { const n = {...prev}; delete n[`description_${formLang}`]; return n; }); }}
                  rows={2}
                  className={`w-full px-4 py-3 bg-[#0a0314] border ${formErrors[`description_${formLang}`] ? "border-red-500/50" : "border-[#5227FF]/30"} rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC] resize-none`}
                  placeholder={formLang === "en" ? "Brief description of this hobby..." : "Brève description de ce loisir..."}
                />
                {formErrors[`description_${formLang}`] && <p className="text-red-400 text-xs mt-1">{formLang === "en" ? "This field is required" : "Ce champ est requis"}</p>}
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">
                  {formLang === "en" ? "Icon" : "Icône"} <span className="text-red-400">*</span>
                </label>
                {iconError && (
                  <p className="text-red-400 text-sm mb-2">{formLang === "en" ? "Please select an icon" : "Veuillez sélectionner une icône"}</p>
                )}
                <div className="grid grid-cols-6 gap-2">
                  {iconOptions.map((name) => {
                    const IconComp = iconMap[name];
                    const isSelected = formData.icon === name;
                    const iconColor = iconColorMap[name] || "from-violet-500 to-purple-600";
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => { setIconError(false); setFormData({ ...formData, icon: name, color: iconColor }); }}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                          isSelected
                            ? "border-[#FF9FFC] bg-[#5227FF]/30 text-white"
                            : "border-[#5227FF]/30 text-[#B19EEF]/60 hover:border-[#B19EEF]/50 hover:text-white"
                        }`}
                        title={name}
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${iconColor} flex items-center justify-center`}>
                          <IconComp className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[10px] truncate w-full text-center">{name}</span>
                      </button>
                    );
                  })}
                </div>
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
                  {editingHobby ? (formLang === "en" ? "Save Changes" : "Enregistrer") : (formLang === "en" ? "Add Hobby" : "Ajouter le loisir")}
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
            <h2 className="text-xl font-semibold text-white mb-2">{t("Delete Hobby?", "Supprimer le loisir ?")}</h2>
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
