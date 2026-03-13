import { getPostData, getSortedPostsData } from "@/lib/posts";
import { Calendar, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Post({ params }: Props) {
  const { slug } = await params;
  const postData = await getPostData(slug);

  if (!postData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-3xl mx-auto px-4 py-16 text-black">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-8 px-3 py-1 bg-blue-50 rounded-full transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          一覧に戻る
        </Link>
        <article>
          <header className="mb-12">
            <time className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="mr-1.5 h-4 w-4" />
              {postData.date}
            </time>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
              {postData.title}
            </h1>
          </header>
          <div
            className="prose prose-blue max-w-none prose-img:rounded-xl prose-headings:font-bold"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml || "" }}
          />
        </article>
      </main>
    </div>
  );
}
