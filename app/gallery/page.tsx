"use client";

import Link from "next/link";
import { useState } from "react";

import galleryData from "@/data/gallery.json";

interface GalleryAlbum {
    title: string;
    year: string;
    slug: string;
}

const albums: GalleryAlbum[] = galleryData as GalleryAlbum[];
const ITEMS_PER_PAGE = 10;

export default function Gallery() {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(albums.length / ITEMS_PER_PAGE);
    const isPaginated = albums.length > ITEMS_PER_PAGE;

    const visibleAlbums = isPaginated
        ? albums.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
        : albums;

    return (
        <div className="w-full max-w-3xl flex flex-col px-8 md:px-16 bg-white dark:bg-black">
            <section className="flex flex-col gap-8 py-16">
                <Link href="/about" className="text-sm font-mono text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-2 w-fit">
                    &gt; cd ..
                </Link>
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
                        Gallery
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-sans">
                        Collections of moments and memories.
                    </p>
                </div>

                {/* Album List */}
                <div className="flex flex-col gap-6">
                    {visibleAlbums.map((album) => (
                        <Link
                            key={album.slug}
                            href={`/gallery/${album.slug}`}
                            className="group flex items-center gap-2 cursor-pointer no-underline w-fit"
                        >
                            <h3 className="font-medium text-lg text-gray-600 dark:text-gray-400 group-hover:underline decoration-dashed underline-offset-4 decoration-1">
                                {album.title}
                            </h3>
                            <span className="text-sm font-mono text-gray-600 dark:text-gray-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                                {album.year}
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
                        </Link>
                    ))}
                </div>

                {/* Pagination — only shown when there are more than 10 albums */}
                {isPaginated && (
                    <div className="flex items-center gap-2 pt-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded text-sm font-mono transition-colors ${
                                    currentPage === page
                                        ? "bg-black text-white dark:bg-white dark:text-black"
                                        : "text-gray-500 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}

            </section>
        </div>
    );
}

