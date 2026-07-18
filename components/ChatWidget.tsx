"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id?: string;
        name: string | null;
        image: string | null;
        isVerified?: boolean;
    };
    parent?: {
        content: string;
        user: {
            name: string | null;
            isVerified?: boolean;
        };
    } | null;
}

export default function ChatWidget() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);
    const [replyTo, setReplyTo] = useState<Comment | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, comment: Comment } | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const commentsEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const fabRef = useRef<HTMLButtonElement>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);
    const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [userEmails, setUserEmails] = useState<Record<string, string>>({});
    const pendingEmailsRef = useRef<Set<string>>(new Set());

    const fetchUserEmail = async (userId: string) => {
        if (!userId || userEmails[userId] || pendingEmailsRef.current.has(userId)) return;
        pendingEmailsRef.current.add(userId);
        try {
            const res = await fetch(`/api/users/${userId}`);
            if (res.ok) {
                const data = await res.json();
                setUserEmails(prev => ({ ...prev, [userId]: data.email }));
            }
        } catch (err) {
            console.error("Failed to fetch user email", err);
        } finally {
            pendingEmailsRef.current.delete(userId);
        }
    };

    useEffect(() => {
        const handleCloseMenu = () => setContextMenu(null);
        window.addEventListener("click", handleCloseMenu);
        return () => {
            window.removeEventListener("click", handleCloseMenu);
            if (longPressTimerRef.current) {
                clearTimeout(longPressTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (session || isOpen) {
            setShowPrompt(false);
            return;
        }

        let timeoutId: ReturnType<typeof setTimeout>;
        let hideTimeoutId: ReturnType<typeof setTimeout>;

        const startPromptCycle = () => {
            setShowPrompt(true);
            hideTimeoutId = setTimeout(() => {
                setShowPrompt(false);
                timeoutId = setTimeout(startPromptCycle, 10000);
            }, 5000);
        };

        timeoutId = setTimeout(startPromptCycle, 3000);

        return () => {
            clearTimeout(timeoutId);
            clearTimeout(hideTimeoutId);
        };
    }, [session, isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                chatContainerRef.current &&
                !chatContainerRef.current.contains(event.target as Node) &&
                fabRef.current &&
                !fabRef.current.contains(event.target as Node) &&
                !(contextMenuRef.current && contextMenuRef.current.contains(event.target as Node))
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const fetchComments = async () => {
        try {
            const res = await fetch("/api/comments");
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (error) {
            console.error("Failed to fetch comments", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchComments();
        }
    }, [isOpen]);

    useEffect(() => {
        if (commentsEndRef.current) {
            commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [comments]);

    const handleContextMenu = (e: React.MouseEvent, comment: Comment) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, comment });
    };

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    const handleTouchStart = (e: React.TouchEvent, comment: Comment) => {
        if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = setTimeout(() => {
            setContextMenu({ x: e.touches[0].clientX, y: e.touches[0].clientY, comment });
        }, 500);
    };

    const handleTouchEnd = () => {
        if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    };

    const handleSend = async () => {
        if (!inputValue.trim() || !session) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    content: inputValue,
                    parentId: replyTo?.id 
                }),
            });

            if (res.ok) {
                const newComment = await res.json();
                setComments([...comments, newComment]);
                setInputValue("");
                setReplyTo(null);
            }
        } catch (error) {
            console.error("Failed to send comment", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Login Modal */}
            <AnimatePresence>
                {isLoginModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsLoginModalOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-sm bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-2xl shadow-xl p-6 flex flex-col gap-6 z-[101]"
                        >
                            <div className="flex flex-col items-center gap-2 text-center">
                                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black dark:text-white">
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                        <polyline points="10 17 15 12 10 7"></polyline>
                                        <line x1="15" y1="12" x2="3" y2="12"></line>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-black dark:text-white">Sign In</h3>
                                <p className="text-gray-500 text-sm">Log in to join the discussion and leave comments.</p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => signIn("google")}
                                    className="w-full py-2.5 px-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-black dark:text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-3"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.013-1.133 8.053-3.24 2.107-2.107 2.773-5.2 2.773-7.52 0-.48-.053-.96-.147-1.32h-10.68z" /></svg>
                                    Continue with Google
                                </button>
                                <button
                                    onClick={() => signIn("github")}
                                    className="w-full py-2.5 px-4 bg-black dark:bg-white text-white dark:text-black hover:opacity-90 font-medium rounded-xl transition-opacity flex items-center justify-center gap-3"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                    Continue with GitHub
                                </button>
                            </div>

                            <button
                                onClick={() => setIsLoginModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {isLogoutModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsLogoutModalOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-sm bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-2xl shadow-xl p-6 flex flex-col gap-6 z-[111]"
                        >
                            <div className="flex flex-col items-center gap-2 text-center">
                                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-black dark:text-white">Sign Out</h3>
                                <p className="text-gray-500 text-sm">Are you sure you want to sign out? You won&apos;t be able to leave comments.</p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsLogoutModalOpen(false)}
                                    className="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        signOut();
                                        setIsLogoutModalOpen(false);
                                    }}
                                    className="flex-1 py-2.5 px-4 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Chat Widget Container */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.2 }}
                            ref={chatContainerRef}
                            className="w-[calc(100vw-3rem)] md:w-96 height-auto max-h-[500px] bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl shadow-xl flex flex-col overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-md">
                                <h3 className="font-semibold text-black dark:text-white">Discussion</h3>
                                <div className="flex items-center gap-2">
                                    {session && (
                                        <button
                                            onClick={() => setIsLogoutModalOpen(true)}
                                            className="text-xs text-red-500 hover:text-red-600 transition-colors mr-2"
                                        >
                                            Sign Out
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Chat Body */}
                            <div className="flex-1 p-4 overflow-y-auto min-h-[300px] flex flex-col gap-4 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                                <div className="flex flex-col gap-1 items-start">
                                    <span className="text-xs font-bold text-gray-500">System</span>
                                    <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg rounded-tl-none px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                                        Welcome! Feel free to leave a comment or feedback about my portfolio. and please comment respectfully as chats cannot be edited or deleted.
                                    </div>
                                </div>

                                {comments.map((comment, index) => {
                                    const isMe = comment.user.name === session?.user?.name;
                                    const showAvatar = !isMe && (index === 0 || comments[index - 1].user.name !== comment.user.name);

                                    return (
                                        <div
                                            key={comment.id}
                                            className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                                        >
                                            {/* Avatar for others */}
                                            {!isMe && (
                                                <div className="w-8 h-8 flex-shrink-0 flex flex-col justify-end">
                                                    {showAvatar ? (
                                                        <HoverCard onOpenChange={(open) => {
                                                            if (open && comment.user.id) {
                                                                fetchUserEmail(comment.user.id);
                                                            }
                                                        }}>
                                                            <HoverCardTrigger asChild>
                                                                <button className="w-8 h-8 rounded-full focus:outline-none overflow-hidden cursor-pointer">
                                                                    {comment.user.image ? (
                                                                        <img
                                                                            src={comment.user.image}
                                                                            alt={comment.user.name || "User"}
                                                                            className="w-8 h-8 rounded-full object-cover shadow-sm"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                                                                            {comment.user.name?.[0] || "?"}
                                                                        </div>
                                                                    )}
                                                                </button>
                                                            </HoverCardTrigger>
                                                            <HoverCardContent className="w-80 p-4 border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 rounded-xl shadow-xl z-[250]">
                                                                <div className="flex justify-between space-x-4">
                                                                    <Avatar className="w-12 h-12">
                                                                        {comment.user.image ? (
                                                                            <AvatarImage src={comment.user.image} alt={comment.user.name || "User"} />
                                                                        ) : null}
                                                                        <AvatarFallback className="bg-gray-300 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 font-bold text-sm">
                                                                            {comment.user.name?.[0] || "?"}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="space-y-1 flex-1 min-w-0">
                                                                        <h4 className="text-sm font-semibold text-black dark:text-white truncate">
                                                                            {comment.user.name || "Anonymous"}
                                                                        </h4>
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                            {comment.user.id ? (userEmails[comment.user.id] || "Loading...") : "No email available"}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </HoverCardContent>
                                                        </HoverCard>
                                                    ) : <div className="w-8" />}
                                                </div>
                                            )}

                                            {/* Message Bubble */}
                                            <div
                                                onContextMenu={(e) => handleContextMenu(e, comment)}
                                                onTouchStart={(e) => handleTouchStart(e, comment)}
                                                onTouchEnd={handleTouchEnd}
                                                onTouchMove={handleTouchEnd}
                                                className={`
                                                    max-w-[75%] rounded-lg px-3 py-1.5 shadow-sm relative text-sm group
                                                    ${isMe
                                                        ? "bg-black dark:bg-white text-white dark:text-black rounded-tr-none"
                                                        : "bg-white dark:bg-zinc-800 text-black dark:text-white rounded-tl-none border border-black/5 dark:border-white/5"
                                                    }
                                                `}
                                            >
                                                {/* Sender Name (only for others in group context) */}
                                                {!isMe && showAvatar && (
                                                    <div className="flex items-center gap-1 mb-0.5">
                                                        <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 leading-none">
                                                            {comment.user.name || "Anonymous"}
                                                        </p>
                                                        {comment.user.isVerified && (
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px] text-blue-500 shrink-0 mt-0.5">
                                                                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex flex-col">
                                                    {comment.parent && (
                                                        <div className={`mb-2 p-2 rounded-md border-l-4 text-[12px] opacity-80 ${
                                                            isMe ? "bg-white/10 border-white" : "bg-black/5 border-black dark:bg-white/5 dark:border-white"
                                                        }`}>
                                                            <div className="flex items-center gap-1 mb-0.5">
                                                                <p className="font-bold">{comment.parent.user.name || "Anonymous"}</p>
                                                                {comment.parent.user.isVerified && (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-blue-500 shrink-0 mt-[1px]">
                                                                        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <p className="line-clamp-2 leading-tight">{comment.parent.content}</p>
                                                        </div>
                                                    )}
                                                    <span className="break-words whitespace-pre-wrap leading-tight">{comment.content}</span>
                                                    <span className={`text-[10px] self-end mt-1 ml-2 opacity-70`}>
                                                        {new Date(comment.createdAt).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>

                                                {/* Triangle Tail */}
                                                <div className={`absolute top-0 w-0 h-0 border-[6px] border-transparent ${isMe
                                                    ? "right-[-6px] border-t-black dark:border-t-white border-r-0"
                                                    : "left-[-6px] border-t-white dark:border-t-zinc-800 border-l-0"
                                                    }`} />
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={commentsEndRef} />
                            </div>

                            {/* Footer (Input or Login Prompt) */}
                            <div className="p-4 border-t border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-md flex flex-col">
                                {replyTo && (
                                    <div className="mb-2 p-2 bg-zinc-100 dark:bg-zinc-800 border-l-4 border-black dark:border-white rounded-r-lg flex justify-between items-start animate-in slide-in-from-bottom-2">
                                        <div className="overflow-hidden">
                                            <div className="flex items-center gap-1">
                                                <p className="text-[10px] font-bold text-black dark:text-white">Replying to {replyTo.user.name || "Anonymous"}</p>
                                                {replyTo.user.isVerified && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[10px] h-[10px] text-blue-500 shrink-0 mt-[1px]">
                                                        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">{replyTo.content}</p>
                                        </div>
                                        <button onClick={() => setReplyTo(null)} className="p-1 hover:bg-black/5 rounded-full text-black dark:text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </button>
                                    </div>
                                )}
                                {session ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                                            disabled={isLoading}
                                            placeholder="Write a comment..."
                                            className="flex-1 bg-white dark:bg-zinc-800 border-none rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={isLoading || !inputValue.trim()}
                                            className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-lg disabled:opacity-50"
                                        >
                                            {isLoading ? (
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3 items-center justify-center text-center">
                                        <p className="text-xs text-gray-500">You must be logged in to join the discussion.</p>
                                        <button
                                            onClick={() => setIsLoginModalOpen(true)}
                                            className="w-full py-2 px-4 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:opacity-80 transition-opacity"
                                        >
                                            Sign in to Comment
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Notification Prompt */}
                <AnimatePresence>
                    {!isOpen && !session && showPrompt && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            className="relative right-12 bg-white dark:bg-zinc-800 px-4 py-3 rounded-2xl shadow-xl border border-black/10 dark:border-white/10 cursor-pointer flex items-center gap-2 mr-1"
                            onClick={() => setIsOpen(true)}
                        >
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-black dark:text-white">Let’s discuss! 👋</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">with me and others</span>
                            </div>
                            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white dark:bg-zinc-800 border-b border-r border-black/10 dark:border-white/10 transform rotate-45" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Action Button */}
                <motion.button
                    ref={fabRef}
                    layoutId="chat-fab"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform overflow-hidden"
                >
                    {session?.user?.image ? (
                        <img
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        isOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        )
                    )}
                </motion.button>
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <div 
                    ref={contextMenuRef}
                    className="fixed z-[200] bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-xl shadow-2xl py-1 w-32 overflow-hidden"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={() => {
                            setReplyTo(contextMenu.comment);
                            setContextMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 text-black dark:text-white transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
                        Reply
                    </button>
                    <button 
                        onClick={() => {
                            handleCopy(contextMenu.comment.content);
                            setContextMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 text-black dark:text-white transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        Copy
                    </button>
                </div>
            )}

            {/* Copy Feedback */}
            <AnimatePresence>
                {copySuccess && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-24 right-1/2 translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-xs font-bold shadow-lg z-[201]"
                    >
                        Copied to clipboard!
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
