import type { Metadata } from "next";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  SquareChartGantt,
  UserRound,
} from "lucide-react";
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
  const postData = await getPostData(slug).catch(() => null);
  if (!postData) {
    notFound();
  }

  const relatedPosts = getSortedPostsData()
    .filter(
      (post) => post.slug !== postData.slug && post.category === postData.category,
    )
    .slice(0, 2);

  return (
    <div className="story-shell">
      <main className="story-main">
        <Link href="/" className="story-back">
          <ArrowLeft size={16} aria-hidden="true" />
          ホームへ戻る
        </Link>

        <article className="story-hero">
          <div
            className="story-hero-gradient"
            style={{ backgroundImage: postData.heroGradient }}
            aria-hidden="true"
          />
          <div className="story-hero-content">
            <p className="story-category">{postData.category}</p>
            <h1 className="story-title">{postData.title}</h1>
            <p className="story-summary">{postData.excerpt}</p>
            <div className="story-meta">
              <span>
                <CalendarDays size={14} aria-hidden="true" />
                {formatDisplayDate(postData.date)}
              </span>
              <span>
                <Clock3 size={14} aria-hidden="true" />
                {postData.readTimeMinutes}分
              </span>
              <span>
                <UserRound size={14} aria-hidden="true" />
                {postData.author}
              </span>
            </div>
            <div className="story-metric-grid">
              {postData.metrics.map((metric) => (
                <article key={metric.label} className="story-metric-card">
                  <p className="story-metric-label">{metric.label}</p>
                  <p className="story-metric-value">{metric.value}</p>
                  <p className="story-metric-note">{metric.note}</p>
                </article>
              ))}
            </div>
          </div>
        </article>

        <section className="story-layout">
          <div className="story-content">
            {postData.sections.map((section) => (
              <section key={section.heading} className="story-section">
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets ? (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
                {section.insight ? (
                  <p className="story-insight">
                    <SquareChartGantt size={16} aria-hidden="true" />
                    {section.insight}
                  </p>
                ) : null}
              </section>
            ))}
          </div>

          <aside className="story-side">
            <section className="story-side-card">
              <h3>実装メモ</h3>
              <ul>
                <li>このブログはMarkdownを使わない型付きデータ構成。</li>
                <li>投稿はコードレビュー可能な形で変更履歴を追跡。</li>
                <li>静的出力でGitHub Pagesへそのまま配信。</li>
              </ul>
            </section>
            <section className="story-side-card">
              <h3>次のアクション</h3>
              <Link href="/" className="side-link">
                他の記事を探す
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </section>
          </aside>
        </section>

        {relatedPosts.length > 0 ? (
          <section className="related-wrap" aria-label="関連投稿">
            <h2>同カテゴリの注目記事</h2>
            <div className="related-grid">
              {relatedPosts.map((post) => (
                <article key={post.slug} className="related-card">
                  <p>{post.category}</p>
                  <h3>
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <span>{formatDisplayDate(post.date)}</span>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
