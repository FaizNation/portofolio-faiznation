"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import experienceDataRaw from "@/data/experiences.json";

type Category = "Work" | "Education";

const tabs: Category[] = ["Work", "Education"];

interface Role {
    title: string;
    responsibilities?: string[];
}

interface ExperienceItem {
    organization: string;
    location?: string;
    period: string;
    companyDescription?: string;
    roles: Role[];
}

const experienceData: Record<Category, ExperienceItem[]> = experienceDataRaw as Record<Category, ExperienceItem[]>;

export default function ExperienceTabs() {
    const [activeTab, setActiveTab] = useState<Category>("Work");

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
              relative px-4 py-2 text-sm font-medium rounded-lg transition-colors
              ${activeTab === tab ? "text-black dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}
            `}
                    >
                        {activeTab === tab && (
                            <motion.div
                                layoutId="active-pill-exp"
                                className="absolute inset-0 bg-white dark:bg-zinc-800 shadow-sm rounded-lg"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">{tab}</span>
                    </button>
                ))}
            </div>

            <div className="min-h-[100px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-4"
                    >
                        <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-3 space-y-10 my-4">
                            {experienceData[activeTab].map((item, index) => (
                                <div key={index} className="relative pl-8 group">
                                    {/* Timeline Dot */}
                                    <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800 border-2 border-white dark:border-zinc-950 group-hover:bg-black dark:group-hover:bg-white group-hover:scale-125 transition-all duration-300 shadow-sm" />

                                    <div className="flex flex-col gap-3">
                                        {/* Company Info Header */}
                                        <div className="flex flex-col gap-1">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="font-bold text-black dark:text-white text-xl">
                                                        {item.organization}
                                                    </h3>
                                                    {item.location && (
                                                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                            {item.location}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="text-xs font-mono text-gray-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded w-fit whitespace-nowrap">
                                                    {item.period}
                                                </span>
                                            </div>

                                            {item.companyDescription && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic border-l-2 border-zinc-200 dark:border-zinc-800 pl-3 py-1">
                                                    {item.companyDescription}
                                                </p>
                                            )}
                                        </div>

                                        {/* Roles / Description Work */}
                                        <div className="flex flex-col gap-6 mt-1">
                                            {item.roles.map((role, rIndex) => (
                                                <div key={rIndex} className="flex flex-col gap-2">
                                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-md">
                                                        {role.title}
                                                    </h4>

                                                    {role.responsibilities && role.responsibilities.length > 0 && (
                                                        <ul className="pl-5 space-y-1.5">
                                                            {role.responsibilities.map((task, tIndex) => (
                                                                <li key={tIndex} className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed list-disc marker:text-gray-400">
                                                                    {task}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
