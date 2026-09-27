const BLOG_API = "https://cashif.cc/blog/wp-json/wp/v2/posts";
const MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

export const revalidate = 1800;

function decodeHtml(value) {
  return String(value || "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function plainText(html) {
  return decodeHtml(String(html || "").replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function excerptText(html) {
  const text = plainText(html);
  if (text.length <= 140) return text;

  const cut = text.slice(0, 140);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

function formatBlogDate(iso) {
  const match = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "";

  const month = MONTHS[Number(match[2]) - 1];
  if (!month) return "";

  return `${Number(match[3])} ${month}، ${match[1]}`;
}

function featuredImage(post) {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  const sizes = media?.media_details?.sizes || {};
  return sizes.medium_large?.source_url || sizes.large?.source_url || media?.source_url || null;
}

function categoryName(post) {
  const groups = post?._embedded?.["wp:term"] || [];

  for (const group of groups) {
    for (const term of group || []) {
      if (term?.taxonomy !== "category") continue;
      if (!term.name || term.slug === "uncategorized" || term.name === "غير مصنف") continue;
      return term.name;
    }
  }

  return null;
}

function toPost(post) {
  return {
    id: post.id,
    title: plainText(post?.title?.rendered),
    excerpt: excerptText(post?.excerpt?.rendered),
    date: formatBlogDate(post?.date),
    link: post?.link || "https://cashif.cc/blog/",
    image: featuredImage(post),
    category: categoryName(post),
  };
}

export async function GET() {
  try {
    const response = await fetch(`${BLOG_API}?per_page=3&_embed`, {
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      return Response.json({ posts: [] }, { status: response.status });
    }

    const data = await response.json();
    const posts = Array.isArray(data) ? data.slice(0, 3).map(toPost) : [];

    return Response.json({ posts });
  } catch {
    return Response.json({ posts: [] }, { status: 500 });
  }
}
