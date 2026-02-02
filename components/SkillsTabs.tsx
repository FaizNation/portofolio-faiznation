"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import skillsDataRaw from "@/data/skills.json";

type Category = "Languages" | "Frameworks" | "Tools" | "Contributions";

const tabs: Category[] = ["Languages", "Frameworks", "Tools", "Contributions"];

const skills: Record<string, string[]> = skillsDataRaw;

export default function SkillsTabs() {
    const [activeTab, setActiveTab] = useState<Category>("Languages");
    const [contributionCount, setContributionCount] = useState<number | null>(null);

    useEffect(() => {
        if (activeTab === "Contributions" && contributionCount === null) {
            const apiUrl = process.env.NEXT_PUBLIC_GITHUB_CONTRIBUTIONS_API;
            if (!apiUrl) return;

            fetch(apiUrl)
                .then((res) => res.json())
                .then((data) => {
                    if (data.contributions) {
                        const oneYearAgo = new Date();
                        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

                        const lastYearContributions = data.contributions
                            .filter((day: any) => new Date(day.date) >= oneYearAgo)
                            .reduce((acc: number, day: any) => acc + day.count, 0);

                        setContributionCount(lastYearContributions);
                    }
                })
                .catch((err) => console.error("Failed to fetch contributions:", err));
        }
    }, [activeTab, contributionCount]);

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-wrap gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl w-full md:w-fit justify-center md:justify-start">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
              relative flex-1 md:flex-none px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap
              ${activeTab === tab ? "text-black dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}
            `}
                    >
                        {activeTab === tab && (
                            <motion.div
                                layoutId="active-pill"
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
                        className={activeTab === "Contributions" ? "w-full" : "grid grid-cols-2 md:grid-cols-3 gap-3"}
                    >
                        {activeTab === "Contributions" ? (
                            <div className="flex flex-col gap-4 w-full">
                                <div className="font-medium text-gray-700 dark:text-gray-300">
                                    {contributionCount !== null ? (
                                        <span>{contributionCount} contributions in the last year</span>
                                    ) : (
                                        <span className="animate-pulse">Loading contributions...</span>
                                    )}
                                </div>
                                <div className="flex justify-center w-full bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 overflow-x-auto">
                                    <div className="min-w-[700px] md:min-w-full">
                                        <img
                                            src={process.env.NEXT_PUBLIC_GITHUB_CHART_URL || "https://ghchart.rshah.org/216e39/FaizNation"}
                                            alt="GitHub Contributions"
                                            className="w-full h-auto dark:invert dark:hue-rotate-180"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            skills[activeTab]?.map((skill) => (
                                <div
                                    key={skill}
                                    className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-xl hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
                                >
                                    <div className="w-2 h-2 rounded-full bg-black dark:bg-white/80" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {skill}
                                    </span>
                                </div>
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
