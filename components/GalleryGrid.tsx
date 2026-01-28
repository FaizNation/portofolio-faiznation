"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ImageModal from "./ImageModal";

export interface GalleryItem {
    src: string;
    alt: string;
    caption?: string;
    span?: string;
}

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const openModal = (index: number) => setSelectedIndex(index);
    const closeModal = () => setSelectedIndex(null);

    const nextImage = () => {
        if (selectedIndex === null) return;
        setSelectedIndex((prev) => (prev! + 1) % items.length);
    };

    const prevImage = () => {
        if (selectedIndex === null) return;
        setSelectedIndex((prev) => (prev! - 1 + items.length) % items.length);
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[200px]">
                {items.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => openModal(index)}
                        className={`relative group rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 cursor-pointer ${item.span || ""}`}
                    >
                        <motion.img
                            src={item.src}
                            alt={item.alt}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                        {item.caption && (
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="text-white text-sm font-medium">{item.caption}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <ImageModal
                isOpen={selectedIndex !== null}
                onClose={closeModal}
                imageSrc={selectedIndex !== null ? items[selectedIndex].src : ""}
                imageAlt={selectedIndex !== null ? items[selectedIndex].alt : ""}
                caption={selectedIndex !== null ? items[selectedIndex].caption : undefined}
                onNext={nextImage}
                onPrev={prevImage}
            />
        </>
    );
}
