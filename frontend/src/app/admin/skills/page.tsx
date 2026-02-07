"use client";

import React from "react"

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Pencil, Trash2, X, Search, Loader2, Upload } from "lucide-react";
import { fetchSkills as apiFetchSkills, createSkill, updateSkill, deleteSkill as apiDeleteSkill, uploadIcon, type Skill } from "@/lib/api-client";
import { useLanguage } from "@/lib/i18n";

export default function SkillsManagement() {
  const { t } = useLanguage();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({ name: "", icon: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSkills = useCallback(async () => {
    try {
      const res = await apiFetchSkills();
      setSkills(res.data);
    } catch (err) {
      console.error("Failed to load skills:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSkills(); }, [loadSkills]);

  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingSkill(null);
    setFormData({ name: "", icon: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({ name: skill.name, icon: skill.icon || "" });
    setIsModalOpen(true);
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadIcon(file);
      setFormData((prev) => ({ ...prev, icon: res.url }));
    } catch (err) {
      console.error("Failed to upload icon:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await updateSkill(editingSkill.id, formData);
      } else {
        await createSkill(formData);
      }
      setIsModalOpen(false);
      await loadSkills();
    } catch (err) {
      console.error("Failed to save skill:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDeleteSkill(id);
      setDeleteConfirm(null);
      await loadSkills();
    } catch (err) {
      console.error("Failed to delete skill:", err);
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
          <h1 className="text-3xl font-bold text-white">{t("Skills", "Compétences")}</h1>
          <p className="text-[#B19EEF] mt-1">{t("Manage your skills and expertise", "Gérez vos compétences et expertises")}</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-[#5227FF] text-white rounded-xl hover:bg-[#5227FF]/80 transition-colors shadow-lg shadow-[#5227FF]/30"
        >
          <Plus className="w-5 h-5" />
          {t("Add Skill", "Ajouter")}
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B19EEF]" />
          <input
            type="text"
            placeholder={t("Search skills...", "Rechercher...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#0f0520] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
          />
        </div>
      </div>

      {/* Skills Table */}
      <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#5227FF]/30">
                <th className="text-left px-6 py-4 text-[#B19EEF] font-medium">{t("Skill Name", "Nom")}</th>
                <th className="text-left px-6 py-4 text-[#B19EEF] font-medium">{t("Icon", "Icône")}</th>
                <th className="text-right px-6 py-4 text-[#B19EEF] font-medium">{t("Actions", "Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredSkills.map((skill) => (
                <tr key={skill.id} className="border-b border-[#5227FF]/10 hover:bg-[#5227FF]/5">
                  <td className="px-6 py-4 text-white font-medium">{skill.name}</td>
                  <td className="px-6 py-4">
                    {skill.icon ? (
                      <img src={skill.icon} alt={skill.name} className="w-6 h-6 object-contain" />
                    ) : (
                      <span className="text-[#B19EEF] text-sm">—</span>
                    )}
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
            {t("No skills found matching your criteria.", "Aucune compétence trouvée.")}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingSkill ? t("Edit Skill", "Modifier la compétence") : t("Add New Skill", "Nouvelle compétence")}
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
                <label className="block text-[#B19EEF] text-sm mb-2">{t("Skill Name", "Nom de la compétence")}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
                  placeholder={t("Enter skill name", "Nom de la compétence")}
                />
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">{t("Icon", "Icône")}</label>
                {formData.icon && (
                  <div className="mb-3 flex items-center gap-3 p-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl">
                    <img src={formData.icon} alt="Icon preview" className="w-8 h-8 object-contain" />
                    <span className="text-[#B19EEF] text-sm truncate flex-1">{formData.icon.split("/").pop()}</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: "" })}
                      className="p-1 rounded hover:bg-red-500/20 text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".svg,.png,.jpg,.jpeg,.webp"
                  onChange={handleIconUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-[#5227FF]/50 rounded-xl text-[#B19EEF] hover:border-[#FF9FFC] hover:text-[#FF9FFC] transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("Uploading...", "Téléchargement...")}
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      {formData.icon ? t("Replace Icon", "Remplacer l'icône") : t("Upload Icon", "Telecharger l'icone")}
                    </>
                  )}
                </button>
                <p className="text-[#B19EEF]/50 text-xs mt-1">{t("SVG, PNG, JPG, or WebP (max 1MB)", "SVG, PNG, JPG ou WebP (max 1 Mo)")}</p>
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
                  {editingSkill ? t("Save Changes", "Enregistrer") : t("Add Skill", "Ajouter")}
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
            <h2 className="text-xl font-semibold text-white mb-2">{t("Delete Skill?", "Supprimer la compétence?")}</h2>
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
