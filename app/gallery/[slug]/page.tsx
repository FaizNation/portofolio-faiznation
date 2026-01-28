import Link from "next/link";
import { notFound } from "next/navigation";
import GalleryGrid from "../../components/GalleryGrid";
import galleryData from "../../data/gallery.json";

interface GalleryItem {
  src: string;
  alt: string;
  caption?: string;
  span?: string;
}

export default async function GalleryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const album = galleryData.find((item) => item.slug === slug);

  if (!album) {
    return notFound();
  }

  return (
    <div className="w-full max-w-3xl flex flex-col px-8 md:px-16 bg-white dark:bg-black">
      <section className="flex flex-col gap-8 py-16">
        <div className="flex flex-col gap-2">
          <Link href="/gallery" className="text-sm font-mono text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-2 w-fit">
            &gt; cd ..
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
            {album.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-sans">
            /<span className="text-black dark:text-white">{slug}</span>
          </p>
        </div>

        {/* Masonry-like Grid */}
        {album.items.length > 0 ? (
          <GalleryGrid items={album.items} />
        ) : (
          <div className="flex flex-col gap-4 items-center justify-center min-h-[30vh] text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
            <div className="text-4xl">📷</div>
            <div className="flex flex-col gap-1">
              <p className="font-medium text-black dark:text-white text-lg">
                No photos yet.
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                This album is empty.
              </p>
            </div>
          </div>
        )}

      </section>
    </div>
  );
}
