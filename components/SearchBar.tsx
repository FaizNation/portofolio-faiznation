"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";

interface SearchBarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SuggestionItem {
    title: string;
    href: string;
    category: "Suggestion" | "Page" | "Project" | "Other";
}

const SUGGESTIONS: SuggestionItem[] = [
    { title: "View Resume", href: "/resume.pdf", category: "Suggestion" },
    { title: "Contact Me", href: "/contact", category: "Suggestion" },

    { title: "Home", href: "/", category: "Page" },
    { title: "About", href: "/about", category: "Page" },
    { title: "Projects", href: "/projects", category: "Page" },
    { title: "Writing", href: "/writing", category: "Page" },

    { title: "Portfolio V1", href: "https://v1.faiznation.com", category: "Project" },
];

export default function SearchBar({ isOpen, onClose }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const router = useRouter();
    const listRef = useRef<HTMLDivElement>(null);

    const filteredItems = useMemo(() => {
        if (!query) return SUGGESTIONS;
        return SUGGESTIONS.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase())
        );
    }, [query]);

    const groupedItems = useMemo(() => {
        const groups: Record<string, SuggestionItem[]> = {
            Suggestion: [],
            Page: [],
            Other: []
        };

        filteredItems.forEach(item => {
            if (item.category === "Suggestion") groups.Suggestion.push(item);
            else if (item.category === "Page") groups.Page.push(item);
            else {
                const key = item.category === "Project" ? "Projects" : "Other";
                if (!groups[key]) groups[key] = [];
                groups[key].push(item);
            }
        });

        const result = [];
        if (groups.Suggestion.length) result.push({ category: "Suggestions", items: groups.Suggestion });
        if (groups.Page.length) result.push({ category: "Pages", items: groups.Page });
        Object.keys(groups).forEach(key => {
            if (key !== "Suggestion" && key !== "Page" && groups[key].length > 0) {
                result.push({ category: key, items: groups[key] });
            }
        });

        return result;
    }, [filteredItems]);

    const flatList = useMemo(() => {
        return groupedItems.flatMap(group => group.items);
    }, [groupedItems]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query, isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev < flatList.length - 1 ? prev + 1 : prev
                );
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (flatList.length > 0) {
                    const selected = flatList[selectedIndex];
                    router.push(selected.href);
                    onClose();
                }
            } else if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, flatList, selectedIndex, router, onClose]);

    useEffect(() => {
        if (!listRef.current) return;
        const selectedElement = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
        if (selectedElement) {
            selectedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
    }, [selectedIndex, isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    let globalIndexCounter = 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh] px-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-xl bg-white dark:bg-[#09090b] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col"
                        >
                            {/* Input Header */}
                            <div className="flex items-center px-4 border-b border-gray-100 dark:border-white/5 h-14">
                                <Search className="w-5 h-5 text-gray-400 mr-3" />
                                <input
                                    type="text"
                                    placeholder="Type a command or search..."
                                    className="flex-1 bg-transparent border-none outline-none text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 h-full"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    autoFocus
                                />
                                <button
                                    onClick={onClose}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors"
                                >
                                    <span className="sr-only">Close</span>
                                    <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded bg-gray-100 dark:bg-white/10 px-1.5 font-mono text-[10px] font-medium text-gray-500 dark:text-gray-400">
                                        ESC
                                    </kbd>
                                </button>
                            </div>

                            {/* Results */}
                            <div className="p-2 max-h-[300px] overflow-y-auto custom-scrollbar" ref={listRef}>
                                {flatList.length > 0 ? (
                                    <div className="flex flex-col gap-4">
                                        {groupedItems.map((group) => (
                                            <div key={group.category}>
                                                <div className="text-xs font-semibold text-gray-400 px-2 mb-2 uppercase tracking-wider">
                                                    {group.category}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    {group.items.map((item) => {
                                                        const currentIndex = globalIndexCounter++;
                                                        
                                                        return (
                                                            <Link
                                                                key={item.href + item.title}
                                                                href={item.href}
                                                                data-index={currentIndex}
                                                                onClick={onClose}
                                                                onMouseEnter={() => setSelectedIndex(currentIndex)}
                                                                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                                                                    selectedIndex === currentIndex
                                                                        ? "bg-gray-100 dark:bg-white/10"
                                                                        : "hover:bg-gray-100 dark:hover:bg-white/5"
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-3">

                                                                    <div>
                                                                        <div className={`text-sm font-medium transition-colors ${
                                                                            selectedIndex === currentIndex 
                                                                                ? "text-black dark:text-white"
                                                                                : "text-gray-700 dark:text-gray-200"
                                                                        }`}>
                                                                            {item.title}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <ArrowRight className={`w-4 h-4 text-gray-400 transition-all duration-200 ${
                                                                    selectedIndex === currentIndex 
                                                                        ? "opacity-100 translate-x-0"
                                                                        : "opacity-0 -translate-x-2"
                                                                }`} />
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-sm text-gray-500">
                                        No results found for <span className="text-black dark:text-white font-medium">"{query}"</span>
                                    </div>
                                )}
                            </div>

                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
