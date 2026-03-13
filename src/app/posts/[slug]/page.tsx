import type { Metadata } from "next";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { CalendarDays, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostData, getSortedPostsData } from "@/lib/posts";

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

function formatDisplayDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return format(parsed, "yyyy年M月d日", { locale: ja });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const postData = await getPostData(slug);
    return {
      title: postData.title,
      description: postData.excerpt,
    };
  } catch {
    return {
      title: "記事が見つかりません",
    };
  }
}

export default async function Post({ params }: Props) {
  const { slug } = await params;
  let postData;
  try {
    postData = await getPostData(slug);
  } catch {
    notFound();
  }

  return (
    <div className="blog-home min-h-screen">
      <main className="blog-container px-4 py-16">
        <Link
          href="/"
          className="back-link"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          一覧に戻る
        </Link>
        <article className="post-paper">
          <header className="post-header">
            <time className="post-date" dateTime={postData.date}>
              <CalendarDays size={16} aria-hidden="true" />
              {formatDisplayDate(postData.date)}
            </time>
            <h1 className="post-heading">
              {postData.title}
            </h1>
          </header>
          <div
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml || "" }}
          />
        </article>
      </main>
    </div>
  );
}
