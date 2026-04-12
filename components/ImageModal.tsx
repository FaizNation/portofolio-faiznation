"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    imageAlt: string;
    caption?: string;
    link?: string;
    onNext: () => void;
    onPrev: () => void;
    showNavigation?: boolean;
}

export default function ImageModal({
    isOpen,
    onClose,
    imageSrc,
    imageAlt,
    caption,
    link,
    onNext,
    onPrev,
    showNavigation = true,
}: ImageModalProps) {
    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") onNext();
            if (e.key === "ArrowLeft") onPrev();
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onNext, onPrev, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full max-w-5xl h-[85vh] z-[101] flex flex-col items-center justify-center group/modal"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        {/* Navigation Buttons */}
                        {showNavigation && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onPrev();
                                    }}
                                    className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover/modal:opacity-100 transition-opacity hover:bg-black/70 hidden md:flex items-center justify-center z-[110]"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onNext();
                                    }}
                                    className="absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover/modal:opacity-100 transition-opacity hover:bg-black/70 hidden md:flex items-center justify-center z-[110]"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}

                        {/* Image Container */}
                        <div
                            className="relative w-full h-full flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.div
                                key={imageSrc}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={1}
                                onDragEnd={(e, { offset }) => {
                                    const swipe = offset.x;
                                    if (swipe < -50) {
                                        onNext();
                                    } else if (swipe > 50) {
                                        onPrev();
                                    }
                                }}
                                className="relative w-full h-full cursor-grab active:cursor-grabbing"
                            >
                                <Image
                                    src={imageSrc}
                                    alt={imageAlt}
                                    fill
                                    className="object-contain rounded-md shadow-2xl"
                                    sizes="100vw"
                                    priority
                                />
                            </motion.div>
                        </AnimatePresence>

                        {caption && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-16 left-0 right-0 text-center pointer-events-none"
                            >
                                <p className="text-white/90 font-medium text-lg drop-shadow-md bg-black/20 inline-block px-4 py-2 rounded-full backdrop-blur-sm">
                                    {caption}
                                </p>
                            </motion.div>
                        )}

                        {link && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="absolute bottom-4 left-0 right-0 text-center pointer-events-auto"
                            >
                                <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium transition-all hover:scale-105 active:scale-95"
                                >
                                    <span>View Certificate</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                </a>
                            </motion.div>
                        )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
