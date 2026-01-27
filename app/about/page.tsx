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
            </section>
        </div>
    );
}
