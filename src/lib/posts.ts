import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");
const markdownFilePattern = /\.md$/i;

type FrontMatter = {
  title?: string;
  date?: string;
  excerpt?: string;
};

export interface PostData {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  contentHtml?: string;
}

function getPostFiles() {
  return fs.readdirSync(postsDirectory).filter((fileName) => markdownFilePattern.test(fileName));
}

export function getSortedPostsData(): PostData[] {
  const fileNames = getPostFiles();
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);
    const data = matterResult.data as FrontMatter;

    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "1970-01-01",
      excerpt: data.excerpt ?? "",
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostSlugs() {
  const fileNames = getPostFiles();
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);
  const data = matterResult.data as FrontMatter;

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    title: data.title ?? slug,
    date: data.date ?? "1970-01-01",
    excerpt: data.excerpt ?? "",
  };
}
