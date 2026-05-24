"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Head from "next/head";
import { Playfair_Display } from "next/font/google";
import { ArrowLeft, Clock3 } from "lucide-react";

import { BlogPost } from "@/types";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "700"] });

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const loadBlog = async () => {
      if (!slug) {
        setPost(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { getBlogPosts } = await import("@/lib/firebaseServices");
        const records = await getBlogPosts();
        const match = records.find((record) => (record.slug || record.id) === slug);
        if (!match) {
          setPost(null);
        } else {
          setPost({
            id: match.slug || match.id,
            title: match.title,
            publishedAt: match.publishedAt,
            tags: match.tags,
            excerpt: match.excerpt || match.shortDescription,
            imageUrl: match.imageUrl || "/bannerimg.jpg",
            imageAlt: match.imageAlt || match.title,
            readTime: match.readTime,
            author: match.author,
            richContent: match.richContent,
          });
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    loadBlog();
  }, [slug]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!post) return <div className="p-10 text-center">Blog not found.</div>;

  return (
    <>
      <Head>
        <title>{post.title} | Jothi Ramesh</title>
      </Head>
      <main className="min-h-screen bg-[linear-gradient(180deg,#F3ECFF_0%,#EEE4FF_45%,#F3ECFF_100%)] pb-24 pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-white/85 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-[#4B2E83] hover:border-[#D4AF37]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blogs
          </Link>

          <article className="mt-6 overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-white/65 shadow-xl">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={post.imageUrl}
                alt={post.imageAlt}
                fill
                priority
                className="object-cover"
              />
            </div>

            <div className="px-5 py-8 sm:px-8 md:px-12">
              <div className="flex flex-wrap items-center gap-3 text-sm font-bold uppercase text-[#D4AF37]">
                <span>{post.publishedAt}</span>
                {post.readTime && <span className="flex items-center gap-1"><Clock3 className="h-3 w-3" /> {post.readTime}</span>}
                {post.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="rounded-full bg-[#4B2E83] px-2 py-0.5 text-[10px] text-white">{tag}</span>
                ))}
              </div>
              <h1 className={`${playfair.className} mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#4B2E83]`}>
                {post.title}
              </h1>
              {post.author && <p className="mt-2 text-sm font-semibold uppercase text-gray-600">By {post.author}</p>}

              {/* ✅ Renders HTML with inline colors & font sizes */}
              <div className="mt-8 blog-content" dangerouslySetInnerHTML={{ __html: post.richContent }} />
            </div>
          </article>
        </div>
      </main>
    </>
  );
}