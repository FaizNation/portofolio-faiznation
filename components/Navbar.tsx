"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const NAV_LINKS = [
        { name: "/about", href: "/about" },
        { name: "/projects", href: "/projects" },
        { name: "/writing", href: "/writing" },
    ];

    return (
        <>
            <nav className="fixed top-0 inset-x-0 mx-auto z-40 w-full max-w-3xl bg-white/50 dark:bg-black/50 backdrop-blur-md border-b border-black/10 dark:border-white/10 h-16 flex items-center justify-between px-8 md:px-16">
                {/* Left: Logo and Links */}
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <svg
                            viewBox="0 0 43 34"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-auto group-hover:opacity-80 transition-opacity"
                        >
                            <motion.path
                                d="M37.103 0.00309659C39.674 -0.0579034 41.9786 2.16417 42.1206 4.70817C42.1076 7.35696 42.1677 10.0057 42.1597 12.6515C42.2127 17.0804 42.1746 21.5137 42.2036 25.9435C42.209 26.0873 42.2062 26.2309 42.1978 26.3732C42.1996 26.8967 42.2002 27.4201 42.2036 27.9435C42.2886 30.2015 40.6245 32.3169 38.4565 32.8859C35.6036 33.7219 32.3028 31.5511 32.1206 28.5412C32.0376 21.3162 32.0195 14.1021 32.0015 6.87614C32.0023 6.83313 32.0053 6.79007 32.0073 6.74724C32.0057 6.12362 32.003 5.49993 32.0015 4.87614C32.0525 2.23529 34.4522 -0.0926351 37.103 0.00309659Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="text-black dark:text-white"
                                fill="currentColor"
                                initial={{ pathLength: 0, fillOpacity: 0 }}
                                animate={{
                                    pathLength: [0, 1, 1, 1, 0],
                                    fillOpacity: [0, 0, 1, 0, 0]
                                }}
                                transition={{
                                    duration: 5,
                                    ease: "easeInOut",
                                    repeat: Infinity,
                                    repeatDelay: 0.5,
                                    times: [0, 0.3, 0.45, 0.6, 1]
                                }}
                            />
                            <motion.path
                                d="M4.61876 0.00305317C8.61132 0.0314683 12.6066 -0.00590453 16.5983 0.0460219C18.983 0.0381828 21.3709 0.0978205 23.7584 0.0850844C26.0513 0.22423 28.0536 2.48178 27.9986 5.0011C28.0412 6.28108 27.553 7.50059 26.7623 8.41516C26.658 8.62102 26.5386 8.82041 26.4029 9.00989C24.7332 11.0662 23.1206 13.1686 21.4566 15.2257C18.7445 18.6834 15.9593 22.0875 13.2272 25.5304C11.8399 27.3475 10.454 29.1663 9.06407 30.9835C8.85397 31.2461 8.61621 31.4813 8.35802 31.6886C7.46101 32.5189 6.28731 33.0253 5.06407 32.9962C5.00745 32.998 4.95085 32.9976 4.89415 32.9972C3.92799 33.004 3.00385 32.6753 2.22423 32.1183C2.20668 32.1059 2.18889 32.0938 2.17149 32.0812C2.14058 32.0585 2.11013 32.0352 2.0797 32.0118C0.793425 31.0325 -0.0561366 29.4177 0.00450066 27.7238C0.01366 26.253 0.0155171 24.7818 0.0162194 23.3107C0.0132661 21.2721 0.0099009 19.2336 0.00547723 17.1954C-0.00292679 16.9839 0.0040981 16.7739 0.0240319 16.5665C0.0125288 13.0753 0.0133644 9.58411 0.00547723 6.09387C-0.00365849 5.87298 0.00146484 6 0.00139312 5.5C0.0013353 5.09695 0.00857794 4.25403 0.164657 3.67493C0.677526 1.55055 2.58367 -0.0802372 4.61876 0.00305317Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="text-black dark:text-white"
                                fill="currentColor"
                                initial={{ pathLength: 0, fillOpacity: 0 }}
                                animate={{
                                    pathLength: [0, 1, 1, 1, 0],
                                    fillOpacity: [0, 0, 1, 0, 0]
                                }}
                                transition={{
                                    duration: 5,
                                    ease: "easeInOut",
                                    repeat: Infinity,
                                    repeatDelay: 0.5,
                                    times: [0, 0.3, 0.45, 0.6, 1]
                                }}
                            />
                        </svg>
                    </Link>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                        {NAV_LINKS.map((link) => (
                            <Link key={link.name} href={link.href} className="relative group transition-colors hover:text-black dark:hover:text-white">
                                {link.name}
                                <span className="absolute left-0 -bottom-1 w-full h-[1px] bg-black dark:bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right: Search Bar & Mobile Menu Toggle */}
                <div className="flex items-center gap-4">
                    <div className="relative group hidden md:block">
                        <button className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full px-4 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-white/20 hover:bg-black/10 dark:hover:bg-white/10 transition-all outline-none w-64 justify-between">
                            <span>Search...</span>
                            <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-1.5 font-mono text-[10px] font-medium text-gray-600 dark:text-gray-400">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <AnimatedThemeToggler />
                    </div>

                    {/* Search Icon for Mobile */}
                    <button className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
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
                        className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
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
                        className="fixed top-16 left-0 right-0 z-30 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-black/10 dark:border-white/10 md:hidden"
                    >
                        <div className="flex flex-col p-4 gap-4">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white py-2 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
