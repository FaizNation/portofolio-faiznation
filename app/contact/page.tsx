import Link from "next/link";

export default function Contact() {
    return (
        <div className="w-full max-w-3xl flex flex-col px-8 md:px-16 bg-white dark:bg-black">
            <section className="flex flex-col gap-8 py-16">
                <Link href="/about" className="text-sm font-mono text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-2 w-fit">
                    &gt; cd ..
                </Link>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
                    Contact
                </h1>

                <div className="flex flex-col gap-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
                    <p>
                        I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                    </p>

                    <div className="flex flex-col gap-4 mt-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                            <span className="font-bold text-black dark:text-white min-w-[100px]">Email</span>
                            <Link href="mailto:fadlyfaiz88@gmail.com" className="hover:text-black dark:hover:text-white transition-colors underline decoration-dashed underline-offset-4 decoration-1 hover:decoration-solid truncate">
                                fadlyfaiz88@gmail.com
                            </Link>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                            <span className="font-bold text-black dark:text-white min-w-[100px]">LinkedIn</span>
                            <Link href="https://linkedin.com/in/fadly-faiz" target="_blank" className="hover:text-black dark:hover:text-white transition-colors underline decoration-dashed underline-offset-4 decoration-1 hover:decoration-solid truncate">
                                linkedin.com/in/fadly-faiz
                            </Link>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                            <span className="font-bold text-black dark:text-white min-w-[100px]">GitHub</span>
                            <Link href="https://github.com/FaizNation" target="_blank" className="hover:text-black dark:hover:text-white transition-colors underline decoration-dashed underline-offset-4 decoration-1 hover:decoration-solid truncate">
                                github.com/FaizNation
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
