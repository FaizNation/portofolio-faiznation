"use client";

import Link from "next/link";
import { useState } from "react";
import achievementsData from "@/data/achievements.json";
import ImageModal from "@/components/ImageModal";


export default function Achievements() {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const openModal = (index: number) => setSelectedIndex(index);
    const closeModal = () => setSelectedIndex(null);

    const nextImage = () => {
        if (selectedIndex === null) return;
        setSelectedIndex((prev) => (prev! + 1) % achievementsData.length);
    };

    const prevImage = () => {
        if (selectedIndex === null) return;
        setSelectedIndex((prev) => (prev! - 1 + achievementsData.length) % achievementsData.length);
    };

    return (
        <div className="w-full max-w-3xl flex flex-col px-8 md:px-16 bg-white dark:bg-black">
            <section className="flex flex-col gap-8 py-16">
                <Link href="/about" className="text-sm font-mono text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-2 w-fit">
                    &gt; cd ..
                </Link>
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
                        Achievements
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-sans">
                        Milestones and recognitions.
                    </p>
                </div>

                {/* Achievements List */}
                <div className="flex flex-col gap-6">
                    {achievementsData.map((achievement, index) => (
                        <div
                            key={achievement.id}
                            onClick={() => openModal(index)}
                            className="group flex items-center gap-2 cursor-pointer w-fit"
                        >
                            <h3 className="font-medium text-lg text-gray-600 dark:text-gray-400 group-hover:underline decoration-dashed underline-offset-4 decoration-1">
                                {achievement.title}
                            </h3>
                            <span className="text-sm font-mono text-gray-600 dark:text-gray-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                                {achievement.year}
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            >
                                <path d="M7 17L17 7" />
                                <path d="M7 7h10v10" />
                            </svg>
                        </div>
                    ))}
                </div>

            </section>

            <ImageModal
                isOpen={selectedIndex !== null}
                onClose={closeModal}
                imageSrc={selectedIndex !== null ? achievementsData[selectedIndex].imageSrc : ""}
                imageAlt={selectedIndex !== null ? achievementsData[selectedIndex].title : ""}
                caption={selectedIndex !== null ? achievementsData[selectedIndex].caption : undefined}
                link={selectedIndex !== null ? achievementsData[selectedIndex].link : undefined}
                onNext={() => { }}
                onPrev={() => { }}
                showNavigation={false}
            />
        </div>
    );
}
