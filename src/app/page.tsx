import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";
import { Calendar, ChevronRight } from "lucide-react";

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4 py-16 text-black">
        <header className="mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
            My Blogtest
          </h1>
          <p className="text-xl text-gray-500">
            最新の投稿をご覧いただけます
          </p>
        </header>

        <section className="space-y-12">
          {allPostsData.map(({ slug, date, title, excerpt }) => (
            <article key={slug} className="group relative border-l-2 border-gray-100 pl-8 transition-colors hover:border-blue-500">
              <div className="flex flex-col space-y-2">
                <time className="flex items-center text-sm text-gray-400">
                  <Calendar className="mr-1.5 h-4 w-4" />
                  {date}
                </time>
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600">
                  <Link href={`/posts/${slug}`}>
                    <span className="absolute -inset-y-2.5 -inset-x-4 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                    <span className="relative z-10">{title}</span>
                  </Link>
                </h2>
                <p className="relative z-10 text-gray-600 line-clamp-2">
                  {excerpt}
                </p>
                <div className="relative z-10 flex items-center text-sm font-medium text-blue-600 mt-4">
                  続きを読む
                  <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
