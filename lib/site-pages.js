import fs from "fs";
import path from "path";

const PAGE_FILES = new Set(["page.js", "page.jsx", "page.ts", "page.tsx"]);

export const PAGE_CATEGORIES = [
  "Home",
  "Account",
  "Catalog and branches",
  "Mojaz",
  "Falk",
  "Shipping",
  "Videos",
  "Legal",
  "Unlinked",
  "Other",
];

const UNLINKED_PATHS = new Set(["/map", "/plans-gallery", "/new-branch"]);

const CATEGORY_RULES = [
  { category: "Home", match: (href) => href === "/" },
  {
    category: "Account",
    match: (href) => href === "/login" || href.startsWith("/signup/"),
  },
  {
    category: "Catalog and branches",
    match: (href) =>
      ["/prices", "/shipping-prices", "/branches", "/partners", "/orders", "/reports", "/social-media", "/makdom"].includes(
        href
      ),
  },
  {
    category: "Mojaz",
    match: (href) => href === "/pay-mojaz" || href.startsWith("/pay-mojaz/") || href.startsWith("/ask-mojaz-report"),
  },
  {
    category: "Falk",
    match: (href) => href === "/falk" || href.startsWith("/falk/"),
  },
  {
    category: "Shipping",
    match: (href) => href === "/shipping" || href.startsWith("/shipping/"),
  },
  {
    category: "Videos",
    match: (href) => href === "/videos" || href.startsWith("/videos/"),
  },
  {
    category: "Legal",
    match: (href) => ["/terms", "/privacy", "/return-policy"].includes(href),
  },
];

function isUnlinkedPath(href) {
  if (UNLINKED_PATHS.has(href)) return true;
  return [...UNLINKED_PATHS].some((base) => href.startsWith(`${base}/`));
}

function getPageCategory(href) {
  if (isUnlinkedPath(href)) return "Unlinked";
  return CATEGORY_RULES.find((rule) => rule.match(href))?.category ?? "Other";
}

function isRouteGroup(name) {
  return name.startsWith("(") && name.endsWith(")") && !name.includes(".");
}

function shouldSkipDirectory(name) {
  return name.startsWith("_") || name.startsWith("@") || name.startsWith(".") || name === "api";
}

function walk(dir, segments, pages) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile() || !PAGE_FILES.has(entry.name)) continue;

    const href = segments.length === 0 ? "/" : `/${segments.join("/")}`;
    pages.push({
      href,
      file: path.posix.join("app", ...segments, entry.name),
      dynamic: segments.some((segment) => segment.includes("[")),
      category: getPageCategory(href),
    });
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || shouldSkipDirectory(entry.name)) continue;

    const nextSegments = isRouteGroup(entry.name) ? segments : [...segments, entry.name];
    walk(path.join(dir, entry.name), nextSegments, pages);
  }
}

export function listSitePages() {
  const appDir = path.join(process.cwd(), "app");
  const pages = [];
  walk(appDir, [], pages);

  return pages.sort((a, b) => {
    const categoryDiff = PAGE_CATEGORIES.indexOf(a.category) - PAGE_CATEGORIES.indexOf(b.category);
    if (categoryDiff !== 0) return categoryDiff;
    return a.href.localeCompare(b.href, "en");
  });
}

export function groupSitePagesByCategory(pages = listSitePages()) {
  return PAGE_CATEGORIES.map((category) => ({
    category,
    pages: pages.filter((page) => page.category === category),
  })).filter((group) => group.pages.length > 0);
}
