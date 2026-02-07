"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Quote,
  Search,
  Trash2,
  Check,
  X,
  Clock,
  Briefcase,
  Pin,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { fetchTestimonials as apiFetchTestimonials, updateTestimonialStatus as apiUpdateStatus, updateTestimonialPin as apiUpdatePin, deleteTestimonial as apiDeleteTestimonial, type Testimonial } from "@/lib/api-client";
import { useLanguage } from "@/lib/i18n";

type TestimonialStatus = "pending" | "approved" | "rejected";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/20",
    borderColor: "border-yellow-400/50",
    icon: AlertCircle,
  },
  approved: {
    label: "Approved",
    color: "text-green-400",
    bgColor: "bg-green-400/20",
    borderColor: "border-green-400/50",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "text-red-400",
    bgColor: "bg-red-400/20",
    borderColor: "border-red-400/50",
    icon: XCircle,
  },
};

export default function TestimonialsPage() {
  const { t } = useLanguage();
  const statusLabelsFr: Record<TestimonialStatus, string> = {
    pending: "En attente",
    approved: "Approuvé",
    rejected: "Rejeté",
  };

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | TestimonialStatus>("all");
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadTestimonials = useCallback(async () => {
    try {
      const res = await apiFetchTestimonials(true);
      setTestimonials(res.data);
    } catch (err) {
      console.error("Failed to load testimonials:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTestimonials(); }, [loadTestimonials]);

  const filteredTestimonials = testimonials.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === "all" || t.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const updateStatus = async (id: string, status: TestimonialStatus) => {
    try {
      await apiUpdateStatus(id, status);
      setTestimonials(testimonials.map(t => t.id === id ? { ...t, status } : t));
      if (selectedTestimonial?.id === id) {
        setSelectedTestimonial({ ...selectedTestimonial, status });
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      await apiDeleteTestimonial(id);
      setTestimonials(testimonials.filter(t => t.id !== id));
      setDeleteConfirm(null);
      if (selectedTestimonial?.id === id) {
        setSelectedTestimonial(null);
      }
    } catch (err) {
      console.error("Failed to delete testimonial:", err);
    }
  };

  const togglePin = async (id: string, isPinned: boolean) => {
    try {
      await apiUpdatePin(id, isPinned);
      setTestimonials(testimonials.map(t => t.id === id ? { ...t, isPinned } : t));
    } catch (err) {
      console.error("Failed to toggle pin:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#5227FF] animate-spin" />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const pendingCount = testimonials.filter(t => t.status === "pending").length;
  const approvedCount = testimonials.filter(t => t.status === "approved").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("Testimonials", "Témoignages")}</h1>
          <p className="text-[#B19EEF] mt-1">
            {t(
              `${pendingCount} pending review | ${approvedCount} approved`,
              `${pendingCount} en attente | ${approvedCount} approuvé${approvedCount !== 1 ? "s" : ""}`
            )}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0f0520] border border-yellow-400/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-400/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{pendingCount}</p>
              <p className="text-sm text-[#B19EEF]">{t("Pending", "En attente")}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#0f0520] border border-green-400/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-400/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{approvedCount}</p>
              <p className="text-sm text-[#B19EEF]">{t("Approved", "Approuvé")}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#0f0520] border border-red-400/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-400/20 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{testimonials.filter(t => t.status === "rejected").length}</p>
              <p className="text-sm text-[#B19EEF]">{t("Rejected", "Rejeté")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B19EEF]" />
          <input
            type="text"
            placeholder={t("Search testimonials...", "Rechercher des témoignages...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#0f0520] border border-[#5227FF]/30 rounded-xl text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#B19EEF]" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | TestimonialStatus)}
            className="px-4 py-3 bg-[#0f0520] border border-[#5227FF]/30 rounded-xl text-white focus:outline-none focus:border-[#FF9FFC] transition-colors"
          >
            <option value="all">{t("All Testimonials", "Tous les témoignages")}</option>
            <option value="pending">{t("Pending", "En attente")}</option>
            <option value="approved">{t("Approved", "Approuvé")}</option>
            <option value="rejected">{t("Rejected", "Rejeté")}</option>
          </select>
        </div>
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        {filteredTestimonials.length === 0 ? (
          <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl p-12 text-center">
            <Quote className="w-12 h-12 text-[#5227FF]/50 mx-auto mb-4" />
            <p className="text-[#B19EEF]">{t("No testimonials found", "Aucun témoignage trouvé")}</p>
          </div>
        ) : (
          filteredTestimonials.map((testimonial) => {
            const status = statusConfig[testimonial.status];
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl p-6 hover:border-[#5227FF]/50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5227FF] to-[#FF9FFC] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white">{testimonial.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.bgColor} ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {t(status.label, statusLabelsFr[testimonial.status])}
                      </span>
                      {testimonial.isPinned && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 bg-[#FF9FFC]/20 text-[#FF9FFC]">
                          <Pin className="w-3 h-3" />
                          {t("Pinned", "Épinglé")}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#B19EEF] mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      {testimonial.position} {t("at", "chez")} {testimonial.company}
                    </p>
                    <p className="text-[#B19EEF]/80 mb-4 line-clamp-3">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#B19EEF]/60">
                      <Clock className="w-3 h-3" />
                      {t("Submitted", "Soumis le")} {formatDate(testimonial.date)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap lg:flex-col gap-2">
                    {testimonial.status !== "approved" && (
                      <button
                        onClick={() => updateStatus(testimonial.id, "approved")}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 hover:bg-green-500/30 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        <span className="text-sm">{t("Approve", "Approuver")}</span>
                      </button>
                    )}
                    {testimonial.status !== "rejected" && (
                      <button
                        onClick={() => updateStatus(testimonial.id, "rejected")}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span className="text-sm">{t("Reject", "Rejeter")}</span>
                      </button>
                    )}
                    <button
                      onClick={() => togglePin(testimonial.id, !testimonial.isPinned)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                        testimonial.isPinned
                          ? "bg-[#FF9FFC]/20 border border-[#FF9FFC]/50 text-[#FF9FFC]"
                          : "bg-[#5227FF]/20 border border-[#5227FF]/50 text-[#B19EEF] hover:text-white hover:border-[#FF9FFC]"
                      }`}
                    >
                      <Pin className="w-4 h-4" />
                      <span className="text-sm">{testimonial.isPinned ? t("Unpin", "Désépingler") : t("Pin", "Épingler")}</span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(testimonial.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#5227FF]/20 border border-[#5227FF]/50 rounded-xl text-[#B19EEF] hover:text-white hover:border-[#FF9FFC] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">{t("Delete", "Supprimer")}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-2">{t("Delete Testimonial?", "Supprimer le témoignage ?")}</h3>
              <p className="text-[#B19EEF] mb-6">
                {t("This action cannot be undone. The testimonial will be permanently removed.", "Cette action est irréversible. Le témoignage sera définitivement supprimé.")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 bg-[#5227FF]/20 border border-[#5227FF]/50 rounded-xl text-white hover:border-[#FF9FFC] transition-colors"
                >
                  {t("Cancel", "Annuler")}
                </button>
                <button
                  onClick={() => deleteTestimonial(deleteConfirm)}
                  className="flex-1 px-4 py-3 bg-red-500 rounded-xl text-white hover:bg-red-600 transition-colors"
                >
                  {t("Delete", "Supprimer")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
