"use client";

import React, { useEffect, useState, useRef } from "react";
import { Copy, Twitter, Link as LinkIcon, Check, Terminal } from "lucide-react";

// --- Custom Blocks --- //

const Callout = ({ children, type = "info" }: { children: React.ReactNode, type?: "info" | "warning" }) => {
  return (
    <div className={`my-8 flex gap-4 p-5 rounded-xl border-l-4 ${type === 'warning' ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-500 text-orange-900 dark:text-orange-200' : 'bg-blue-50 dark:bg-blue-950/20 border-blue-500 text-blue-900 dark:text-blue-200'}`}>
      <div className="mt-0.5 text-lg">
        {type === 'warning' ? '⚠️' : '💡'}
      </div>
      <div className="text-base leading-relaxed">
        {children}
      </div>
    </div>
  );
};

const CodeBlock = ({ code, language }: { code: string, language: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-8 group rounded-xl overflow-hidden bg-[#121212] border border-zinc-800/80 shadow-lg">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a1a] border-b border-zinc-800">
        <span className="text-xs font-mono text-zinc-400 font-medium">{language.toLowerCase()}</span>
        <button 
          onClick={handleCopy}
          className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="p-5 overflow-x-auto">
        <pre className="text-[13px] sm:text-sm font-mono text-zinc-300 leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

const TerminalBlock = ({ command, output }: { command: string, output?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = command.replace(/\\n/g, "\n");
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-8 rounded-xl overflow-hidden bg-black border border-zinc-800 shadow-2xl relative group w-full max-w-full">
      <div className="flex items-center px-4 py-3 bg-[#1e1e1e] border-b border-zinc-800 relative w-full">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-[11px] font-semibold text-zinc-400 font-mono tracking-wider">
          <Terminal size={14} /> terminal
        </div>
        <button 
          onClick={handleCopy}
          className="absolute right-3 p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Copy command"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="w-full overflow-x-auto custom-scrollbar">
        <div className="p-4 sm:p-5 font-mono text-[12px] sm:text-sm flex flex-col gap-2 text-zinc-300 leading-relaxed min-w-max">
          {command.split("\\n").map((cmd, i) => (
            cmd.trim() && (
              <div key={i} className="flex gap-3">
                <span className="text-green-400 select-none shrink-0">➜</span>
                <span className="text-blue-400 select-none shrink-0">~</span>
                <span className="whitespace-pre">{cmd}</span>
              </div>
            )
          ))}
          {output && (
            <div className="mt-3 text-zinc-400 whitespace-pre-wrap leading-relaxed">
              {output}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ImagePlaceholder = ({ caption }: { caption?: string }) => {
  return (
    <figure className="my-10 w-full max-w-full">
      <div className="w-full aspect-video rounded-xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 shadow-inner overflow-hidden">
        <span className="text-zinc-400 dark:text-zinc-500 flex flex-col items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          <span className="text-sm font-medium tracking-wide">Image Placeholder</span>
        </span>
      </div>
      {caption && <figcaption className="mt-4 text-center text-sm text-zinc-500 font-medium">{caption}</figcaption>}
    </figure>
  );
};

// --- Page Layout & Scrollspy --- //

export default function WritingExamplePage() {
  const [activeId, setActiveId] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [copiedLink, setCopiedLink] = useState(false);

  // Example headings metadata
  const headings = [
    { id: "introduction", label: "Introduction", depth: 2 },
    { id: "the-challenge", label: "The Challenge", depth: 2 },
    { id: "code-example", label: "Code Example", depth: 3 },
    { id: "solution", label: "Solution", depth: 2 },
    { id: "conclusion", label: "Conclusion", depth: 2 },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const headingElements = Array.from(contentRef.current.querySelectorAll("h2, h3"));
      
      let currentActiveId = "";
      let minDistance = Infinity;

      for (const element of headingElements) {
        const rect = element.getBoundingClientRect();
        // Determine the heading closest to the top of viewport (with some offset)
        if (rect.top >= -100 && rect.top <= window.innerHeight / 2) {
            if (rect.top < minDistance) {
                minDistance = rect.top;
                currentActiveId = element.id;
            }
        }
      }
      
      // Fallback: If no heading is near the top (e.g. scrolled far down), get the last passed heading
      if (!currentActiveId) {
          const passsedHeadings = headingElements.filter(e => e.getBoundingClientRect().top < 0);
          if (passsedHeadings.length > 0) {
              currentActiveId = passsedHeadings[passsedHeadings.length - 1].id;
          }
      }

      if (currentActiveId && currentActiveId !== activeId) {
        setActiveId(currentActiveId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once initially to check if already scrolled
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeId]);

  const handleShareTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Check out this article!");
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-16 pt-24 lg:pt-32">
      <div className="flex flex-col lg:flex-row justify-center gap-10 xl:gap-16 relative w-full">
        
        {/* Left Column: TOC & Share (Sticky Desktop) */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-32 flex flex-col gap-10">
            {/* Table of Contents */}
            <nav className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4 px-3">
                On this page
              </span>
              {headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  className={`text-sm py-1.5 px-3 w-fit transition-all duration-200 ${
                    activeId === heading.id 
                      ? "text-black dark:text-white font-semibold underline decoration-dashed underline-offset-4 decoration-1" 
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:underline decoration-dashed underline-offset-4 decoration-1"
                  } ${heading.depth === 3 ? "ml-4" : ""}`}
                >
                  {heading.label}
                </a>
              ))}
            </nav>

            {/* Share Links */}
            <div className="flex flex-col gap-4 px-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Share
              </span>
              <div className="flex gap-3">
                <button 
                  onClick={handleShareTwitter}
                  className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all border border-transparent dark:hover:border-blue-500/30"
                  aria-label="Share on Twitter"
                >
                  <Twitter size={18} />
                </button>
                <button 
                  onClick={handleCopyLink}
                  className="relative p-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all border border-transparent dark:hover:border-zinc-600"
                  aria-label="Copy Link"
                >
                  {copiedLink ? <Check size={18} className="text-green-500" /> : <LinkIcon size={18} />}
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Center/Right Column: Main Content */}
        <main ref={contentRef} className="flex-1 max-w-3xl min-w-0 w-full pb-32">
          <article className="max-w-none w-full break-words">
            {/* Header */}
            <header className="mb-14">
              <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400 mb-6 font-medium">
                <time dateTime="2026-04-21">April 21, 2026</time>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span>5 min read</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6 leading-[1.15]">
                Building Modern Web Interfaces with Interactive UI Components
              </h1>
              <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                A case study on developing clean, readable, and highly interactive structural patterns for technical blogs.
              </p>
            </header>

            <ImagePlaceholder caption="An impressive placeholder framing our main header image." />

            {/* Content Body Styled Interactively */}
            <div className="space-y-6 text-[17px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
              
              <h2 id="introduction" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-6 scroll-mt-32">
                Introduction
              </h2>
              <p>
                When designing a technical blog, readability is paramount. But beyond simple prose, technical content heavily relies on specialized components to convey context efficiently. This is why <strong>callout boxes</strong>, <strong>interactive code snippets</strong>, and clear typography pairings are crucial to keep readers engaged.
              </p>
              
              <Callout type="info">
                The goal is to create a seamless reading experience where context switches (like reading code or taking note of a warning) feel natural and embedded within the text.
              </Callout>

              <h2 id="the-challenge" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-6 scroll-mt-32">
                The Challenge
              </h2>
              <p>
                Reading dense blocks of text can get exhausting. A good content structure utilizes various techniques to break down the information into digestible chunks. Here are structural elements we often need:
              </p>
              
              <ul className="list-disc list-outside pl-6 space-y-3 marker:text-zinc-400">
                <li>Consistent responsive layouts (like a sticky TOC).</li>
                <li>Syntax highlighting blocks that actually copy to the clipboard.</li>
                <li>Visual cues like terminal emulators to differentiate shell commands from actual application code.</li>
              </ul>

              <h3 id="code-example" className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-12 mb-5 scroll-mt-32">
                Handling Syntax: Code Block Example
              </h3>
              <p>
                Developers appreciate a "Copy" button. It reduces friction when they are following a guide or tutorial. Here is an example code block component implementation:
              </p>

              <CodeBlock 
                language="TypeScript" 
                code={`export async function fetchUser(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error("Unauthorized");
  }

  return Response.json({ user: session.user });
}`} 
              />

              <h2 id="solution" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-6 scroll-mt-32">
                Terminal and OS Styles
              </h2>
              <p>
                Below is a macOS-style terminal simulator block. This is highly effective when you want to instruct the user to run CLI commands, distinct from standard application code.
              </p>

              <TerminalBlock 
                command="npx create-next-app@latest my-app --typescript --tailwind --eslint" 
                output={`Creating a new Next.js app in /path/to/my-app.
Using pnpm.

Initializing project with template: app
Installing dependencies...`}
              />

              <Callout type="warning">
                Always ensure your website handles overflow correctly. Long command lines should never break the layout of your container grid! Use scrolling containers for code blocks.
              </Callout>

              <h2 id="conclusion" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-6 scroll-mt-32">
                Conclusion
              </h2>
              <p>
                Integrating features like scrollspy Table of Contents, tailored custom blocks (callouts, terminal windows, code blocks) doesn't just improve aesthetics; it deeply enhances the usability and premium feel of a portfolio or technical blog.
              </p>
              <p>
                Try scrolling up and down the page to observe the left sidebar adapting to the current reading context. Feel free to copy block elements or share using the left-hand controls!
              </p>
              
            </div>
          </article>
        </main>

        {/* Right Spacer (Forces Main Column to Center Perfectly) */}
        <div className="hidden lg:block w-64 shrink-0" aria-hidden="true" />
      </div>
    </div>
  );
}
