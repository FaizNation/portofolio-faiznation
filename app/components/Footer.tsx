export default async function Footer() {
    let commitHash = "unknown";
    let commitUrl = "#";

    try {
        const res = await fetch("https://api.github.com/repos/FaizNation/portofolio-faiznation/commits?per_page=1", {
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

                <div className="flex items-center gap-6 font-medium">
                    <div className="flex items-center gap-2">
                        <span>build with</span>
                        <svg
                            viewBox="-10.5 -9.45 21 18.9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-gray-800 dark:text-gray-200"
                        >
                            <circle cx="0" cy="0" r="2" fill="currentColor"></circle>
                            <g stroke="currentColor" strokeWidth="1" fill="none">
                                <ellipse rx="10" ry="4.5"></ellipse>
                                <ellipse rx="10" ry="4.5" transform="rotate(60)"></ellipse>
                                <ellipse rx="10" ry="4.5" transform="rotate(120)"></ellipse>
                            </g>
                        </svg>
                    </div>

                    <div className="flex items-center gap-2">
                        <span>build on commit</span>
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
