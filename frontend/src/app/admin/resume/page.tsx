"use client";

import React from "react"

import { useState, useEffect, useCallback, useRef } from "react";
import { Upload, FileText, Trash2, Download, Loader2 } from "lucide-react";
import { fetchResumes, uploadResume, createResume, setActiveResume, deleteResume as apiDeleteResume, type ResumeFile } from "@/lib/api-client";

export default function ResumeManagement() {
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadResumes = useCallback(async () => {
    try {
      const res = await fetchResumes(true);
      setResumes(res.data);
    } catch (err) {
      console.error("Failed to load resumes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadResumes(); }, [loadResumes]);

  const handleUpload = async (file: File) => {
    if (!file.name.endsWith(".pdf")) return;
    setUploading(true);
    try {
      // Step 1: Upload file to DO Spaces
      const uploadRes = await uploadResume(file);
      // Step 2: Create DB record
      await createResume({
        filename: uploadRes.filename,
        fileUrl: uploadRes.fileUrl,
      });
      await loadResumes();
    } catch (err) {
      console.error("Failed to upload resume:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      await setActiveResume(id);
      await loadResumes();
    } catch (err) {
      console.error("Failed to set active resume:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDeleteResume(id);
      setDeleteConfirm(null);
      await loadResumes();
    } catch (err) {
      console.error("Failed to delete resume:", err);
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
        <h1 className="text-3xl font-bold text-white">Resume</h1>
        <p className="text-[#B19EEF] mt-1">Upload and manage your resume files</p>
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
          {uploading ? "Uploading..." : isDragging ? "Drop your file here" : "Upload Resume"}
        </h3>
        <p className="text-[#B19EEF] mb-4">Drag and drop your PDF file here, or click to browse</p>
        <label className="inline-block">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          <span className={`px-6 py-3 bg-[#5227FF] text-white rounded-xl hover:bg-[#5227FF]/80 transition-colors cursor-pointer inline-block ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
            Browse Files
          </span>
        </label>
        <p className="text-[#B19EEF]/60 text-sm mt-4">Supported format: PDF (Max 10MB)</p>
      </div>

      {/* Uploaded Resumes */}
      <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[#5227FF]/30">
          <h2 className="text-lg font-semibold text-white">Uploaded Resumes</h2>
        </div>
        <div className="divide-y divide-[#5227FF]/20">
          {resumes.map((resume) => (
            <div key={resume.id} className="p-4 flex items-center justify-between hover:bg-[#5227FF]/5">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${resume.isActive ? "bg-[#FF9FFC]/20" : "bg-[#5227FF]/20"}`}>
                  <FileText className={`w-6 h-6 ${resume.isActive ? "text-[#FF9FFC]" : "text-[#B19EEF]"}`} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-white font-medium">{resume.filename}</p>
                    {resume.isActive && (
                      <span className="px-2 py-0.5 text-xs bg-[#FF9FFC]/20 text-[#FF9FFC] rounded-full border border-[#FF9FFC]/30">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[#B19EEF] text-sm">
                    Uploaded {resume.createdAt ? new Date(resume.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#5227FF]/20 text-[#B19EEF] hover:bg-[#5227FF]/40 hover:text-white transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </a>
                {!resume.isActive && (
                  <button
                    onClick={() => handleSetActive(resume.id)}
                    className="px-3 py-2 text-sm bg-[#5227FF]/20 text-[#FF9FFC] rounded-lg hover:bg-[#5227FF]/40 transition-colors"
                  >
                    Set Active
                  </button>
                )}
                <button
                  onClick={() => setDeleteConfirm(resume.id)}
                  className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {resumes.length === 0 && (
          <div className="p-8 text-center text-[#B19EEF]">
            No resumes uploaded yet.
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
            <h2 className="text-xl font-semibold text-white mb-2">Delete Resume?</h2>
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
