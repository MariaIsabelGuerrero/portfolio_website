"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Search,
  Trash2,
  Eye,
  X,
  Clock,
  User,
  CheckCircle,
  Circle,
  Filter,
  Loader2
} from "lucide-react";
import { fetchMessages as apiFetchMessages, markMessageRead as apiMarkMessageRead, deleteMessage as apiDeleteMessage, type Message } from "@/lib/api-client";
import { useLanguage } from "@/lib/i18n";

export default function MessagesPage() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "read" | "unread">("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    try {
      const res = await apiFetchMessages();
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  const filteredMessages = messages.filter(msg => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "read" && msg.read) ||
      (filterStatus === "unread" && !msg.read);

    return matchesSearch && matchesFilter;
  });

  const markAsRead = async (id: string) => {
    try {
      await apiMarkMessageRead(id, true);
      setMessages(messages.map(msg => msg.id === id ? { ...msg, read: true } : msg));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAsUnread = async (id: string) => {
    try {
      await apiMarkMessageRead(id, false);
      setMessages(messages.map(msg => msg.id === id ? { ...msg, read: false } : msg));
    } catch (err) {
      console.error("Failed to mark as unread:", err);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await apiDeleteMessage(id);
      setMessages(messages.filter(msg => msg.id !== id));
      setDeleteConfirm(null);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const openMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsRead(message.id);
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">{t("Messages", "Messages")}</h1>
          <p className="text-sm text-[#B19EEF] mt-1">
            {t(
              `${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}`,
              `${unreadCount} message${unreadCount !== 1 ? "s" : ""} non lu${unreadCount !== 1 ? "s" : ""}`
            )}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B19EEF]" />
          <input
            type="text"
            placeholder={t("Search messages...", "Rechercher des messages...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0f0520] border border-[#5227FF]/30 rounded-xl text-sm text-white placeholder-[#B19EEF]/50 focus:outline-none focus:border-[#FF9FFC] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Filter className="w-4 h-4 text-[#B19EEF]" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | "read" | "unread")}
            className="px-3 py-2.5 text-sm bg-[#0f0520] border border-[#5227FF]/30 rounded-xl text-white focus:outline-none focus:border-[#FF9FFC] transition-colors"
          >
            <option value="all">{t("All Messages", "Tous les messages")}</option>
            <option value="unread">{t("Unread", "Non lus")}</option>
            <option value="read">{t("Read", "Lus")}</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl overflow-hidden">
        {filteredMessages.length === 0 ? (
          <div className="p-10 text-center">
            <Mail className="w-10 h-10 text-[#5227FF]/50 mx-auto mb-3" />
            <p className="text-[#B19EEF]">{t("No messages found", "Aucun message trouvé")}</p>
          </div>
        ) : (
          <div className="divide-y divide-[#5227FF]/20">
            {filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`px-5 py-3 hover:bg-[#5227FF]/10 transition-colors cursor-pointer ${
                  !message.read ? "bg-[#5227FF]/5" : ""
                }`}
                onClick={() => openMessage(message)}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {/* Read Status Indicator */}
                  <div className="flex-shrink-0">
                    {message.read ? (
                      <CheckCircle className="w-4 h-4 text-[#5227FF]/50" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#FF9FFC] fill-[#FF9FFC]" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                        <h3 className={`text-sm font-semibold truncate ${!message.read ? "text-white" : "text-[#B19EEF]"}`}>
                          {message.name}
                        </h3>
                        <span className="text-xs text-[#B19EEF]/50 truncate hidden sm:inline flex-shrink">{message.email}</span>
                      </div>
                      <span className="text-xs text-[#B19EEF]/50 whitespace-nowrap flex-shrink-0">
                        {formatDate(message.date)}
                      </span>
                    </div>
                    <p className={`text-sm truncate mt-0.5 ${!message.read ? "text-white/70" : "text-[#B19EEF]/50"}`}>
                      {message.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="hidden sm:flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => openMessage(message)}
                      className="p-1.5 rounded-lg hover:bg-[#5227FF]/20 text-[#B19EEF] hover:text-white transition-colors"
                      title={t("View message", "Voir le message")}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(message.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-[#B19EEF] hover:text-red-400 transition-colors"
                      title={t("Delete message", "Supprimer le message")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f0520] border border-[#5227FF]/30 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#5227FF]/30 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">{t("Message Details", "Détails du message")}</h2>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-1.5 rounded-lg hover:bg-[#5227FF]/20 text-[#B19EEF] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="px-6 py-5 space-y-4">
                {/* Sender Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-[#5227FF]/10 rounded-xl">
                    <User className="w-4 h-4 text-[#FF9FFC]" />
                    <div>
                      <p className="text-xs text-[#B19EEF]">{t("Name", "Nom")}</p>
                      <p className="text-sm text-white font-medium">{selectedMessage.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#5227FF]/10 rounded-xl">
                    <Mail className="w-4 h-4 text-[#FF9FFC] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-[#B19EEF]">{t("Email", "E-mail")}</p>
                      <p className="text-sm text-white font-medium break-all">{selectedMessage.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#5227FF]/10 rounded-xl">
                    <Clock className="w-4 h-4 text-[#FF9FFC]" />
                    <div>
                      <p className="text-xs text-[#B19EEF]">{t("Received", "Reçu")}</p>
                      <p className="text-sm text-white font-medium">{formatDate(selectedMessage.date)}</p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <p className="text-sm text-[#B19EEF] mb-2">{t("Message", "Message")}</p>
                  <div className="p-4 bg-[#5227FF]/10 rounded-xl">
                    <p className="text-sm text-white leading-relaxed">{selectedMessage.message}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      if (selectedMessage.read) {
                        markAsUnread(selectedMessage.id);
                        setSelectedMessage({ ...selectedMessage, read: false });
                      } else {
                        markAsRead(selectedMessage.id);
                        setSelectedMessage({ ...selectedMessage, read: true });
                      }
                    }}
                    className="px-4 py-2 text-sm bg-[#5227FF]/20 border border-[#5227FF]/50 rounded-xl text-[#B19EEF] hover:text-white hover:border-[#FF9FFC] transition-colors"
                  >
                    {selectedMessage.read
                      ? t("Mark as Unread", "Marquer comme non lu")
                      : t("Mark as Read", "Marquer comme lu")}
                  </button>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="px-4 py-2 text-sm bg-[#5227FF] rounded-xl text-white hover:bg-[#5227FF]/80 transition-colors"
                  >
                    {t("Reply via Email", "Répondre par e-mail")}
                  </a>
                  <button
                    onClick={() => {
                      setDeleteConfirm(selectedMessage.id);
                    }}
                    className="px-4 py-2 text-sm bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    {t("Delete", "Supprimer")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <h3 className="text-lg font-bold text-white mb-2">{t("Delete Message?", "Supprimer le message ?")}</h3>
              <p className="text-sm text-[#B19EEF] mb-5">
                {t("This action cannot be undone. The message will be permanently removed.", "Cette action est irréversible. Le message sera définitivement supprimé.")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 text-sm bg-[#5227FF]/20 border border-[#5227FF]/50 rounded-xl text-white hover:border-[#FF9FFC] transition-colors"
                >
                  {t("Cancel", "Annuler")}
                </button>
                <button
                  onClick={() => deleteMessage(deleteConfirm)}
                  className="flex-1 px-4 py-2.5 text-sm bg-red-500 rounded-xl text-white hover:bg-red-600 transition-colors"
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
