"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  ArrowUpRight,
  Clock3,
  Radar,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { getAllCategories, getSortedPostsData } from "@/lib/posts";

const postInventory = getSortedPostsData();
const categoryInventory = ["すべて", ...getAllCategories()];

function formatDisplayDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return format(parsed, "yyyy年M月d日", { locale: ja });
}

function getAverageReadTime(): number {
  if (postInventory.length === 0) {
    return 0;
  }

  const totalMinutes = postInventory.reduce(
    (sum, post) => sum + post.readTimeMinutes,
    0,
  );
  return Math.round(totalMinutes / postInventory.length);
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("すべて");

  const visiblePosts = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return postInventory.filter((post) => {
      const categoryMatch =
        activeCategory === "すべて" || post.category === activeCategory;
      const textMatch =
        normalized.length === 0 ||
        post.title.toLowerCase().includes(normalized) ||
        post.excerpt.toLowerCase().includes(normalized) ||
        post.sections.some((section) =>
          section.paragraphs.some((paragraph) =>
            paragraph.toLowerCase().includes(normalized),
          ),
        );

      return categoryMatch && textMatch;
    });
  }, [activeCategory, query]);

  const featuredPost = visiblePosts[0] ?? postInventory[0];
  const feedPosts = visiblePosts.filter((post) => post.slug !== featuredPost?.slug);

  return (
    <div className="atlas-shell">
      <main className="atlas-main">
        <section className="atlas-hero">
          <span className="hero-badge">
            <Sparkles size={14} aria-hidden="true" />
            Strategy Magazine
          </span>
          <h1 className="hero-heading">企業ブログを超える、実装直結ジャーナル</h1>
          <p className="hero-copy">
            Markdown不要。投稿は型付きデータで管理し、分析指標とケーススタディを同時に届ける。
          </p>

          <div className="kpi-grid" role="list" aria-label="サイトKPI">
            <article className="kpi-card" role="listitem">
              <p className="kpi-label">Published Insights</p>
              <p className="kpi-value">{postInventory.length}</p>
              <p className="kpi-note">高密度な実務記事</p>
            </article>
            <article className="kpi-card" role="listitem">
              <p className="kpi-label">Avg. Read Time</p>
              <p className="kpi-value">{getAverageReadTime()} min</p>
              <p className="kpi-note">要点重視の編集設計</p>
            </article>
            <article className="kpi-card" role="listitem">
              <p className="kpi-label">Trend Velocity</p>
              <p className="kpi-value">+34%</p>
              <p className="kpi-note">市場トピック反映速度</p>
            </article>
          </div>
        </section>

        <section className="command-row" aria-label="絞り込み">
          <label className="query-box" htmlFor="search-input">
            <Search size={17} aria-hidden="true" />
            <input
              id="search-input"
              type="search"
              placeholder="キーワードで検索"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <div className="category-row">
            {categoryInventory.map((category) => (
              <button
                key={category}
                type="button"
                className={
                  category === activeCategory ? "chip chip-active" : "chip"
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {featuredPost ? (
          <article className="featured-card">
            <div
              className="featured-gradient"
              style={{ backgroundImage: featuredPost.heroGradient }}
              aria-hidden="true"
            />
            <div className="featured-content">
              <p className="featured-tag">
                <Radar size={14} aria-hidden="true" />
                Featured / {featuredPost.category}
              </p>
              <h2 className="featured-title">{featuredPost.title}</h2>
              <p className="featured-excerpt">{featuredPost.excerpt}</p>
              <div className="featured-meta">
                <span>
                  <Clock3 size={14} aria-hidden="true" />
                  {featuredPost.readTimeMinutes}分
                </span>
                <span>
                  <TrendingUp size={14} aria-hidden="true" />
                  {formatDisplayDate(featuredPost.date)}
                </span>
              </div>
              <Link className="primary-link" href={`/posts/${featuredPost.slug}`}>
                特集を読む
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ) : null}

        <section className="feed-grid" aria-label="投稿フィード">
          {feedPosts.map((post, index) => (
            <article
              key={post.slug}
              className="feed-card"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <p className="feed-category">{post.category}</p>
              <h3 className="feed-title">
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h3>
              <p className="feed-excerpt">{post.excerpt}</p>
              <div className="feed-footer">
                <span>{formatDisplayDate(post.date)}</span>
                <span>{post.readTimeMinutes}分</span>
              </div>
            </article>
          ))}
        </section>

        {visiblePosts.length === 0 ? (
          <section className="empty-state" aria-live="polite">
            条件に合う記事がありません。キーワードやカテゴリを変えて試してください。
          </section>
        ) : null}
      </main>
    </div>
  );
}
