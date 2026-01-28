import Link from "next/dist/client/link";

export default function About() {
    return (
        <div className="w-full max-w-3xl flex flex-col px-8 md:px-16 bg-white dark:bg-black">
            <section className="flex flex-col gap-8 py-16">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
                    About Me
                </h1>

                <div className="flex flex-col gap-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
                    <p>
                        Hello! I'm Fadly Fais Fajarruddin, a software engineer passionate about building accessible and performant web applications.
                    </p>
                    <p>
                        I enjoy exploring new technologies and sharing my knowledge with the developer community.
                        This portfolio serves as a playground for my experiments and a showcase of my work.
                    </p>
                    <p>
                        When I'm not coding, you can find me [add hobbies here].
                    </p>
                </div>

                <div className="mt-6 font-mono text-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-500">
              <span>&gt;</span>
              <span>ls</span>
            </div>
            <div className="flex items-center gap-8 pl-4">
              <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors underline decoration-dashed underline-offset-4 decoration-1 hover:decoration-solid">
                /about
              </Link>
              <Link href="/projects" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors underline decoration-dashed underline-offset-4 decoration-1 hover:decoration-solid">
                /projects
              </Link>
              <Link href="/writing" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors underline decoration-dashed underline-offset-4 decoration-1 hover:decoration-solid">
                /writing
              </Link>
            </div>
          </div>
            </section>
        </div>
    );
}
