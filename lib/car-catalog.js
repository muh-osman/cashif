let catalogCache = null;
let catalogPromise = null;

function buildCatalog(modelsData, manufacturersData) {
  const manufacturersById = new Map();

  for (const manufacturer of Array.isArray(manufacturersData) ? manufacturersData : []) {
    if (manufacturer?.id != null) {
      manufacturersById.set(manufacturer.id, manufacturer.nameAr || manufacturer.nameEn || "");
    }
  }

  return {
    models: Array.isArray(modelsData) ? modelsData : [],
    manufacturersById,
  };
}

export function getCachedCarCatalog() {
  return catalogCache;
}

export function loadCarCatalog() {
  if (catalogCache) return Promise.resolve(catalogCache);
  if (catalogPromise) return catalogPromise;

  catalogPromise = Promise.all([
    fetch("/api/car-models").then((res) => res.json().catch(() => [])),
    fetch("/api/car-manufacturers").then((res) => res.json().catch(() => [])),
  ])
    .then(([modelsData, manufacturersData]) => {
      catalogCache = buildCatalog(modelsData, manufacturersData);
      return catalogCache;
    })
    .catch((error) => {
      catalogPromise = null;
      throw error;
    });

  return catalogPromise;
}
