"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-md border-b border-white/10 h-16 flex items-center justify-between px-4 md:px-6">
                {/* Left: Logo and Links */}
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <svg
                            viewBox="0 0 398 52"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-auto text-white group-hover:opacity-80 transition-opacity"
                        >
                            <motion.path
                                d="M31.248 2.63999V11.408H12.944V20.88H26.64V29.392H12.944V47.568H1.99998V2.63999H31.248ZM64.968 39.632H48.2L45.512 47.568H34.056L50.312 2.63999H62.984L79.24 47.568H67.656L64.968 39.632ZM62.152 31.184L56.584 14.736L51.08 31.184H62.152ZM95.1315 2.63999V47.568H84.1875V2.63999H95.1315ZM114.71 38.608H134.038V47.568H102.294V39.248L121.494 11.6H102.294V2.63999H134.038V10.96L114.71 38.608ZM194.942 47.568H183.998L165.694 19.856V47.568H154.75V2.63999H165.694L183.998 30.48V2.63999H194.942V47.568ZM230.843 39.632H214.075L211.387 47.568H199.931L216.187 2.63999H228.859L245.115 47.568H233.531L230.843 39.632ZM228.027 31.184L222.459 14.736L216.955 31.184H228.027ZM282.382 2.63999V11.408H270.478V47.568H259.534V11.408H247.63V2.63999H282.382ZM298.819 2.63999V47.568H287.875V2.63999H298.819ZM327.998 48.016C323.774 48.016 319.891 47.0347 316.35 45.072C312.851 43.1093 310.057 40.3787 307.966 36.88C305.918 33.3387 304.894 29.3707 304.894 24.976C304.894 20.5813 305.918 16.6347 307.966 13.136C310.057 9.63733 312.851 6.90666 316.35 4.94399C319.891 2.98133 323.774 1.99999 327.998 1.99999C332.222 1.99999 336.083 2.98133 339.582 4.94399C343.123 6.90666 345.897 9.63733 347.902 13.136C349.95 16.6347 350.974 20.5813 350.974 24.976C350.974 29.3707 349.95 33.3387 347.902 36.88C345.854 40.3787 343.081 43.1093 339.582 45.072C336.083 47.0347 332.222 48.016 327.998 48.016ZM327.998 38.032C331.582 38.032 334.441 36.8373 336.574 34.448C338.75 32.0587 339.838 28.9013 339.838 24.976C339.838 21.008 338.75 17.8507 336.574 15.504C334.441 13.1147 331.582 11.92 327.998 11.92C324.371 11.92 321.47 13.0933 319.294 15.44C317.161 17.7867 316.094 20.9653 316.094 24.976C316.094 28.944 317.161 32.1227 319.294 34.512C321.47 36.8587 324.371 38.032 327.998 38.032ZM397.254 47.568H386.31L368.006 19.856V47.568H357.062V2.63999H368.006L386.31 30.48V2.63999H397.254V47.568Z"
                                stroke="currentColor"
                                strokeWidth="0.5"
                                fill="currentColor"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                            />
                        </svg>
                    </Link>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
                        <Link href="#" className="hover:text-white transition-colors">
                            Home
                        </Link>
                        <Link href="#" className="hover:text-white transition-colors">
                            Showcase
                        </Link>
                        <Link href="#" className="hover:text-white transition-colors">
                            Docs
                        </Link>
                        <Link href="#" className="hover:text-white transition-colors">
                            Blog
                        </Link>
                    </div>
                </div>

                {/* Right: Search Bar & Mobile Menu Toggle */}
                <div className="flex items-center gap-4">
                    <div className="relative group hidden md:block">
                        <button className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all outline-none w-64 justify-between">
                            <span>Search...</span>
                            <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-gray-400">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                    <AnimatedThemeToggler />
                    </div>

                    {/* Search Icon for Mobile */}
                    <button className="md:hidden p-2 text-gray-400 hover:text-white">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-gray-400 hover:text-white"
                    >
                        {isMobileMenuOpen ? (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-16 left-0 right-0 z-30 bg-black/90 backdrop-blur-md border-b border-white/10 md:hidden"
                    >
                        <div className="flex flex-col p-4 gap-4">
                            <Link
                                href="#"
                                className="text-gray-400 hover:text-white py-2 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-400 hover:text-white py-2 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Showcase
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-400 hover:text-white py-2 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Docs
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-400 hover:text-white py-2 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Blog
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
