import type { FilterValues } from "@/components/filter-bar";

export function applyClientFilters<T extends Record<string, unknown>>(
  items: T[],
  filters: FilterValues
): T[] {
  return items.filter((item) => {
    if (filters.locality) {
      const loc = String(item.locality ?? "").toLowerCase();
      if (!loc.includes(filters.locality.toLowerCase())) return false;
    }
    if (filters.bhk) {
      const bhk = Number(item.bedroom);
      const target = Number(filters.bhk);
      if (filters.bhk === "5") {
        if (!(bhk >= 5)) return false;
      } else if (bhk !== target) {
        return false;
      }
    }
    if (filters.property_type) {
      const type = String(item.property_type ?? "").toLowerCase();
      if (type !== filters.property_type.toLowerCase()) return false;
    }
    if (filters.furnishing) {
      const f = String(item.furnishing ?? "").toLowerCase().replace(/\s/g, "-");
      if (f !== filters.furnishing.toLowerCase()) return false;
    }
    if (filters.min_price) {
      const price = Number(item.price);
      if (!Number.isNaN(price) && price < Number(filters.min_price)) return false;
    }
    if (filters.max_price) {
      const price = Number(item.price);
      if (!Number.isNaN(price) && price > Number(filters.max_price)) return false;
    }
    return true;
  });
}

export function applyClientSort<T extends Record<string, unknown>>(
  items: T[],
  sortBy: string,
  order: string
): T[] {
  if (!sortBy) return items;
  const sorted = [...items].sort((a, b) => {
    const av = Number(a[sortBy]);
    const bv = Number(b[sortBy]);
    if (Number.isNaN(av) || Number.isNaN(bv)) return 0;
    return order === "asc" ? av - bv : bv - av;
  });
  return sorted;
}
