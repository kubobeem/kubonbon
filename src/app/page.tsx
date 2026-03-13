import Link from "next/link";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { CalendarDays, ChevronRight } from "lucide-react";
import { getSortedPostsData } from "@/lib/posts";

function formatDisplayDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return format(parsed, "yyyy年M月d日", { locale: ja });
}

export default function Home() {
  const posts = getSortedPostsData();

  return (
    <div className="blog-home min-h-screen">
      <main className="blog-container px-4 py-16">
        <header className="hero-block">
          <p className="hero-kicker">Markdown Blog</p>
          <h1 className="hero-title">記事はMarkdownだけで作れる</h1>
          <p className="hero-subtitle">
            postsフォルダにmdファイルを置くだけ。見た目はCSSでまとめて適用されます。
          </p>
        </header>

        <section className="post-list" aria-label="記事一覧">
          {posts.map((post) => (
            <article key={post.slug} className="post-card">
              <time className="post-date" dateTime={post.date}>
                <CalendarDays size={16} aria-hidden="true" />
                {formatDisplayDate(post.date)}
              </time>
              <h2 className="post-title">
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="post-excerpt">{post.excerpt}</p>
              <Link className="post-more" href={`/posts/${post.slug}`}>
                続きを読む
                <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
