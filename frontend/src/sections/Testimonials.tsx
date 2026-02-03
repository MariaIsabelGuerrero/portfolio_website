'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { MessageCircle, UserCircle2, Loader2, AlertCircle, Send, Pin, CheckCircle } from 'lucide-react';
import AOS from "aos";
import "aos/dist/aos.css";
import { getTestimonials, submitTestimonial, type TestimonialData } from '@/lib/public-api';

interface CommentProps {
    comment: TestimonialData;
    formatDate: (timestamp: string) => string;
    isPinned?: boolean;
}

interface CommentFormProps {
    onSubmit: (data: { newComment: string; userName: string; position: string; company: string }) => void;
    isSubmitting: boolean;
}

const Comment = memo(({ comment, formatDate, isPinned = false }: CommentProps) => (
    <div
        className={`px-4 pt-4 pb-4 rounded-xl border transition-all group hover:shadow-lg hover:-translate-y-0.5 ${
            isPinned
                ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/30 hover:bg-gradient-to-r hover:from-indigo-500/15 hover:to-purple-500/15'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
        }`}
    >
        {isPinned && (
            <div className="flex items-center gap-2 mb-3 text-indigo-400">
                <Pin className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Featured</span>
            </div>
        )}
        <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full text-indigo-400 group-hover:bg-indigo-500/30 transition-colors ${
                isPinned ? 'bg-indigo-500/30' : 'bg-indigo-500/20'
            }`}>
                <UserCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-4 mb-1">
                    <div className="flex flex-col">
                        <h4 className={`font-medium ${
                            isPinned ? 'text-indigo-200' : 'text-white'
                        }`}>
                            {comment.name}
                        </h4>
                        <span className="text-xs text-indigo-400">
                            {comment.position} {comment.company && `at ${comment.company}`}
                        </span>
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
));

Comment.displayName = 'Comment';

const CommentForm = memo(({ onSubmit, isSubmitting }: CommentFormProps) => {
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const [position, setPosition] = useState('');
    const [company, setCompany] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, []);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !userName.trim() || !position.trim()) return;

        onSubmit({ newComment, userName, position, company });
        setNewComment('');
        setUserName('');
        setPosition('');
        setCompany('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, [newComment, userName, position, company, onSubmit]);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1000">
                <label className="block text-sm font-medium text-white">
                    Name <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    maxLength={30}
                    placeholder="Enter your name"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    required
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1100">
                <label className="block text-sm font-medium text-white">
                    Position <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    maxLength={30}
                    placeholder="e.g. Software Engineer"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    required
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1200">
                <label className="block text-sm font-medium text-white">
                    Company <span className="text-gray-400">(optional)</span>
                </label>
                <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    maxLength={30}
                    placeholder="e.g. Google"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1300">
                <label className="block text-sm font-medium text-white">
                    Testimonial <span className="text-red-400">*</span>
                </label>
                <textarea
                    ref={textareaRef}
                    value={newComment}
                    maxLength={300}
                    onChange={handleTextareaChange}
                    placeholder="Share your experience working with me..."
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none min-h-[100px]"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                data-aos="fade-up" data-aos-duration="1400"
                className="relative w-full h-12 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl font-medium text-white overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>Submit Testimonial</span>
                        </>
                    )}
                </div>
            </button>
        </form>
    );
});

CommentForm.displayName = 'CommentForm';

const Komentar = () => {
    const [comments, setComments] = useState<TestimonialData[]>([]);
    const [pinnedComment, setPinnedComment] = useState<TestimonialData | null>(null);
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
                const approved = res.data;
                const pinned = approved.find(t => t.isPinned);
                const rest = approved.filter(t => !t.isPinned);
                setPinnedComment(pinned || null);
                setComments(rest);
            } catch (err) {
                console.error('Error fetching testimonials:', err);
            }
        };

        fetchData();
    }, []);

    const handleCommentSubmit = useCallback(async ({ newComment, userName, position, company }: { newComment: string; userName: string; position: string; company: string }) => {
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            await submitTestimonial({
                name: userName,
                position,
                company,
                content: newComment,
            });
            setSuccess('Thank you! Your testimonial has been submitted and is pending review.');
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError('Failed to submit testimonial. Please try again.');
            console.error('Error adding testimonial:', err);
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    const formatDate = useCallback((timestamp: string) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }, []);

    const totalComments = comments.length + (pinnedComment ? 1 : 0);

    return (
        <div className="w-full bg-gradient-to-b from-white/10 to-white/5 rounded-2xl backdrop-blur-xl shadow-xl" data-aos="fade-up" data-aos-duration="1000">
            <div className="p-6 border-b border-white/10" data-aos="fade-down" data-aos-duration="800">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/20">
                        <MessageCircle className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                        Testimonials <span className="text-indigo-400">({totalComments})</span>
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
                    {pinnedComment && (
                        <div data-aos="fade-down" data-aos-duration="800">
                            <Comment
                                comment={pinnedComment}
                                formatDate={formatDate}
                                isPinned={true}
                            />
                        </div>
                    )}

                    {comments.length === 0 && !pinnedComment ? (
                        <div className="text-center py-8" data-aos="fade-in">
                            <UserCircle2 className="w-12 h-12 text-indigo-400 mx-auto mb-3 opacity-50" />
                            <p className="text-gray-400">No testimonials yet. Be the first to share your experience!</p>
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                formatDate={formatDate}
                                isPinned={false}
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

export default Komentar;
