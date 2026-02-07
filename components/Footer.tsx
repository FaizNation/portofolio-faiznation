export const dynamic = 'force-dynamic';

export default async function Footer() {
    let commitHash = "unknown";
    let commitUrl = "#";

    try {
        const commitApiUrl = process.env.GITHUB_COMMITS_URL || "";
        const res = await fetch(commitApiUrl, {
            next: { revalidate: 3600 },
        });
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                commitHash = data[0].sha.substring(0, 7);
                commitUrl = data[0].html_url;
            }
        }
    } catch (error) {
        console.error("Failed to fetch commit:", error);
    }

    return (
        <footer className="w-full flex justify-center bg-zinc-50 dark:bg-black py-8">
            <div className="w-full max-w-3xl px-16 flex flex-col items-center gap-4 text-xs md:text-sm text-gray-600 dark:text-gray-400 border-t border-black/10 dark:border-white/10 pt-8">

                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 font-medium">
                    <div className="flex items-center gap-2">
                        <span>crafted w/</span>
                        <a
                            href="https://nextjs.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black dark:text-white hover:opacity-80 transition-opacity"
                            aria-label="Next.js"
                        >
                            <svg
                                viewBox="0 0 180 180"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 bg-white dark:bg-black rounded-full"
                            >
                                <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
                                    <circle cx="90" cy="90" r="90" fill="black" />
                                </mask>
                                <g mask="url(#mask0)">
                                    <circle cx="90" cy="90" r="90" fill="currentColor" stroke="currentColor" strokeWidth="6" />
                                    <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="white" className="dark:fill-black" />
                                    <rect x="115" y="54" width="12" height="72" fill="white" className="dark:fill-black" />
                                </g>
                            </svg>
                        </a>
                    </div>

                    <div className="flex items-center gap-2">
                        <span>last commit</span>
                        <a
                            href={commitUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono hover:text-black dark:hover:text-white transition-colors underline decoration-dashed hover:decoration-solid underline-offset-2"
                        >
                            {commitHash}
                        </a>
                    </div>
                </div>

                <p>© {new Date().getFullYear()} FaizNation. All rights reserved.</p>
            </div>
        </footer>
    );
}
