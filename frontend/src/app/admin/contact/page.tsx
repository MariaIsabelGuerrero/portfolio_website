"use client";

import React from "react"

import { useState, useEffect, useCallback } from "react";
import { Save, Mail, Phone, MapPin, Github, Linkedin, Twitter, Loader2 } from "lucide-react";
import { fetchContact as apiFetchContact, updateContact as apiUpdateContact, type ContactInfo } from "@/lib/api-client";

export default function ContactManagement() {
  const [contact, setContact] = useState<ContactInfo>({ email: "", phone: "", location: "", github: "", linkedin: "", twitter: "" });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadContact = useCallback(async () => {
    try {
      const res = await apiFetchContact();
      const data = res.data;
      setContact({
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        github: data.github || "",
        linkedin: data.linkedin || "",
        twitter: data.twitter || "",
      });
    } catch (err) {
      console.error("Failed to load contact:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadContact(); }, [loadContact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiUpdateContact(contact);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save contact:", err);
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Contact Information</h1>
          <p className="text-[#B19EEF] mt-1">Update your contact details and social links</p>
        </div>
        {saved && (
          <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl border border-green-500/30">
            Changes saved successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Contact */}
        <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[#B19EEF] text-sm mb-2">
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </span>
              </label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-[#B19EEF] text-sm mb-2">
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </span>
              </label>
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-[#B19EEF] text-sm mb-2">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </span>
              </label>
              <input
                type="text"
                value={contact.location}
                onChange={(e) => setContact({ ...contact, location: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
                placeholder="City, Country"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Social Links</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[#B19EEF] text-sm mb-2">
                <span className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </span>
              </label>
              <input
                type="url"
                value={contact.github}
                onChange={(e) => setContact({ ...contact, github: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="block text-[#B19EEF] text-sm mb-2">
                <span className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </span>
              </label>
              <input
                type="url"
                value={contact.linkedin}
                onChange={(e) => setContact({ ...contact, linkedin: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="block text-[#B19EEF] text-sm mb-2">
                <span className="flex items-center gap-2">
                  <Twitter className="w-4 h-4" />
                  Twitter / X
                </span>
              </label>
              <input
                type="url"
                value={contact.twitter}
                onChange={(e) => setContact({ ...contact, twitter: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0314] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC]"
                placeholder="https://twitter.com/username"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-[#5227FF] text-white rounded-xl hover:bg-[#5227FF]/80 transition-colors shadow-lg shadow-[#5227FF]/30 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
