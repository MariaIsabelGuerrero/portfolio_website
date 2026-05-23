"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Save,
  Loader2,
  User,
  Globe,
  Image as ImageIcon,
  Sparkles,
  Calendar,
  Tag,
} from "lucide-react";
import {
  fetchProfile,
  updateProfile,
  type ProfileInfo,
} from "@/lib/api-client";
import { useLanguage } from "@/lib/i18n";

const emptyProfile: ProfileInfo = {
  id: "default",
  fullName: "",
  shortName: "",
  siteUrl: "",
  profileImage: "",
  heroBadge_en: "",
  heroBadge_fr: "",
  heroTitleLine1_en: "",
  heroTitleLine1_fr: "",
  heroTitleLine2_en: "",
  heroTitleLine2_fr: "",
  heroDescription_en: "",
  heroDescription_fr: "",
  typingWords_en: [],
  typingWords_fr: [],
  techStack: [],
  bio_en: "",
  bio_fr: "",
  quote_en: "",
  quote_fr: "",
  experienceSince: null,
  metaTitle: "",
  metaDescription: "",
};

function arrayToString(arr: string[] | undefined): string {
  return (arr || []).join(", ");
}

function stringToArray(s: string): string[] {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function ProfileManagement() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<ProfileInfo>(emptyProfile);
  const [typingWordsEnInput, setTypingWordsEnInput] = useState("");
  const [typingWordsFrInput, setTypingWordsFrInput] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadProfile = useCallback(async () => {
    try {
      const res = await fetchProfile();
      const data = { ...emptyProfile, ...res.data };
      setProfile(data);
      setTypingWordsEnInput(arrayToString(data.typingWords_en));
      setTypingWordsFrInput(arrayToString(data.typingWords_fr));
      setTechStackInput(arrayToString(data.techStack));
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const setField = <K extends keyof ProfileInfo>(key: K, value: ProfileInfo[K]) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!profile.fullName.trim()) next.fullName = "Required";
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});

    setIsSaving(true);
    try {
      const payload: Partial<ProfileInfo> = {
        ...profile,
        typingWords_en: stringToArray(typingWordsEnInput),
        typingWords_fr: stringToArray(typingWordsFrInput),
        techStack: stringToArray(techStackInput),
      };
      const res = await updateProfile(payload);
      const data = { ...emptyProfile, ...res.data };
      setProfile(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#5227FF] animate-spin" />
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]";
  const labelClass = "block text-[#B19EEF] text-sm mb-2";
  const sectionClass =
    "bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl p-6 space-y-4";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {t("Profile & Site Content", "Profil & contenu du site")}
          </h1>
          <p className="text-[#B19EEF] mt-1">
            {t(
              "Manage all site-wide personal information and copy",
              "Gérez toutes les informations personnelles et le contenu du site"
            )}
          </p>
        </div>
        {saved && (
          <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl border border-green-500/30">
            {t("Changes saved successfully!", "Modifications enregistrées avec succès !")}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identity */}
        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            {t("Identity", "Identité")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                {t("Full name", "Nom complet")} <span className="text-red-400">*</span>
              </label>
              <input
                value={profile.fullName}
                onChange={(e) => setField("fullName", e.target.value)}
                className={inputClass}
                placeholder="Maria Isabel Guerrero"
              />
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1">
                  {t("This field is required", "Ce champ est requis")}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>
                {t("Short name (logo)", "Nom court (logo)")}
              </label>
              <input
                value={profile.shortName}
                onChange={(e) => setField("shortName", e.target.value)}
                className={inputClass}
                placeholder="Maria"
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {t("Site URL", "URL du site")}
                </span>
              </label>
              <input
                value={profile.siteUrl}
                onChange={(e) => setField("siteUrl", e.target.value)}
                className={inputClass}
                placeholder="https://www.example.com"
              />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            {t("Media", "Médias")}
          </h2>
          <div>
            <label className={labelClass}>
              {t("Profile photo", "Photo de profil")}
            </label>
            <p className="text-[#B19EEF]/80 text-xs mb-2 leading-relaxed">
              {t(
                "Keep the file in frontend/public/Photo.jpeg and use /Photo.jpeg here.",
                "Gardez le fichier dans frontend/public/Photo.jpeg et mettez /Photo.jpeg ici."
              )}
            </p>
            <input
              value={profile.profileImage}
              onChange={(e) => setField("profileImage", e.target.value)}
              className={inputClass}
              placeholder="/Photo.jpeg"
            />
          </div>
        </div>

        {/* Hero copy */}
        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            {t("Hero Section", "Section d'accueil")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t("Badge (EN)", "Badge (EN)")}</label>
              <input
                value={profile.heroBadge_en}
                onChange={(e) => setField("heroBadge_en", e.target.value)}
                className={inputClass}
                placeholder="Ready to Innovate"
              />
            </div>
            <div>
              <label className={labelClass}>{t("Badge (FR)", "Badge (FR)")}</label>
              <input
                value={profile.heroBadge_fr}
                onChange={(e) => setField("heroBadge_fr", e.target.value)}
                className={inputClass}
                placeholder="Prête à innover"
              />
            </div>
            <div>
              <label className={labelClass}>{t("Title line 1 (EN)", "Titre ligne 1 (EN)")}</label>
              <input
                value={profile.heroTitleLine1_en}
                onChange={(e) => setField("heroTitleLine1_en", e.target.value)}
                className={inputClass}
                placeholder="Full Stack"
              />
            </div>
            <div>
              <label className={labelClass}>{t("Title line 1 (FR)", "Titre ligne 1 (FR)")}</label>
              <input
                value={profile.heroTitleLine1_fr}
                onChange={(e) => setField("heroTitleLine1_fr", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t("Title line 2 (EN)", "Titre ligne 2 (EN)")}</label>
              <input
                value={profile.heroTitleLine2_en}
                onChange={(e) => setField("heroTitleLine2_en", e.target.value)}
                className={inputClass}
                placeholder="Developer"
              />
            </div>
            <div>
              <label className={labelClass}>{t("Title line 2 (FR)", "Titre ligne 2 (FR)")}</label>
              <input
                value={profile.heroTitleLine2_fr}
                onChange={(e) => setField("heroTitleLine2_fr", e.target.value)}
                className={inputClass}
                placeholder="Développeuse"
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>{t("Description (EN)", "Description (EN)")}</label>
              <textarea
                value={profile.heroDescription_en}
                onChange={(e) => setField("heroDescription_en", e.target.value)}
                className={`${inputClass} h-24 resize-none`}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>{t("Description (FR)", "Description (FR)")}</label>
              <textarea
                value={profile.heroDescription_fr}
                onChange={(e) => setField("heroDescription_fr", e.target.value)}
                className={`${inputClass} h-24 resize-none`}
              />
            </div>
            <div>
              <label className={labelClass}>
                {t("Typing words EN (comma separated)", "Mots du typing EN (séparés par virgule)")}
              </label>
              <input
                value={typingWordsEnInput}
                onChange={(e) => setTypingWordsEnInput(e.target.value)}
                className={inputClass}
                placeholder="Computer Science Student, Tech Enthusiast"
              />
            </div>
            <div>
              <label className={labelClass}>
                {t("Typing words FR (comma separated)", "Mots du typing FR (séparés par virgule)")}
              </label>
              <input
                value={typingWordsFrInput}
                onChange={(e) => setTypingWordsFrInput(e.target.value)}
                className={inputClass}
                placeholder="Étudiante en informatique, Passionnée de technologie"
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {t("Tech stack (comma separated)", "Technologies (séparées par virgule)")}
                </span>
              </label>
              <input
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                className={inputClass}
                placeholder="React, Javascript, Node.js, Tailwind"
              />
            </div>
          </div>
        </div>

        {/* Bio + quote */}
        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-white">{t("About Section", "À propos")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t("Bio (EN)", "Bio (EN)")}</label>
              <textarea
                value={profile.bio_en}
                onChange={(e) => setField("bio_en", e.target.value)}
                className={`${inputClass} h-32 resize-none`}
              />
            </div>
            <div>
              <label className={labelClass}>{t("Bio (FR)", "Bio (FR)")}</label>
              <textarea
                value={profile.bio_fr}
                onChange={(e) => setField("bio_fr", e.target.value)}
                className={`${inputClass} h-32 resize-none`}
              />
            </div>
            <div>
              <label className={labelClass}>{t("Quote (EN)", "Citation (EN)")}</label>
              <textarea
                value={profile.quote_en}
                onChange={(e) => setField("quote_en", e.target.value)}
                className={`${inputClass} h-24 resize-none`}
              />
            </div>
            <div>
              <label className={labelClass}>{t("Quote (FR)", "Citation (FR)")}</label>
              <textarea
                value={profile.quote_fr}
                onChange={(e) => setField("quote_fr", e.target.value)}
                className={`${inputClass} h-24 resize-none`}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t(
                    "Experience start date (used for 'years of experience')",
                    "Date de début d'expérience (pour 'années d'expérience')"
                  )}
                </span>
              </label>
              <input
                type="date"
                value={
                  profile.experienceSince
                    ? new Date(profile.experienceSince).toISOString().slice(0, 10)
                    : ""
                }
                onChange={(e) =>
                  setField("experienceSince", e.target.value ? e.target.value : null)
                }
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-white">{t("SEO Metadata", "Métadonnées SEO")}</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>{t("Meta title", "Titre meta")}</label>
              <input
                value={profile.metaTitle}
                onChange={(e) => setField("metaTitle", e.target.value)}
                className={inputClass}
                placeholder="Maria Isabel Guerrero | Full Stack Developer"
              />
            </div>
            <div>
              <label className={labelClass}>{t("Meta description", "Description meta")}</label>
              <textarea
                value={profile.metaDescription}
                onChange={(e) => setField("metaDescription", e.target.value)}
                className={`${inputClass} h-20 resize-none`}
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-[#5227FF] text-white rounded-xl hover:bg-[#5227FF]/80 transition-colors shadow-lg shadow-[#5227FF]/30 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isSaving ? t("Saving...", "Enregistrement...") : t("Save Changes", "Enregistrer")}
          </button>
        </div>
      </form>
    </div>
  );
}
