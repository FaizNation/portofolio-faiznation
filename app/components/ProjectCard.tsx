"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Project {
    title: string;
    description: string;
    tags: string[];
    year: string;
    images?: string[];
    links?: {
        github?: string;
        demo?: string;
        figma?: string;
    };
}

export default function ProjectCard({ project }: { project: Project }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        if (!project.images || project.images.length === 0) return;
        setCurrentImageIndex((prev) => (prev + 1) % project.images!.length);
    };

    const prevImage = () => {
        if (!project.images || project.images.length === 0) return;
        setCurrentImageIndex((prev) => (prev - 1 + project.images!.length) % project.images!.length);
    };

    return (
        <div className="group flex flex-col gap-4 p-6 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl hover:border-zinc-200 dark:hover:border-zinc-700 transition-all hover:shadow-sm">
            {/* Image Carousel */}
            {project.images && project.images.length > 0 && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 group/slider">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImageIndex}
                            src={project.images[currentImageIndex]}
                            alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </AnimatePresence>

                    {project.images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-black/70 z-10"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-black/70 z-10"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                            </button>

                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                {project.images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                        className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImageIndex ? "bg-white" : "bg-white/50 hover:bg-white/80"}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            <div className="flex justify-between items-start">
                <h3 className="font-bold text-xl text-black dark:text-white">
                    {project.title}
                </h3>
                <span className="text-xs font-mono text-gray-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                    {project.year}
                </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                {project.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.map((tag) => (
                    <span
                        key={tag}
                        className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-2 py-1 rounded-full"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* Action Links */}
            {project.links && (
                <div className="flex items-center gap-3 mt-auto pt-2 border-t border-zinc-200 dark:border-zinc-800">
                    {project.links.github && (
                        <a
                            href={project.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                            GitHub
                        </a>
                    )}
                    {project.links.figma && (
                        <a
                            href={project.links.figma}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"></path><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"></path><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"></path><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"></path><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"></path></svg>
                            Figma
                        </a>
                    )}
                    {project.links.demo && (
                        <a
                            href={project.links.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors ml-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            Live Demo
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}
