import Link from "next/link";
import { Mail, Instagram, Linkedin, Facebook, Github } from "lucide-react";
import SkillsTabs from "@/components/SkillsTabs";
import ExperienceTabs from "@/components/ExperienceTabs";
export const dynamic = 'force-dynamic';

export default function About() {
  return (
    <div className="w-full max-w-3xl flex flex-col px-8 md:px-16 bg-white dark:bg-black">
      <section className="flex flex-col gap-8 py-16">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
          About Me
        </h1>

        <div className="flex flex-col gap-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
          <p>
            Okay, let's do this one last time. For real this time. My name is Fadly Faiz Fajarruddin.
            I was born in karanganyar, Central Java, and I'm a 19 year old. I am a student at the State University of Surabaya, majoring in Informatics Engineering.
          </p>
          <p>
            I focus on UI/UX Design and Frontend Development. I am a person who is passionate about technology and always curious to learn new things. I am also a person who is responsible and always tries to do my best in everything I do.
          </p>
          <p>
            Curious about my full professional journey? Take a look at my <Link href="/Curriculum Vitae_Fadly Fais Fajarruddin.pdf" target="_blank" className="underline decoration-dashed hover:decoration-solid underline-offset-4 decoration-1 text-black dark:text-white transition-colors">career</Link>.
          </p>

        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-black dark:text-white">Connect</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link
              href="mailto:fadlyfaizfajarruddin@gmail.com"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors group"
            >
              <Mail className="w-5 h-5" />
              <span className="underline decoration-dashed group-hover:decoration-solid underline-offset-4 decoration-1">Email</span>
            </Link>
            <Link
              href="https://www.instagram.com/faiz_natioon/"
              target="_blank"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors group"
            >
              <Instagram className="w-5 h-5" />
              <span className="underline decoration-dashed group-hover:decoration-solid underline-offset-4 decoration-1">Instagram</span>
            </Link>
            <Link
              href="https://www.linkedin.com/in/fadly-fais-fajarruddin/"
              target="_blank"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors group"
            >
              <Linkedin className="w-5 h-5" />
              <span className="underline decoration-dashed group-hover:decoration-solid underline-offset-4 decoration-1">LinkedIn</span>
            </Link>
            <Link
              href="https://www.facebook.com/fadly.faiz.716"
              target="_blank"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors group"
            >
              <Facebook className="w-5 h-5" />
              <span className="underline decoration-dashed group-hover:decoration-solid underline-offset-4 decoration-1">Facebook</span>
            </Link>
            <Link
              href="https://github.com/FaizNation"
              target="_blank"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors group"
            >
              <Github className="w-5 h-5" />
              <span className="underline decoration-dashed group-hover:decoration-solid underline-offset-4 decoration-1">GitHub</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-black dark:text-white">Skills & Tools</h2>
          <SkillsTabs />
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-black dark:text-white">Journey</h2>
          <ExperienceTabs />
        </div>

        <div className="mt-6 font-mono text-sm flex flex-col gap-2">
          <div className="flex items-center gap-2 text-gray-500">
            <span>&gt;</span>
            <span>ls</span>
          </div>
          <div className="grid grid-cols-2 md:flex md:items-center gap-4 md:gap-8 pl-4">
            <Link href="/gallery" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors underline decoration-dashed underline-offset-4 decoration-1 hover:decoration-solid">
              /gallery
            </Link>
            <Link href="/achievements" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors underline decoration-dashed underline-offset-4 decoration-1 hover:decoration-solid">
              /achievements
            </Link>
            <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors underline decoration-dashed underline-offset-4 decoration-1 hover:decoration-solid">
              /contact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
