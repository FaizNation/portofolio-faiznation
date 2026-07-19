"use client";

import React, { useEffect, useState, useRef } from "react";
import { Copy, Twitter, Link as LinkIcon, Check, Terminal } from "lucide-react";
import Link from "next/link";

// --- Custom Blocks --- //

const Callout = ({ children, type = "info" }: { children: React.ReactNode, type?: "info" | "warning" }) => {
  return (
    <div className={`my-8 flex gap-4 p-5 rounded-xl border-l-4 ${type === 'warning' ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-500 text-orange-900 dark:text-orange-200' : 'bg-blue-50 dark:bg-blue-950/20 border-blue-500 text-blue-900 dark:text-blue-200'}`}>
      <div className="mt-0.5 text-lg">
        {type === 'warning' ? '⚠️' : '💡'}
      </div>
      <div className="text-base leading-relaxed w-full">
        {children}
      </div>
    </div>
  );
};

const TerminalBlock = ({ command, output }: { command: string, output?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Konversi literal "\n" menjadi baris baru aslinya, lalu salin
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
        </div>
        {output && (
          <div className="mt-4 pt-4 border-t border-zinc-800 text-zinc-400 whitespace-pre-wrap leading-relaxed">
            {output}
          </div>
        )}
      </div>
    </div>
  );
};

const ImagePlaceholder = ({ caption, src }: { caption?: string, src?: string }) => {
  return (
    <figure className="my-10 w-full max-w-full">
      <div className="w-full aspect-video rounded-xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 shadow-inner overflow-hidden">
        {src ? (
          <img src={src} alt={caption} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <span className="text-zinc-400 dark:text-zinc-500 flex flex-col items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            <span className="text-sm font-medium tracking-wide">Area Visualisasi</span>
          </span>
        )}
      </div>
      {caption && <figcaption className="mt-4 text-center text-sm text-zinc-500 font-medium">{caption}</figcaption>}
    </figure>
  );
};

// --- Page Layout & Scrollspy --- //

export default function LearnGitPage() {
  const [activeId, setActiveId] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  const [copiedLink, setCopiedLink] = useState(false);

  // Table of Contents Definitions
  const headings = [
    { id: "persiapan-awal", label: "1. Persiapan Awal", depth: 2 },
    { id: "memulai-proyek", label: "2. Memulai Proyek", depth: 2 },
    { id: "menghubungkan-lokal", label: "3. Remote Server", depth: 2 },
    { id: "bergabung-tim", label: "4. Clone Proyek", depth: 2 },
    { id: "branch-fitur", label: "5. Branch Fitur", depth: 2 },
    { id: "git-stash", label: "6. Git Stash", depth: 2 },
    { id: "mengambil-pembaruan", label: "7. Fetch & Pull", depth: 2 },
    { id: "menggabungkan-fitur", label: "8. Git Merge", depth: 2 },
    { id: "patching", label: "9. Git Patching", depth: 2 },
    { id: "memperbaiki-typo", label: "10. Git Amend", depth: 2 },
    { id: "membatalkan-perubahan", label: "11. Git Restore", depth: 2 },
    { id: "membatalkan commit", label: "12. Git Revert", depth: 2 },
    { id: "hard-reset", label: "13. Hard Reset", depth: 2 },
    { id: "konflik-merge", label: "14. Konflik Merge", depth: 2 },
    { id: "cherry-pick", label: "15. Cherry-Pick", depth: 2 },
    { id: "rebase", label: "16. Git Rebase", depth: 2 },
    { id: "squash", label: "17. Git Squash", depth: 2 },
    { id: "blame", label: "18. Git Blame", depth: 2 },
    { id: "tagging", label: "19. Git Tagging", depth: 2 },
    { id: "membersihkan-branch", label: "20. Git Prune & Delete", depth: 2 },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const headingElements = Array.from(contentRef.current.querySelectorAll("h2, h3"));

      let currentActiveId = "";
      let minDistance = Infinity;

      for (const element of headingElements) {
        const rect = element.getBoundingClientRect();
        if (rect.top >= -100 && rect.top <= window.innerHeight / 3) {
          if (rect.top < minDistance) {
            minDistance = rect.top;
            currentActiveId = element.id;
          }
        }
      }

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
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeId]);

  const handleShareTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Learn About Command Git");
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

        {/* Left Column: TOC & Share */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-32 flex flex-col gap-10">
            <nav className="flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4 px-3">
                Daftar Isi
              </span>
              {headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  className={`text-sm py-1.5 px-3 w-fit transition-all duration-200 ${activeId === heading.id
                    ? "text-black dark:text-white font-semibold underline decoration-dashed underline-offset-4 decoration-1"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:underline decoration-dashed underline-offset-4 decoration-1"
                    } ${heading.depth === 3 ? "ml-4" : ""}`}
                >
                  {heading.label}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-4 px-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Bagikan
              </span>
              <div className="flex gap-3">
                <button
                  onClick={handleShareTwitter}
                  className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
                  aria-label="Share on Twitter"
                >
                  <Twitter size={18} />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="relative p-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all"
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

            <header className="mb-14">
              <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400 mb-6 font-medium">
                <time dateTime="2026-04-21">April 21, 2026</time>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span>10 min read</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6 leading-[1.15]">
                Learn About Command Git
              </h1>
              <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Tugas kuliah untuk belajar tentang command git
              </p>
            </header>

            <div className="space-y-6 text-[17px] text-zinc-700 dark:text-zinc-300 leading-relaxed">

              <h2 id="persiapan-awal" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-4 scroll-mt-32">
                1. Persiapan Awal
              </h2>
              <p>
                Anda baru saja menginstal Git di komputer baru. Sebelum mulai mengerjakan proyek apa pun, Anda harus memberi tahu Git siapa nama dan alamat email Anda agar setiap kontribusi kode tercatat atas nama Anda.
              </p>
              <TerminalBlock command="git config --global user.name 'Nama Anda'\ngit config --global user.email 'email@example.com'" />
              <p className="leading-relaxed text-[15px]"><span className="font-semibold">Penjelasan:</span> <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">config --global</code> mengatur identitas Anda untuk semua proyek Git di komputer tersebut. Identitas ini akan menempel secara permanen pada setiap commit yang Anda buat.</p>

              <h2 id="memulai-proyek" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-4 scroll-mt-32">
                2. Memulai Proyek Baru dari Nol
              </h2>
              <p>
                Anda baru saja membuat folder proyek lokal baru dan ingin mulai melacak perubahan menggunakan Git, lalu menyimpan versi pertamanya.
              </p>
              <TerminalBlock command="git init\ngit add .\ngit commit -m 'pesan anda'" />
              <p className="leading-relaxed text-[15px]"><span className="font-semibold">Penjelasan:</span> <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">init</code> mengubah folder biasa menjadi repositori Git. <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">add .</code> memasukkan semua file ke <em>staging area</em>, dan <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">commit</code> menyimpan perubahan tersebut secara permanen di riwayat lokal.</p>

              <h2 id="menghubungkan-lokal" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-4 scroll-mt-32">
                3. Menghubungkan Lokal ke Server (Remote)
              </h2>
              <p>
                Proyek lokal Anda sudah siap, dan sekarang Anda ingin mengunggahnya ke GitHub/GitLab agar aman dan bisa diakses tim.
              </p>
              <TerminalBlock command="git remote add origin <url-repositori>\ngit branch -M main\ngit push -u origin main" />
              <p className="leading-relaxed text-[15px]"><span className="font-semibold">Penjelasan:</span> Menambahkan alamat <em>remote</em> bernama 'origin', memastikan nama <em>branch</em> utama adalah 'main', dan mengunggah kode sambil mengatur agar push selanjutnya cukup dengan perintah <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">git push</code>.</p>

              <h2 id="bergabung-tim" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-4 scroll-mt-32">
                4. Bergabung dengan Proyek yang Sudah Ada
              </h2>
              <p>
                Anda baru saja masuk ke tim baru dan perlu mengambil <em>source code</em> proyek yang sudah berjalan ke laptop Anda.
              </p>
              <TerminalBlock command="git clone <url-repositori>\ncd <nama-folder>\ngit status" />
              <p className="leading-relaxed text-[15px]"><span className="font-semibold">Penjelasan:</span> <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">clone</code> mengunduh seluruh repositori beserta riwayat commitnya. <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">status</code> digunakan untuk mengecek di <em>branch</em> mana Anda berada dan apakah ada perubahan.</p>
              <ImagePlaceholder caption="" src="/images/writing/clone.png" />

              <h2 id="branch-fitur" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-4 scroll-mt-32">
                5. Mengerjakan Fitur Baru secara Terisolasi
              </h2>
              <p>
                Manajer proyek meminta Anda membuat fitur "Login". Anda tidak ingin merusak kode utama selama proses pembuatan fitur ini.
              </p>
              <TerminalBlock command="git switch -c feature/login" />
              <p className="leading-relaxed">lalu di dalam branch feature/login, Anda membuat halaman login</p>
              <TerminalBlock command="git add login.html\ngit commit -m 'feat: membuat halaman login'" />
              <p className="leading-relaxed text-[15px]"><span className="font-semibold">Penjelasan:</span> <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">switch -c</code> (atau <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">checkout -b</code>) membuat <em>branch</em> baru sekaligus memindahkan Anda ke sana. Pekerjaan Anda kini aman dan terpisah dari <em>branch</em> utama. Anda bisa melihat gambar ini untuk lebih jelasnya.</p>
              <ImagePlaceholder caption="" src="/images/writing/git_branch.png" />

              <h2 id="git-stash" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-4 scroll-mt-32">
                6. Menyimpan Pekerjaan yang Belum Selesai Sementara
              </h2>
              <p>
                Anda sedang mengerjakan fitur, tiba-tiba ada <em>bug</em> darurat di <em>branch</em> utama yang harus segera diperbaiki. Pekerjaan Anda saat ini belum siap untuk di commit.
              </p>
              <TerminalBlock command="git stash\ngit switch main" />
              <p>lalu Anda memperbaiki bug di branch main</p>
              <ImagePlaceholder caption="" src="/images/writing/git_stash-1.png" />
              <p>setelah selesai memperbaiki bug, Anda switch kembali ke branch feature/login</p>
              <TerminalBlock command="switch feature/login\ngit stash pop" />
              <ImagePlaceholder caption="" src="/images/writing/git_stash-2.png" />
              <p className="leading-relaxed text-[15px]"><span className="font-semibold">Penjelasan:</span> <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">stash</code> menyimpan perubahan sementara yang belum di commit ke dalam <em>clipboard</em> Git, sehingga <em>working directory</em> menjadi bersih. <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">stash pop</code> mengembalikan pekerjaan tersebut.</p>

              <h2 id="mengambil-pembaruan" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-4 scroll-mt-32">
                7. Mengambil Pembaruan Terbaru dari Tim
              </h2>
              <p>
                Teman satu tim Anda baru saja menyelesaikan fitur keranjang belanja dan mengunggahnya. Anda perlu menyinkronkan kode lokal Anda dengan kode terbaru.
              </p>
              <TerminalBlock command="git fetch origin\ngit pull origin main" />
              <p className="leading-relaxed text-[15px]"><span className="font-semibold">Penjelasan:</span> <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">fetch</code> mengambil metadata perubahan dari server tanpa mengubah kode lokal. <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">pull</code> mengunduh perubahan tersebut dan langsung menggabungkannya ke <em>branch</em> Anda saat ini.</p>
              <ImagePlaceholder caption="" src="/images/writing/fetchandpull.png" />

              <h2 id="menggabungkan-fitur" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-4 scroll-mt-32">
                8. Menggabungkan Fitur ke Branch Utama
              </h2>
              <p>
                Fitur "Login" Anda sudah selesai dan diuji. Sekarang waktunya menggabungkan fitur tersebut ke <em>branch</em> utama.
              </p>
              <TerminalBlock command="git switch main\ngit pull origin main\ngit merge feature/login" />
              <p className="leading-relaxed text-[15px]"><span className="font-semibold">Penjelasan:</span> Anda berpindah ke <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">main</code>, memastikan <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">main</code> adalah versi paling baru, lalu menjalankan <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">merge</code> untuk menyatukan pekerjaan di <em>branch</em> fitur Anda ke dalam <em>branch</em> utama.</p>
              <ImagePlaceholder caption="" src="/images/writing/git_merge.png" />

              <h2 id="patching" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-4 scroll-mt-32">
                9. Memilih Sebagian Perubahan (Patching)
              </h2>
              <p>
                Anda mengubah 5 file, tapi hanya ingin meng commit 2 file pertama untuk commit ini karena berkaitan dengan fitur A, sedangkan 3 lainnya untuk fitur B.
              </p>
              <TerminalBlock command="git add file1.js file2.js\ngit commit -m 'feat: update fitur" />
              <p className="leading-relaxed text-[15px]"><span className="font-semibold">Penjelasan:</span> Daripada <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">add .</code>, kita menyebutkan nama file secara spesifik agar commit lebih terorganisir dan memiliki konteks yang jelas.</p>
              <ImagePlaceholder caption="" src="/images/writing/patching.png" />

              <h2 id="memperbaiki-typo" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-4 scroll-mt-32">
                10. Memperbaiki Typo di Pesan commit Terakhir
              </h2>
              <p>
                Anda baru saja menekan <em>enter</em> untuk commit, lalu menyadari ada salah ketik yang fatal di pesan commitnya, atau ada satu file yang terlupa dimasukkan.
              </p>
              <TerminalBlock command="git add file_yang_terlupa.js\ngit commit --amend -m 'feat: pesan commit yang sudah diperbaiki'" />
              <p className="leading-relaxed text-[15px]"><span className="font-semibold">Penjelasan:</span> <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">--amend</code> akan menimpa commit terakhir Anda dengan perubahan baru dan/atau pesan baru tanpa membuat commit tambahan di riwayat.</p>

              <h2 id="membatalkan-perubahan" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-4 scroll-mt-32">
                11. Membatalkan Perubahan File yang Belum Di commit
              </h2>
              <p>
                Anda bereksperimen dengan suatu file kode, dan eksperimen itu gagal total. Anda ingin mengembalikan file tersebut persis seperti kondisi pada commit terakhir.
              </p>
              <TerminalBlock command="git restore index.js" />
              <p>atau</p>
              <TerminalBlock command="git checkout -- index.js" />
              <p className="leading-relaxed text-[15px]"><span className="font-semibold">Penjelasan:</span> <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">restore</code> akan membuang semua perubahan yang belum masuk <em>staging</em> pada file tersebut dan mengembalikannya ke kondisi bersih semula.</p>

              <h2 id="membatalkan commit" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-4 scroll-mt-32">
                12. Membatalkan commit yang Sudah Terlanjur Dibagikan
              </h2>
              <p>
                Anda sudah melakukan <em>push</em> ke server, tapi ternyata kode tersebut membuat aplikasi <em>crash</em>. Anda harus membatalkannya tanpa merusak riwayat commit teman setim.
              </p>
              <TerminalBlock command="git log --oneline\ngit revert <id commit-yang-bermasalah>\ngit push origin main" />
              <p className="leading-relaxed text-[15px]"><span className="font-semibold">Penjelasan:</span> Berbeda dengan menghapus commit, <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">revert</code> membuat satu commit <em>baru</em> yang berisi kebalikan dari commit yang bermasalah. Ini adalah cara teraman untuk <em>rollback</em> kode yang sudah di-<em>push</em>.</p>

              <h2 id="hard-reset" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-4 scroll-mt-32">
                13. Mereset Kode secara Ekstrem (Hard Reset)
              </h2>
              <p>
                Anda sedang bekerja di <em>branch</em> eksperimental dan semua kodingan hari ini berantakan. Anda ingin membuang semuanya dan kembali ke commit tertentu di masa lalu secara permanen.
              </p>
              <TerminalBlock command="git reset --hard <id commit-tujuan>" />
              <p className="leading-relaxed text-[15px]"><span className="font-semibold">Awas:</span> <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">--hard</code> sangat destruktif. Ini akan menghapus semua file dan commit yang terjadi setelah ID commit yang dituju. Gunakan hanya jika Anda yakin seratus persen.</p>

              <h2 id="konflik-merge" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-4 scroll-mt-32">
                14. Menyelesaikan Konflik Penggabungan (Merge Conflict)
              </h2>
              <p>
                Saat Anda melakukan <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">git pull</code>, ternyata Anda dan teman setim Anda mengedit baris kode yang persis sama. Git bingung dan meminta Anda menyelesaikannya.
              </p>
              <TerminalBlock command="git pull" />
              <div className="my-8 rounded-xl overflow-hidden bg-[#1e1e1e] border border-zinc-800 shadow-xl font-mono text-[13px] sm:text-sm">
                <div className="flex items-center px-4 py-2 border-b border-zinc-800 bg-black/40 text-zinc-400 text-[11px] font-semibold tracking-wider uppercase">
                  index.html
                </div>
                <div className="p-4 overflow-x-auto whitespace-pre leading-relaxed">
                  <div className="text-zinc-300"><span className="text-rose-400">&lt;html&gt;</span></div>
                  <div className="text-zinc-300">  <span className="text-rose-400">&lt;body&gt;</span></div>
                  <div className="text-blue-400 bg-[#3a4a5a] px-2 py-1 mt-1 border-l-[3px] border-blue-400 font-bold">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD (Current Change)</div>
                  <div className="px-2 bg-[#2a3038] py-0.5 border-l-[3px] border-blue-400">    <span className="text-rose-400">&lt;h1&gt;</span><span className="text-zinc-100">test konflik</span><span className="text-rose-400">&lt;/h1&gt;</span></div>
                  <div className="text-zinc-400 bg-zinc-800/80 px-2 py-1 border-l-[3px] border-zinc-500 font-bold">=======</div>
                  <div className="px-2 bg-[#27403b] py-0.5 border-l-[3px] border-emerald-400">    <span className="text-rose-400">&lt;h1&gt;</span><span className="text-zinc-100">learn about command git</span><span className="text-rose-400">&lt;/h1&gt;</span></div>
                  <div className="text-emerald-400 bg-[#2d5045] px-2 py-1 border-l-[3px] border-emerald-400 font-bold mb-1">&gt;&gt;&gt;&gt;&gt;&gt;&gt; origin/main (Incoming Change)</div>
                  <div>    <span className="text-rose-400">&lt;p&gt;</span><span className="text-zinc-300">Lorem ipsum dolor sit amet consectetur adipisicing elit...</span><span className="text-rose-400">&lt;/p&gt;</span></div>
                  <div>    <span className="text-rose-400">&lt;a</span> <span className="text-blue-300">href</span><span className="text-zinc-400">=</span><span className="text-amber-300">"login.html"</span><span className="text-rose-400">&gt;</span><span className="text-zinc-100">Login</span><span className="text-rose-400">&lt;/a&gt;</span></div>
                  <div className="text-zinc-300">  <span className="text-rose-400">&lt;/body&gt;</span></div>
                  <div className="text-zinc-300"><span className="text-rose-400">&lt;/html&gt;</span></div>
                </div>
              </div>
              <p>Hapus semua tanda aneh tersebut (<code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">=======</code>, <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>) dan pilih kode mana yang ingin dipertahankan, atau gabungkan keduanya. Misalnya, Anda mengeditnya menjadi:</p>
              <div className="my-8 rounded-xl overflow-hidden bg-[#1e1e1e] border border-zinc-800 shadow-xl font-mono text-[13px] sm:text-sm">
                <div className="flex items-center px-4 py-2 border-b border-zinc-800 bg-black/40 text-zinc-400 text-[11px] font-semibold tracking-wider uppercase">
                  index.html
                </div>
                <div className="p-4 overflow-x-auto whitespace-pre leading-relaxed">
                  <div className="text-zinc-300"><span className="text-rose-400">&lt;html&gt;</span></div>
                  <div className="text-zinc-300">  <span className="text-rose-400">&lt;body&gt;</span></div>
                  <div className="px-2 bg-[#2a3038] py-0.5 border-l-[3px] border-blue-400">   <span className="text-rose-400">&lt;h1&gt;</span><span className="text-zinc-100">test konflik</span><span className="text-rose-400">&lt;/h1&gt;</span></div>
                  <div>    <span className="text-rose-400">&lt;p&gt;</span><span className="text-zinc-300">Lorem ipsum dolor sit amet consectetur adipisicing elit...</span><span className="text-rose-400">&lt;/p&gt;</span></div>
                  <div>    <span className="text-rose-400">&lt;a</span> <span className="text-blue-300">href</span><span className="text-zinc-400">=</span><span className="text-amber-300">"login.html"</span><span className="text-rose-400">&gt;</span><span className="text-zinc-100">Login</span><span className="text-rose-400">&lt;/a&gt;</span></div>
                  <div className="text-zinc-300">  <span className="text-rose-400">&lt;/body&gt;</span></div>
                  <div className="text-zinc-300"><span className="text-rose-400">&lt;/html&gt;</span></div>
                </div>
              </div>
              <p>Setelah itu, kita perlu menambahkan file yang sudah diperbaiki ke <em>staging area</em> dan melakukan <em>commit</em>:</p>
              <TerminalBlock command="git add index.html\ngit commit -m 'fix: menyelesaikan konflik" />
              <p className="leading-relaxed text-[15px]"><span className="font-semibold">Penjelasan:</span> Saat konflik terjadi, Git menghentikan proses <em>merge</em>. Kita harus mengedit file secara manual, menandainya sudah selesai dengan <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">add</code>, lalu melanjutkan dengan <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">commit</code>.</p>

              <h2 id="cherry-pick" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-4 scroll-mt-32">
                15. Mengambil Satu commit Spesifik (Cherry-Pick)
              </h2>
              <p>
                Teman Anda membuat perbaikan <em>bug</em> di <em>branch</em> lain. Anda butuh perbaikan itu sekarang di <em>branch</em> Anda tanpa harus menggabungkan seluruh fitur miliknya.
              </p>
              <TerminalBlock command="git log --oneline\ngit switch branch_anda\ngit cherry-pick <id commit-teman>" />
              <p className="leading-relaxed text-[15px]"><span className="font-semibold">Penjelasan:</span> <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">cherry-pick</code> mengambil persis satu commit dari tempat lain dan menempelkannya (menduplikasinya) ke <em>branch</em> Anda saat ini.</p>

              <h2 id="rebase" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-4 scroll-mt-32">
                16. Merapikan Riwayat commit sebelum Merge (Rebase)
              </h2>
              <p>
                Anda ingin memperbarui <em>branch</em> fitur Anda dengan perubahan terbaru dari <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">main</code>, tetapi Anda ingin riwayat commitnya tetap linier dan rapi tanpa commit <em>merge</em> yang berantakan.
              </p>
              <TerminalBlock command="git switch feature/keranjang\ngit fetch origin\ngit rebase origin/main" />
              <p className="leading-relaxed text-[15px]"><span className="font-semibold">Penjelasan:</span> <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">rebase</code> mengambil commit commit Anda, menyimpannya sementara, menarik versi terbaru dari <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">main</code>, lalu meletakkan kembali commit Anda satu per satu di ujung paling atas.</p>
              <ImagePlaceholder caption="" src="/images/writing/rebase.png" />

              <h2 id="squash" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-4 scroll-mt-32">
                17. Menggabungkan Banyak commit Kecil (Squash)
              </h2>
              <p>
                Saat mengerjakan fitur, Misal Anda membuat 3 commit kecil. Anda ingin menggabungkannya menjadi 1 commit solid sebelum diserahkan.
              </p>
              <ImagePlaceholder caption="" src="/images/writing/git_squash-1.png" />
              <p>Jalankan perintah rebase mundur sebanyak 3 commit dari titik saat ini <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">HEAD</code>:</p>
              <TerminalBlock command="git rebase -i HEAD~3" />
              <p>Setelah itu, Terminal Anda akan berubah menjadi teks editor, Ubah kata <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">pick</code> menjadi <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">squash</code> pada commit yang ingin dilebur ke commit di atasnya. Biarkan commit paling atas tetap <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">pick</code></p>
              <ImagePlaceholder caption="" src="/images/writing/git_squash-2.png" />
              <p>Setelah editor pertama ditutup, Git akan otomatis membuka editor kedua. Di sini Git menggabungkan semua pesan commit lama Anda dan meminta Anda menuliskan satu pesan commit baru untuk hasil gabungan ini.</p>
              <p>Hapus atau beri tanda <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">#</code> pada pesan commit yang lama, lalu sisakan atau tulis pesan baru yang rapi, misalnya:</p>
              <ImagePlaceholder caption="" src="/images/writing/git_squash-3.png" />
              <p>Terakhir, simpan dan tutup editor. Git akan menggabungkan commit tersebut. Sekarang Anda bisa mendorong perubahan ini ke remote:</p>
              <TerminalBlock command="git push -f origin feature/branch" />
              <p className="leading-relaxed text-[15px]"><span className="font-semibold">Penjelasan:</span> <em>Interactive rebase</em> (<code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">-i</code>) memungkinkan kita memanipulasi riwayat commit (menggabungkan, menghapus, atau mengubah urutan) sebelum dipublikasikan ke <em>branch</em> utama.</p>

              <h2 id="blame" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-4 scroll-mt-32">
                18. Mencari Tahu Siapa Penulis Baris Kode (Blame)
              </h2>
              <p>
                Anda menemukan fungsi yang aneh dan menyebabkan <em>bug</em>, Anda butuh bertanya kepada orang yang menulis baris tersebut mengapa kodenya ditulis seperti itu.
              </p>
              <TerminalBlock command="git blame index.html" />
              <p className="leading-relaxed text-[15px]"><span className="font-semibold">Penjelasan:</span> <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">blame</code> akan menampilkan setiap baris dalam file beserta nama pembuat, tanggal, dan ID commit kapan baris tersebut terakhir kali dimodifikasi.</p>

              <h2 id="tagging" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-4 scroll-mt-32">
                19. Menandai Versi Rilis Baru (Tagging)
              </h2>
              <p>
                Aplikasi Anda sudah siap diluncurkan untuk versi 2.0.0. Anda ingin memberikan penanda permanen di riwayat Git.
              </p>
              <TerminalBlock command="git tag -a v2.0.0 -m 'Release version 2.0.0'\ngit push origin v2.0.0" />
              <p className="leading-relaxed text-[15px]"><span className="font-semibold">Penjelasan:</span> <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">tag</code> memberikan nama pada titik commit spesifik. Berguna untuk rilis produksi dan sering digunakan oleh sistem CI/CD untuk memicu proses <em>deployment</em>.</p>

              <h2 id="membersihkan-branch" className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-4 scroll-mt-32">
                20. Membersihkan Branch yang Sudah Tidak Terpakai
              </h2>
              <p>
                Setelah berbulan-bulan, tumpukan <em>branch</em> fitur yang sudah di-<em>merge</em> memenuhi daftar Anda. Waktunya melakukan bersih-bersih agar repositori kembali rapi.
              </p>
              <TerminalBlock command="git branch -d feature/login\ngit remote prune origin" />
              <p className="leading-relaxed text-[15px]"><span className="font-semibold">Penjelasan:</span> <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">-d</code> menghapus <em>branch</em> di komputer lokal Anda (hanya aman jika sudah di-<em>merge</em>). <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm mx-1">prune</code> membersihkan referensi <em>branch remote</em> yang ternyata sudah dihapus di server (GitHub/GitLab).</p>
            </div>
            <div className="mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800/60">
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-white mb-5">Link Terkait:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                  <a href="https://docs.google.com/presentation/d/1C0ZVtsaxJbyyiii91_Ky2idr26fIjrv8_3_aZ5FlWdo/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="relative group transition-colors hover:text-black dark:hover:text-white inline-block">
                    docs.google.com/presentation
                    <span className="absolute left-0 -bottom-1 w-full h-[1px] bg-black dark:bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                  <a href="https://github.com/FaizNation/learn-abt-command-git" target="_blank" rel="noopener noreferrer" className="relative group transition-colors hover:text-black dark:hover:text-white inline-block">
                    github.com/FaizNation/learn-abt-command-git
                    <span className="absolute left-0 -bottom-1 w-full h-[1px] bg-black dark:bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="mt-10 pt-4">
              <Link href="/writing" className="text-sm font-mono text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-2 w-fit">
                &gt; cd ..
              </Link>
            </div>
          </article>
        </main>

        <div className="hidden lg:block w-64 shrink-0" aria-hidden="true" />
      </div>
    </div>
  );
}
