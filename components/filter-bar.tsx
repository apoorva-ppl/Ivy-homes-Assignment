"use client";
import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet } from "@/components/ui/sheet";

export interface FilterValues {
  locality: string;
  bhk: string;
  property_type: string;
  furnishing: string;
  min_price: string;
  max_price: string;
  sort_by: string;
  order: string;
}

export const emptyFilters: FilterValues = {
  locality: "",
  bhk: "",
  property_type: "",
  furnishing: "",
  min_price: "",
  max_price: "",
  sort_by: "posted_at",
  order: "desc",
};

const bhkOptions = [
  { label: "Any BHK", value: "" },
  { label: "1 BHK", value: "1" },
  { label: "2 BHK", value: "2" },
  { label: "3 BHK", value: "3" },
  { label: "4 BHK", value: "4" },
  { label: "5+ BHK", value: "5" },
];

const furnishingOptions = [
  { label: "Any furnishing", value: "" },
  { label: "Furnished", value: "furnished" },
  { label: "Semi-furnished", value: "semi-furnished" },
  { label: "Unfurnished", value: "unfurnished" },
];

const propertyTypeOptions = [
  { label: "Any type", value: "" },
  { label: "Apartment", value: "apartment" },
  { label: "Villa", value: "villa" },
  { label: "Plot", value: "plot" },
  { label: "Studio", value: "studio" },
];

const sortOptions = [
  { label: "Newest", value: "posted_at" },
  { label: "Price", value: "price" },
  { label: "Area", value: "carpet_area" },
];

interface FilterBarProps {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  showPropertyType?: boolean;
  resultCount?: number;
}

function FilterFields({
  local,
  setLocal,
  showPropertyType,
}: {
  local: FilterValues;
  setLocal: (v: FilterValues) => void;
  showPropertyType?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
      <div className="lg:col-span-2">
        <Label>Locality</Label>
        <Input
          placeholder="e.g. Koramangala"
          value={local.locality}
          onChange={(e) => setLocal({ ...local, locality: e.target.value })}
        />
      </div>
      <div>
        <Label>Bedrooms</Label>
        <Select options={bhkOptions} value={local.bhk} onChange={(v) => setLocal({ ...local, bhk: v })} />
      </div>
      {showPropertyType && (
        <div>
          <Label>Property type</Label>
          <Select
            options={propertyTypeOptions}
            value={local.property_type}
            onChange={(v) => setLocal({ ...local, property_type: v })}
          />
        </div>
      )}
      <div>
        <Label>Furnishing</Label>
        <Select
          options={furnishingOptions}
          value={local.furnishing}
          onChange={(v) => setLocal({ ...local, furnishing: v })}
        />
      </div>
      <div>
        <Label>Min price</Label>
        <Input
          type="number"
          placeholder="₹ min"
          value={local.min_price}
          onChange={(e) => setLocal({ ...local, min_price: e.target.value })}
        />
      </div>
      <div>
        <Label>Max price</Label>
        <Input
          type="number"
          placeholder="₹ max"
          value={local.max_price}
          onChange={(e) => setLocal({ ...local, max_price: e.target.value })}
        />
      </div>
      <div>
        <Label>Sort by</Label>
        <Select options={sortOptions} value={local.sort_by} onChange={(v) => setLocal({ ...local, sort_by: v })} />
      </div>
      <div>
        <Label>Order</Label>
        <Select
          options={[
            { label: "Descending", value: "desc" },
            { label: "Ascending", value: "asc" },
          ]}
          value={local.order}
          onChange={(v) => setLocal({ ...local, order: v })}
        />
      </div>
    </div>
  );
}

export function FilterBar({ values, onChange, showPropertyType, resultCount }: FilterBarProps) {
  const [local, setLocal] = useState(values);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setLocal(values), [values]);

  const activeCount = Object.entries(local).filter(
    ([k, v]) => v && !(k === "sort_by" && v === "posted_at") && !(k === "order" && v === "desc")
  ).length;

  return (
    <div className="mb-6">
      {/* Desktop */}
      <div className="hidden rounded-lg border border-line bg-white p-4 shadow-card md:block">
        <FilterFields local={local} setLocal={setLocal} showPropertyType={showPropertyType} />
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted">
            {resultCount != null ? `${resultCount.toLocaleString("en-IN")} results` : ""}
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setLocal(emptyFilters); onChange(emptyFilters); }}>
              Clear
            </Button>
            <Button size="sm" onClick={() => onChange(local)}>
              Apply filters
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile trigger */}
      <div className="flex items-center justify-between md:hidden">
        <p className="text-xs text-muted">
          {resultCount != null ? `${resultCount.toLocaleString("en-IN")} results` : ""}
        </p>
        <Button variant="outline" size="sm" onClick={() => setMobileOpen(true)}>
          <SlidersHorizontal size={14} /> Filters {activeCount > 0 && `(${activeCount})`}
        </Button>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen} title="Filters">
        <FilterFields local={local} setLocal={setLocal} showPropertyType={showPropertyType} />
        <div className="mt-6 flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setLocal(emptyFilters);
              onChange(emptyFilters);
              setMobileOpen(false);
            }}
          >
            Clear
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              onChange(local);
              setMobileOpen(false);
            }}
          >
            Show results
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
