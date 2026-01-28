"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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
                                <button className="w-full py-2.5 px-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-black dark:text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-3">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.013-1.133 8.053-3.24 2.107-2.107 2.773-5.2 2.773-7.52 0-.48-.053-.96-.147-1.32h-10.68z"/></svg>
                                    Continue with Google
                                </button>
                                <button className="w-full py-2.5 px-4 bg-black dark:bg-white text-white dark:text-black hover:opacity-90 font-medium rounded-xl transition-opacity flex items-center justify-center gap-3">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
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

            {/* Chat Widget Container */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="w-80 md:w-96 height-auto max-h-[500px] bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl shadow-xl flex flex-col overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-md">
                                <h3 className="font-semibold text-black dark:text-white">Discussion</h3>
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

                            {/* Chat Body (Placeholder) */}
                            <div className="flex-1 p-4 overflow-y-auto min-h-[300px] flex flex-col gap-4 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                                <div className="flex flex-col gap-1 items-start">
                                    <span className="text-xs font-bold text-gray-500">System</span>
                                    <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg rounded-tl-none px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                                        Welcome! Feel free to leave a comment or feedback about my portfolio.
                                    </div>
                                </div>
                            </div>

                            {/* Login Prompt Footer */}
                            <div className="p-4 border-t border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-md">
                                <div className="flex flex-col gap-3 items-center justify-center text-center">
                                    <p className="text-xs text-gray-500">You must be logged in to join the discussion.</p>
                                    <button 
                                        onClick={() => setIsLoginModalOpen(true)}
                                        className="w-full py-2 px-4 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:opacity-80 transition-opacity"
                                    >
                                        Sign in to Comment
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Action Button */}
                <motion.button
                    layoutId="chat-fab"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                >
                    {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    )}
                </motion.button>
            </div>
        </>
    );
}
