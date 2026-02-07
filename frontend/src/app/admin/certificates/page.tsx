"use client";

import React from "react"

import { useState, useEffect, useCallback, useRef } from "react";
import { Upload, Award, Trash2, Download, Loader2, FileText } from "lucide-react";
import { fetchCertificates, uploadCertificate, createCertificate, deleteCertificate as apiDeleteCertificate, type CertificateFile } from "@/lib/api-client";
import { useLanguage } from "@/lib/i18n";

export default function CertificateManagement() {
  const { t } = useLanguage();
  const [certificates, setCertificates] = useState<CertificateFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadCertificates = useCallback(async () => {
    try {
      const res = await fetchCertificates();
      setCertificates(res.data);
    } catch (err) {
      console.error("Failed to load certificates:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCertificates(); }, [loadCertificates]);

  const handleUpload = async (file: File) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError(t("Only PDF, JPG, PNG, and WEBP files are allowed", "Seuls les fichiers PDF, JPG, PNG et WEBP sont autorisés"));
      return;
    }
    if (!uploadTitle.trim()) {
      setUploadError(t("Please enter a title for the certificate", "Veuillez entrer un titre pour le certificat"));
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      // Step 1: Upload file to DO Spaces
      const uploadRes = await uploadCertificate(file);
      // Step 2: Create DB record
      await createCertificate({
        title: uploadTitle.trim(),
        fileUrl: uploadRes.fileUrl,
        fileType: uploadRes.fileType,
      });
      setUploadTitle("");
      await loadCertificates();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      console.error("Failed to upload certificate:", message);
      setUploadError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDeleteCertificate(id);
      setDeleteConfirm(null);
      await loadCertificates();
    } catch (err) {
      console.error("Failed to delete certificate:", err);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
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
      <div>
        <h1 className="text-3xl font-bold text-white">{t("Certificates", "Certificats")}</h1>
        <p className="text-[#B19EEF] mt-1">{t("Upload and manage your certificates", "Téléchargez et gérez vos certificats")}</p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-2xl p-12 text-center transition-all
          ${isDragging
            ? "border-[#FF9FFC] bg-[#FF9FFC]/10"
            : "border-[#5227FF]/50 bg-[#0f0520] hover:border-[#5227FF]"
          }
        `}
      >
        <div className="w-16 h-16 rounded-full bg-[#5227FF]/20 flex items-center justify-center mx-auto mb-4">
          {uploading ? (
            <Loader2 className="w-8 h-8 text-[#FF9FFC] animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-[#FF9FFC]" />
          )}
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {uploading ? t("Uploading...", "Téléchargement...") : isDragging ? t("Drop your file here", "Déposez votre fichier ici") : t("Upload Certificate", "Télécharger un certificat")}
        </h3>
        <p className="text-[#B19EEF] mb-4">{t("Drag and drop your file here, or click to browse", "Glissez-déposez votre fichier ici, ou cliquez pour parcourir")}</p>
        <div className="flex items-center justify-center gap-3 mb-4">
          <label className="text-[#B19EEF] text-sm">{t("Title:", "Titre :")}</label>
          <input
            type="text"
            value={uploadTitle}
            onChange={(e) => setUploadTitle(e.target.value)}
            placeholder={t("Certificate title", "Titre du certificat")}
            className="px-4 py-2 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white focus:outline-none focus:border-[#FF9FFC] w-64"
          />
        </div>
        {uploadError && (
          <div className="mb-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 text-sm">
            {t("Error:", "Erreur :")} {uploadError}
          </div>
        )}
        <label className="inline-block">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          <span className={`px-6 py-3 bg-[#5227FF] text-white rounded-xl hover:bg-[#5227FF]/80 transition-colors cursor-pointer inline-block ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
            {t("Browse Files", "Parcourir les fichiers")}
          </span>
        </label>
        <p className="text-[#B19EEF]/60 text-sm mt-4">{t("Supported formats: PDF, JPG, PNG, WEBP (Max 10MB)", "Formats supportés: PDF, JPG, PNG, WEBP (Max 10 Mo)")}</p>
      </div>

      {/* Uploaded Certificates */}
      <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[#5227FF]/30">
          <h2 className="text-lg font-semibold text-white">{t("Uploaded Certificates", "Certificats téléchargés")}</h2>
        </div>
        <div className="divide-y divide-[#5227FF]/20">
          {certificates.map((cert) => (
            <div key={cert.id} className="p-4 flex items-center justify-between hover:bg-[#5227FF]/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#5227FF]/20 flex items-center justify-center overflow-hidden">
                  {cert.fileType === "image" ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={cert.fileUrl} alt={cert.title} className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="w-6 h-6 text-[#B19EEF]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-white font-medium">{cert.title}</p>
                    <span className="px-2 py-0.5 text-xs bg-[#5227FF]/20 text-[#B19EEF] rounded-full border border-[#5227FF]/30">
                      {cert.fileType === "pdf" ? "PDF" : "IMG"}
                    </span>
                  </div>
                  <p className="text-[#B19EEF] text-sm">
                    {t("Uploaded", "Téléchargé")} {cert.createdAt ? new Date(cert.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={cert.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#5227FF]/20 text-[#B19EEF] hover:bg-[#5227FF]/40 hover:text-white transition-colors"
                  title={t("Download", "Télécharger")}
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setDeleteConfirm(cert.id)}
                  className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {certificates.length === 0 && (
          <div className="p-8 text-center text-[#B19EEF]">
            {t("No certificates uploaded yet.", "Aucun certificat téléchargé pour le moment.")}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">{t("Delete Certificate?", "Supprimer le certificat ?")}</h2>
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
