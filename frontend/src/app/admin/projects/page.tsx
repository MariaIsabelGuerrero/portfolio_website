"use client";

import React from "react"

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Pencil, Trash2, X, Search, ExternalLink, Github, Loader2, Upload } from "lucide-react";
import { fetchProjects as apiFetchProjects, createProject, updateProject, deleteProject as apiDeleteProject, uploadProjectImage, type Project } from "@/lib/api-client";
import { useLanguage } from "@/lib/i18n";

export default function ProjectsManagement() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    img: "",
    technologies: "",
    github: "",
    live: "",
    keyFeatures: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadProjects = useCallback(async () => {
    try {
      const res = await apiFetchProjects();
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const filteredProjects = projects.filter((project) => {
    return project.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      img: "",
      technologies: "",
      github: "",
      live: "",
      keyFeatures: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      img: project.img || "",
      technologies: project.technologies.join(", "),
      github: project.github,
      live: project.live,
      keyFeatures: (project.keyFeatures || []).join("\n"),
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadProjectImage(file);
      setFormData((prev) => ({ ...prev, img: res.url }));
    } catch (err) {
      console.error("Failed to upload project image:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      title: formData.title,
      description: formData.description,
      img: formData.img,
      technologies: formData.technologies.split(",").map((t) => t.trim()).filter(Boolean),
      github: formData.github,
      live: formData.live,
      keyFeatures: formData.keyFeatures.split("\n").map((f) => f.trim()).filter(Boolean),
    };

    try {
      if (editingProject) {
        await updateProject(editingProject.id, projectData);
      } else {
        await createProject(projectData);
      }
      setIsModalOpen(false);
      await loadProjects();
    } catch (err) {
      console.error("Failed to save project:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDeleteProject(id);
      setDeleteConfirm(null);
      await loadProjects();
    } catch (err) {
      console.error("Failed to delete project:", err);
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
          <h1 className="text-3xl font-bold text-white">{t("Projects", "Projets")}</h1>
          <p className="text-[#B19EEF] mt-1">{t("Manage your portfolio projects", "Gérez vos projets de portfolio")}</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-[#5227FF] text-white rounded-xl hover:bg-[#5227FF]/80 transition-colors shadow-lg shadow-[#5227FF]/30"
        >
          <Plus className="w-5 h-5" />
          {t("Add Project", "Ajouter un projet")}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B19EEF]" />
          <input
            type="text"
            placeholder={t("Search projects...", "Rechercher des projets...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#0f0520] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl p-6 hover:border-[#FF9FFC]/50 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                </div>
                <p className="text-[#B19EEF] text-sm line-clamp-2">{project.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs bg-[#5227FF]/20 text-[#B19EEF] rounded-full border border-[#5227FF]/30"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#5227FF]/20">
              <div className="flex items-center gap-3">
                <a
                  href={project.github}
                  className="p-2 rounded-lg bg-[#5227FF]/20 text-[#B19EEF] hover:bg-[#5227FF]/40 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={project.live}
                  className="p-2 rounded-lg bg-[#5227FF]/20 text-[#B19EEF] hover:bg-[#5227FF]/40 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(project)}
                  className="p-2 rounded-lg bg-[#5227FF]/20 text-[#B19EEF] hover:bg-[#5227FF]/40 hover:text-white transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(project.id)}
                  className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl p-8 text-center text-[#B19EEF]">
          {t("No projects found matching your criteria.", "Aucun projet trouvé correspondant à vos critères.")}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingProject ? t("Edit Project", "Modifier le projet") : t("Add New Project", "Ajouter un nouveau projet")}
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
                <label className="block text-[#B19EEF] text-sm mb-2">{t("Project Title", "Titre du projet")}</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
                  placeholder={t("Enter project title", "Entrez le titre du projet")}
                />
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">{t("Description", "Description")}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC] resize-none"
                  placeholder={t("Describe your project", "Décrivez votre projet")}
                />
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">{t("Project Image", "Image du projet")}</label>
                {formData.img && (
                  <div className="mb-3 flex items-center gap-3 p-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl">
                    <img src={formData.img} alt="Project preview" className="w-16 h-10 object-cover rounded" />
                    <span className="text-[#B19EEF] text-sm truncate flex-1">{formData.img.split("/").pop()}</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, img: "" })}
                      className="p-1 rounded hover:bg-red-500/20 text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,.svg"
                  onChange={handleImageUpload}
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
                      {formData.img ? t("Replace Image", "Remplacer l'image") : t("Upload Image", "Télécharger une image")}
                    </>
                  )}
                </button>
                <p className="text-[#B19EEF]/50 text-xs mt-1">{t("PNG, JPG, WebP, or SVG (max 5MB)", "PNG, JPG, WebP ou SVG (max 5 Mo)")}</p>
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">{t("Technologies (comma-separated)", "Technologies (séparées par des virgules)")}</label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
                  placeholder="React, TypeScript, Node.js"
                />
              </div>
              <div>
                <label className="block text-[#B19EEF] text-sm mb-2">{t("Key Features (one per line)", "Fonctionnalités clés (une par ligne)")}</label>
                <textarea
                  value={formData.keyFeatures}
                  onChange={(e) => setFormData({ ...formData, keyFeatures: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC] resize-none"
                  placeholder={t("Enter each feature on a new line", "Entrez chaque fonctionnalité sur une nouvelle ligne")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#B19EEF] text-sm mb-2">{t("GitHub URL", "URL GitHub")}</label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="block text-[#B19EEF] text-sm mb-2">{t("Live URL", "URL en direct")}</label>
                  <input
                    type="url"
                    value={formData.live}
                    onChange={(e) => setFormData({ ...formData, live: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
                    placeholder="https://..."
                  />
                </div>
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
                  {editingProject ? t("Save Changes", "Enregistrer") : t("Add Project", "Ajouter le projet")}
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
            <h2 className="text-xl font-semibold text-white mb-2">{t("Delete Project?", "Supprimer le projet ?")}</h2>
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
