import Link from "next/link";
export const dynamic = 'force-dynamic';

import writingData from "@/data/writing.json";

interface BlogPost {
    title: string;
    publishedAt: string;
    slug: string;
    excerpt: string;
    readTime?: string;
}

const posts: BlogPost[] = writingData;

export default function Writing() {
    return (
        <div className="w-full max-w-3xl flex flex-col px-8 md:px-16 bg-white dark:bg-black">
            <section className="flex flex-col gap-8 py-16">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
                        Writing
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-sans">
                        Thoughts on software engineering, design, and technology.
                    </p>
                </div>

                <div className="flex flex-col gap-8 min-h-[30vh]">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/writing/${post.slug}`} // In a real app, this would lead to the blog post
                                className="group flex flex-col gap-2 cursor-pointer w-full no-underline"
                            >
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-lg text-gray-800 dark:text-gray-200 group-hover:underline decoration-dashed underline-offset-4 decoration-1">
                                        {post.title}
                                    </h3>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0 group-hover:text-black dark:group-hover:text-white transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                                        <path d="M7 17L17 7" />
                                        <path d="M7 7h10v10" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed md:max-w-[90%] font-sans mt-1">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-sm font-mono text-gray-500 whitespace-nowrap shrink-0">
                                        {post.publishedAt}
                                    </span>
                                    {post.readTime && (
                                        <span className="text-[12px] font-mono text-gray-500 dark:text-gray-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded leading-none shrink-0">
                                            {post.readTime}
                                        </span>
                                    )}

                                </div>


                            </Link>
                        ))
                    ) : (

                        <p className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors underline decoration-dashed hover:decoration-solid underline-offset-2">
                            I've been too lazy to write anything. Check back later!
                        </p>

                    )}
                </div>

            </section>
        </div>
    );
}
