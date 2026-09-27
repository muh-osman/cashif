function normalizeModelKey(value) {
  return String(value || "")
    .trim()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export function buildManufacturerIndex(marks, manufacturers) {
  const nameById = new Map();

  for (const manufacturer of manufacturers || []) {
    const nameEn = manufacturer?.nameEn?.trim();
    if (manufacturer?.id != null && nameEn) nameById.set(manufacturer.id, nameEn);
  }

  const index = new Map();

  for (const mark of marks || []) {
    const nameEn = nameById.get(mark?.carManufacturerId);
    if (!nameEn) continue;

    for (const label of [mark.nameAr, mark.nameEn]) {
      const key = normalizeModelKey(label);
      if (key && !index.has(key)) index.set(key, nameEn);
    }
  }

  return index;
}

export function manufacturerForModel(model, index) {
  const raw = String(model || "").trim();
  if (!raw || !index) return null;

  const candidates = [raw, ...raw.split(/\s+[-–—/]\s+/).filter((part) => part && part !== raw)];

  for (const candidate of candidates) {
    const nameEn = index.get(normalizeModelKey(candidate));
    if (nameEn) return nameEn;
  }

  return null;
}
