import ProjectCard, { Project } from "@/components/ProjectCard";

import projectsDataRaw from "@/data/projects.json";

const projects: Project[] = projectsDataRaw as Project[];

export default function Projects() {
    return (
        <div className="w-full max-w-3xl flex flex-col px-8 md:px-16 bg-white dark:bg-black">
            <section className="flex flex-col gap-8 py-16">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
                        Projects
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-sans">
                        A selection of projects I've worked on.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} project={project} />
                    ))}
                </div>

            </section>
        </div>
    );
}
