import Image from "next/image";

import { BlogPost } from "@/lib/types";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="card-lift overflow-hidden rounded-[2rem] border border-black/5 bg-white">
      <div className="relative h-56">
        <Image src={post.image} alt={post.title} fill className="object-cover" />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full bg-[var(--forest)]/8 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--forest)]">{post.category}</span>
          <span className="text-sm text-neutral-500">{post.date}</span>
        </div>
        <h3 className="mt-4 text-2xl font-black">{post.title}</h3>
        <p className="mt-3 text-sm leading-7 text-neutral-600">{post.excerpt}</p>
        <button className="mt-6 rounded-full border border-[var(--orange)] px-5 py-3 text-sm font-bold text-[var(--orange)] transition hover:bg-[var(--orange)] hover:text-white">
          Read More
        </button>
      </div>
    </article>
  );
}
