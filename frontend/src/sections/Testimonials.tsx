'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { MessageCircle, UserCircle2, Loader2, AlertCircle, Send, CheckCircle } from 'lucide-react';
import AOS from "aos";
import "aos/dist/aos.css";
import { getTestimonials, submitTestimonial, type TestimonialData } from '@/lib/public-api';
import { useLanguage } from '@/lib/i18n';

interface CommentProps {
    comment: TestimonialData;
    formatDate: (timestamp: string) => string;
}

interface CommentFormProps {
    onSubmit: (data: { newComment: string; userName: string; relationship: string }) => void;
    isSubmitting: boolean;
}

const Comment = memo(({ comment, formatDate }: CommentProps) => {
    return (
    <div
        className="px-4 pt-4 pb-4 rounded-xl border transition-all group hover:shadow-lg hover:-translate-y-0.5 bg-white/5 border-white/10 hover:bg-white/10"
    >
        <div className="flex items-start gap-3">
            <div className="p-2 rounded-full text-indigo-400 bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors">
                <UserCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-4 mb-1">
                    <div className="flex flex-col">
                        <h4 className="font-medium text-white">
                            {comment.name}
                        </h4>
                        {comment.relationship && (
                            <span className="text-xs text-indigo-400">
                                {comment.relationship}
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(comment.date)}
                    </span>
                </div>
                <p className="text-gray-300 text-sm break-words leading-relaxed mt-2">
                    {comment.content}
                </p>
            </div>
        </div>
    </div>
);
});

Comment.displayName = 'Comment';

const CommentForm = memo(({ onSubmit, isSubmitting }: CommentFormProps) => {
    const { t } = useLanguage();
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const [relationship, setRelationship] = useState('');
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const validateField = (value: string): string | null => {
        if (!value.trim()) return "Required";
        return null;
    };

    const handleBlur = useCallback((fieldName: string) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        const value = fieldName === 'name' ? userName : fieldName === 'relationship' ? relationship : newComment;
        const error = validateField(value);
        setFormErrors(prev => {
            if (error) return { ...prev, [fieldName]: error };
            const n = { ...prev }; delete n[fieldName]; return n;
        });
    }, [userName, relationship, newComment]);

    const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(e.target.value);
        if (touched.content) {
            const error = validateField(e.target.value);
            setFormErrors(prev => {
                if (error) return { ...prev, content: error };
                const n = { ...prev }; delete n.content; return n;
            });
        }
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [touched.content]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ name: true, relationship: true, content: true });
        const errors: Record<string, string> = {};
        if (!userName.trim()) errors.name = "Required";
        if (!relationship.trim()) errors.relationship = "Required";
        if (!newComment.trim()) errors.content = "Required";

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        onSubmit({ newComment, userName, relationship });
        setNewComment('');
        setUserName('');
        setRelationship('');
        setTouched({});
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, [newComment, userName, relationship, onSubmit]);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5" data-aos="fade-up" data-aos-duration="1000">
                <label className="block text-xs font-medium text-white">
                    {t("Name", "Nom")} <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => { setUserName(e.target.value); if (touched.name) { const err = validateField(e.target.value); setFormErrors(prev => { if (err) return { ...prev, name: err }; const n = {...prev}; delete n.name; return n; }); } }}
                    onBlur={() => handleBlur('name')}
                    maxLength={30}
                    placeholder={t("Enter your name", "Entrez votre nom")}
                    className={`w-full p-2.5 text-sm rounded-xl bg-white/5 border ${formErrors.name ? "border-red-500/50" : "border-white/10"} text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                />
                {formErrors.name && <p className="text-red-400 text-xs mt-1">{t("This field is required", "Ce champ est requis")}</p>}
            </div>

            <div className="space-y-1.5" data-aos="fade-up" data-aos-duration="1100">
                <label className="block text-xs font-medium text-white">
                    {t("Relationship", "Relation")} <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={relationship}
                    onChange={(e) => { setRelationship(e.target.value); if (touched.relationship) { const err = validateField(e.target.value); setFormErrors(prev => { if (err) return { ...prev, relationship: err }; const n = {...prev}; delete n.relationship; return n; }); } }}
                    onBlur={() => handleBlur('relationship')}
                    maxLength={50}
                    placeholder={t("e.g. Colleague, Manager, Client", "ex: Collègue, Manager, Client")}
                    className={`w-full p-2.5 text-sm rounded-xl bg-white/5 border ${formErrors.relationship ? "border-red-500/50" : "border-white/10"} text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                />
                {formErrors.relationship && <p className="text-red-400 text-xs mt-1">{t("This field is required", "Ce champ est requis")}</p>}
            </div>

            <div className="space-y-1.5" data-aos="fade-up" data-aos-duration="1300">
                <label className="block text-xs font-medium text-white">
                    {t("Testimonial", "Témoignage")} <span className="text-red-400">*</span>
                </label>
                <textarea
                    ref={textareaRef}
                    value={newComment}
                    maxLength={300}
                    onChange={handleTextareaChange}
                    onBlur={() => handleBlur('content')}
                    placeholder={t("Share your experience working with me...", "Partagez votre expérience de travail avec moi...")}
                    className={`w-full p-3 text-sm rounded-xl bg-white/5 border ${formErrors.content ? "border-red-500/50" : "border-white/10"} text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none min-h-[80px]`}
                />
                {formErrors.content && <p className="text-red-400 text-xs mt-1">{t("This field is required", "Ce champ est requis")}</p>}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                data-aos="fade-up" data-aos-duration="1400"
                className="relative w-full h-10 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl font-medium text-sm text-white overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{t("Submitting...", "Envoi...")}</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>{t("Submit Testimonial", "Envoyer le témoignage")}</span>
                        </>
                    )}
                </div>
            </button>
        </form>
    );
});

CommentForm.displayName = 'CommentForm';

const Testimonials = () => {
    const { t } = useLanguage();
    const [comments, setComments] = useState<TestimonialData[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        AOS.init({
            once: false,
            duration: 1000,
        });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getTestimonials();
                setComments(res.data);
            } catch (err) {
                console.error('Error fetching testimonials:', err);
            }
        };

        fetchData();
    }, []);

    const handleCommentSubmit = useCallback(async ({ newComment, userName, relationship }: { newComment: string; userName: string; relationship: string }) => {
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            await submitTestimonial({
                name: userName,
                relationship,
                content: newComment,
            });
            setSuccess(t('Thank you! Your testimonial has been submitted and is pending review.', 'Merci ! Votre témoignage a été soumis et est en attente de validation.'));
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(t('Failed to submit testimonial. Please try again.', 'Échec de l\'envoi du témoignage. Veuillez réessayer.'));
            console.error('Error adding testimonial:', err);
        } finally {
            setIsSubmitting(false);
        }
    }, [t]);

    const formatDate = useCallback((timestamp: string) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) return t('Just now', 'A l\'instant');
        if (diffMinutes < 60) return `${diffMinutes}${t('m ago', ' min')}`;
        if (diffHours < 24) return `${diffHours}${t('h ago', ' h')}`;
        if (diffDays < 7) return `${diffDays}${t('d ago', ' j')}`;

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }, [t]);

    const totalComments = comments.length;

    return (
        <div className="w-full bg-gradient-to-b from-white/10 to-white/5 rounded-2xl backdrop-blur-xl shadow-xl" data-aos="fade-up" data-aos-duration="1000">
            <div className="p-6 border-b border-white/10" data-aos="fade-down" data-aos-duration="800">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/20">
                        <MessageCircle className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                        {t("Testimonials", "Témoignages")} <span className="text-indigo-400">({totalComments})</span>
                    </h3>
                </div>
            </div>
            <div className="p-6 space-y-6">
                {error && (
                    <div className="flex items-center gap-2 p-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl" data-aos="fade-in">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="flex items-center gap-2 p-4 text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl" data-aos="fade-in">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{success}</p>
                    </div>
                )}

                <div>
                    <CommentForm onSubmit={handleCommentSubmit} isSubmitting={isSubmitting} />
                </div>

                <div className="space-y-4 h-[328px] overflow-y-auto overflow-x-hidden custom-scrollbar pt-1 pr-1" data-aos="fade-up" data-aos-delay="200">
                    {comments.length === 0 ? (
                        <div className="text-center py-8" data-aos="fade-in">
                            <UserCircle2 className="w-12 h-12 text-indigo-400 mx-auto mb-3 opacity-50" />
                            <p className="text-gray-400">{t("No testimonials yet. Be the first to share your experience!", "Aucun témoignage pour le moment. Soyez le premier a partager votre expérience !")}</p>
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                formatDate={formatDate}
                            />
                        ))
                    )}
                </div>
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(99, 102, 241, 0.5);
                    border-radius: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(99, 102, 241, 0.7);
                }
            `}</style>
        </div>
    );
};

export default Testimonials;
