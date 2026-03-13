const state = {
  posts: [],
  featuredSlug: null,
  filteredHomePosts: []
};

const pageType = document.body?.dataset?.page || "home";
let revealObserver = null;

document.addEventListener("DOMContentLoaded", () => {
  initRevealObserver();
  updateYear();
  boot().catch((error) => {
    console.error("Initialization failed", error);
    showErrorNotice("Could not load post data. Check data/posts.json and published paths.");
  });
});

async function boot() {
  if (pageType === "notfound") {
    observeReveals();
    return;
  }

  const payload = await loadPostsPayload();
  const normalized = (payload.posts || []).map(normalizePost).filter(Boolean);

  state.posts = normalized
    .filter((post) => post.status !== "draft")
    .sort((a, b) => parseDateSafe(b.date) - parseDateSafe(a.date));

  if (pageType === "home") {
    renderHomePage();
  }

  if (pageType === "post") {
    await renderPostPage();
  }

  if (pageType === "tags") {
    renderTagsPage();
  }

  observeReveals();
}

async function loadPostsPayload() {
  const resource = new URL("data/posts.json", window.location.href);
  const response = await fetch(resource, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to load post data: ${response.status}`);
  }

  return response.json();
}

function normalizePost(raw) {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const slug = String(raw.slug || "").trim();
  const title = String(raw.title || "Untitled").trim();

  if (!slug || !title) {
    return null;
  }

  return {
    slug,
    title,
    date: String(raw.date || "1970-01-01"),
    excerpt: String(raw.excerpt || "No excerpt yet."),
    tags: Array.isArray(raw.tags) ? raw.tags.map((tag) => String(tag).trim()).filter(Boolean) : [],
    readingTime: String(raw.readingTime || "3 min read"),
    status: String(raw.status || "published"),
    content: String(raw.content || ""),
    featured: Boolean(raw.featured)
  };
}

function renderHomePage() {
  const featuredSlot = document.getElementById("featured-post");
  const postGrid = document.getElementById("post-grid");
  const tagFilter = document.getElementById("tag-filter");
  const emptyState = document.getElementById("home-empty");
  const randomButton = document.getElementById("random-post-btn");

  if (!featuredSlot || !postGrid || !tagFilter || !emptyState || !randomButton) {
    return;
  }

  if (!state.posts.length) {
    emptyState.classList.remove("hidden");
    featuredSlot.innerHTML = "";
    postGrid.innerHTML = "";
    tagFilter.innerHTML = "";
    randomButton.disabled = true;
    randomButton.classList.add("btn-ghost");
    return;
  }

  const featuredPost = state.posts.find((post) => post.featured) || state.posts[0];
  state.featuredSlug = featuredPost.slug;
  featuredSlot.replaceChildren(createPostCard(featuredPost, { hero: true }));

  const remaining = state.posts.filter((post) => post.slug !== featuredPost.slug);
  state.filteredHomePosts = remaining;
  renderPostCollection(postGrid, remaining);

  const tagCounts = collectTagCounts(state.posts);
  renderHomeFilterButtons(tagFilter, tagCounts, postGrid);

  randomButton.addEventListener("click", () => {
    const pool = state.filteredHomePosts.length ? state.filteredHomePosts : state.posts;
    const chosen = pool[Math.floor(Math.random() * pool.length)];

    if (chosen) {
      window.location.href = createPostUrl(chosen.slug);
    }
  });
}

function renderHomeFilterButtons(container, tagCounts, postGrid) {
  const allButton = createFilterButton("all", `All (${state.posts.length})`, true, () => {
    const filtered = state.posts.filter((post) => post.slug !== state.featuredSlug);
    state.filteredHomePosts = filtered;
    renderPostCollection(postGrid, filtered);
    setActiveFilterButton(container, "all");
  });

  container.replaceChildren(allButton);

  [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .forEach(([tag, count]) => {
      const button = createFilterButton(tag, `${tag} (${count})`, false, () => {
        const filtered = state.posts
          .filter((post) => post.slug !== state.featuredSlug)
          .filter((post) => post.tags.includes(tag));

        state.filteredHomePosts = filtered;
        renderPostCollection(postGrid, filtered);
        setActiveFilterButton(container, tag);
      });

      container.append(button);
    });
}

function createFilterButton(id, label, active, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `tag-filter-btn${active ? " is-active" : ""}`;
  button.dataset.tag = id;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function setActiveFilterButton(container, activeTag) {
  container.querySelectorAll(".tag-filter-btn").forEach((button) => {
    if (button.dataset.tag === activeTag) {
      button.classList.add("is-active");
      return;
    }

    button.classList.remove("is-active");
  });
}

async function renderPostPage() {
  const notFound = document.getElementById("post-not-found");
  const article = document.getElementById("post-article");

  if (!notFound || !article) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    showPostNotFound();
    return;
  }

  const target = state.posts.find((post) => post.slug === slug);

  if (!target) {
    showPostNotFound();
    return;
  }

  await renderPostDetail(target);
  renderRelatedPosts(target);

  function showPostNotFound() {
    article.classList.add("hidden");
    notFound.classList.remove("hidden");
    document.title = "Midnight Frame | Post not found";
  }
}

async function renderPostDetail(post) {
  const titleNode = document.getElementById("post-title");
  const excerptNode = document.getElementById("post-excerpt");
  const metaNode = document.getElementById("post-meta");
  const tagsNode = document.getElementById("post-tags");
  const bodyNode = document.getElementById("post-body");

  if (!titleNode || !excerptNode || !metaNode || !tagsNode || !bodyNode) {
    return;
  }

  titleNode.textContent = post.title;
  excerptNode.textContent = post.excerpt;
  metaNode.textContent = `${formatDate(post.date)} | ${post.readingTime}`;

  tagsNode.innerHTML = "";
  post.tags.forEach((tag) => {
    tagsNode.append(createTagLink(tag, "tag-chip"));
  });

  document.title = `Midnight Frame | ${post.title}`;

  if (!post.content) {
    bodyNode.innerHTML = `<p>${escapeHtml(post.excerpt)}</p>`;
    return;
  }

  try {
    const resource = new URL(post.content, window.location.href);
    const response = await fetch(resource, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Failed to load post body: ${response.status}`);
    }

    bodyNode.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
    bodyNode.innerHTML = [
      "<p>Post content could not be loaded.</p>",
      "<p>Check that the file exists and the path in data/posts.json is correct.</p>"
    ].join("");
  }
}

function renderRelatedPosts(currentPost) {
  const relatedNode = document.getElementById("related-posts");

  if (!relatedNode) {
    return;
  }

  const related = state.posts
    .filter((post) => post.slug !== currentPost.slug)
    .filter((post) => post.tags.some((tag) => currentPost.tags.includes(tag)))
    .slice(0, 4);

  relatedNode.innerHTML = "";

  if (!related.length) {
    const empty = document.createElement("li");
    empty.textContent = "No related posts yet.";
    relatedNode.append(empty);
    return;
  }

  related.forEach((post) => {
    const item = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.href = createPostUrl(post.slug);
    anchor.textContent = post.title;
    item.append(anchor);
    relatedNode.append(item);
  });
}

function renderTagsPage() {
  const pillsNode = document.getElementById("tag-pills");
  const headingNode = document.getElementById("tag-heading");
  const postGrid = document.getElementById("tag-post-grid");
  const emptyNode = document.getElementById("tag-empty");

  if (!pillsNode || !headingNode || !postGrid || !emptyNode) {
    return;
  }

  const counts = collectTagCounts(state.posts);
  const selected = new URLSearchParams(window.location.search).get("tag");
  const activeTag = selected && counts.has(selected) ? selected : "all";

  const allPill = createTagPill("All", null, activeTag === "all", state.posts.length);
  pillsNode.append(allPill);

  [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .forEach(([tag, count]) => {
      pillsNode.append(createTagPill(tag, tag, activeTag === tag, count));
    });

  const filtered = activeTag === "all"
    ? state.posts
    : state.posts.filter((post) => post.tags.includes(activeTag));

  headingNode.textContent = activeTag === "all" ? "All tags" : `Showing posts tagged: ${activeTag}`;

  if (!filtered.length) {
    emptyNode.classList.remove("hidden");
  } else {
    emptyNode.classList.add("hidden");
  }

  renderPostCollection(postGrid, filtered);
}

function createTagPill(label, tag, active, count) {
  const anchor = document.createElement("a");
  anchor.href = tag ? createTagUrl(tag) : "tags.html";
  anchor.className = `tag-pill${active ? " is-active" : ""}`;
  anchor.textContent = `${label} (${count})`;
  return anchor;
}

function collectTagCounts(posts) {
  const counts = new Map();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    });
  });

  return counts;
}

function renderPostCollection(container, posts) {
  container.innerHTML = "";

  if (!posts.length) {
    observeReveals();
    return;
  }

  posts.forEach((post, index) => {
    const card = createPostCard(post, { hero: false });
    card.style.transitionDelay = `${Math.min(index * 55, 330)}ms`;
    container.append(card);
  });

  observeReveals();
}

function createPostCard(post, options = {}) {
  const article = document.createElement("article");
  const isHero = Boolean(options.hero);

  article.className = `post-card reveal${isHero ? " post-card-hero" : ""}`;

  const eyebrow = document.createElement("p");
  eyebrow.className = "post-eyebrow";
  eyebrow.textContent = `${formatDate(post.date)} | ${post.readingTime}`;

  const title = document.createElement("h3");
  title.className = "post-title";
  const titleLink = document.createElement("a");
  titleLink.href = createPostUrl(post.slug);
  titleLink.textContent = post.title;
  title.append(titleLink);

  const excerpt = document.createElement("p");
  excerpt.className = "post-excerpt";
  excerpt.textContent = post.excerpt;

  const tagRow = document.createElement("div");
  tagRow.className = "tag-row";
  post.tags.forEach((tag) => tagRow.append(createTagLink(tag, "tag-chip")));

  article.append(eyebrow, title, excerpt, tagRow);
  return article;
}

function createTagLink(tag, className) {
  const anchor = document.createElement("a");
  anchor.href = createTagUrl(tag);
  anchor.className = className;
  anchor.textContent = tag;
  return anchor;
}

function createPostUrl(slug) {
  return `post.html?slug=${encodeURIComponent(slug)}`;
}

function createTagUrl(tag) {
  return `tags.html?tag=${encodeURIComponent(tag)}`;
}

function parseDateSafe(value) {
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

function updateYear() {
  document.querySelectorAll("#year").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function showErrorNotice(message) {
  const note = document.createElement("p");
  note.className = "empty-state";
  note.textContent = message;

  const target = document.querySelector("main");

  if (target) {
    target.prepend(note);
  }
}

function initRevealObserver() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.08
    }
  );
}

function observeReveals() {
  if (!revealObserver) {
    return;
  }

  document.querySelectorAll(".reveal:not(.is-visible)").forEach((node) => {
    revealObserver.observe(node);
  });
}
