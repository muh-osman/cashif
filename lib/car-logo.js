const GITHUB_LOGO_BASE =
  "https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb";
const GITHUB_LOCAL_LOGO_BASE =
  "https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/local-logos";
const LOGO_SLUG_ALIASES = {
  mercedes: "mercedes-benz",
  vw: "volkswagen",
  chevy: "chevrolet",
  gwm: "great-wall",
  "ssang-yong": "ssangyong",
  amg: "mercedes-amg",
  li: "li-auto",
  "range-rover": "land-rover",
};

export function makeLogoSlug(nameEn) {
  const slug = nameEn
    ?.trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) return null;
  return LOGO_SLUG_ALIASES[slug] || slug;
}

export function makeLogoSrc(nameEn) {
  const slug = makeLogoSlug(nameEn);
  return slug ? `${GITHUB_LOGO_BASE}/${slug}.png` : null;
}

export function makeLocalLogoSrc(nameEn) {
  const slug = makeLogoSlug(nameEn);
  return slug ? `${GITHUB_LOCAL_LOGO_BASE}/${slug}.png` : null;
}
