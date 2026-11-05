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

export function loadCarCatalog() {
  return Promise.all([
    fetch("/api/car-models", { cache: "no-store" }).then((res) => res.json().catch(() => [])),
    fetch("/api/car-manufacturers", { cache: "no-store" }).then((res) => res.json().catch(() => [])),
  ]).then(([modelsData, manufacturersData]) => buildCatalog(modelsData, manufacturersData));
}
