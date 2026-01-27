import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full max-w-3xl flex flex-col px-8 md:px-16 bg-white dark:bg-black">

      {/* Hero Section */}
      <section className="flex flex-col gap-4 py-16">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
          Hi, I'm Faiz <span className="animate-wave inline-block">👋</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
          My name is Fadly Fais Fajarruddin, but u can call me Fais or whatever u like.
          I like coding, especially with the help of AI, or what is known as <Link href="https://www.ibm.com/think/topics/vibe-coding" target="_blank" className="text-black dark:text-white font-medium underline decoration-dashed hover:decoration-solid underline-offset-4 decoration-1">vibe coder</Link>.
          Idk if I am worthy of that title.  btw, welcome to my website. Feel free to explore this site as u like.
          Here I will share my experiences. Want to know more <Link href="/about" className="text-black dark:text-white font-medium underline decoration-dashed hover:decoration-solid underline-offset-4 decoration-1">/about</Link> me?
        </p>

      </section>
    </div>
  );
}
