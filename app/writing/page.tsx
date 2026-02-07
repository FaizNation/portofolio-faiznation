import Link from "next/link";
export const dynamic = 'force-dynamic';

interface BlogPost {
    title: string;
    publishedAt: string;
    slug: string;
    excerpt: string;
}

const posts: BlogPost[] = [];

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
                                className="group flex flex-col gap-2 cursor-pointer"
                            >
                                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1">
                                    <h3 className="font-bold text-xl text-black dark:text-white group-hover:underline decoration-dashed underline-offset-4 decoration-1">
                                        {post.title}
                                    </h3>
                                    <span className="text-sm font-mono text-gray-500 whitespace-nowrap">
                                        {post.publishedAt}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed md:max-w-[90%]">
                                    {post.excerpt}
                                </p>
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
