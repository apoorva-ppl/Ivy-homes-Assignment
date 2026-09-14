"use client";
import { AlertCircle, TrendingUp, BarChart3, ClipboardList, Info } from "lucide-react";
import { useAnalytics } from "@/hooks/use-analytics";
import { LocalityBarChart } from "@/components/charts/locality-bar-chart";
import { BhkPieChart } from "@/components/charts/bhk-pie-chart";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { formatINR } from "@/lib/utils";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-ink">{value}</p>
    </Card>
  );
}

export default function InsightsPage() {
  const { data, isLoading, isError, error } = useAnalytics();

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-ink">Market insights</h1>
        <p className="mt-1 text-sm text-muted">
          {data?.city ? `A snapshot of the market in ${data.city}.` : "A snapshot of the current listings data."}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-80" />
        </div>
      ) : isError || !data ? (
        <EmptyState
          icon={AlertCircle}
          title="Couldn't load market insights"
          description={error instanceof Error ? error.message : "Something went wrong. Please try again."}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Total listings" value={data.total_listings != null ? data.total_listings.toLocaleString("en-IN") : "—"} />
            <StatCard label="Median price" value={formatINR(data.median_price)} />
            <StatCard label="Median price / sq.ft" value={data.median_price_per_sqft != null ? `₹${data.median_price_per_sqft.toLocaleString("en-IN")}` : "—"} />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {data.by_locality && data.by_locality.length > 0 && (
              <Card className="p-5">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
                  <BarChart3 size={17} className="text-ivy-600" /> By locality
                </h2>
                <div className="mt-3">
                  <LocalityBarChart data={data.by_locality} />
                </div>
              </Card>
            )}
            {data.by_bhk && data.by_bhk.length > 0 && (
              <Card className="p-5">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
                  <TrendingUp size={17} className="text-ivy-600" /> BHK mix
                </h2>
                <div className="mt-3">
                  <BhkPieChart data={data.by_bhk} />
                </div>
              </Card>
            )}
          </div>

          <div className="mt-8">
            <Card className="p-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
                <ClipboardList size={17} className="text-ivy-600" /> Data quality notes
              </h2>
              <p className="mt-1 text-sm text-muted">
                This section is reserved for findings from the data-analysis pass — duplicates, fake listings, and
                doc-vs-API discrepancies.
              </p>
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-dashed border-line bg-paper px-4 py-6 text-sm text-muted">
                <Info size={16} className="mt-0.5 shrink-0 text-ivy-500" />
                <span>
                  No findings loaded yet. Drop a JSON file of findings here (e.g. <code className="rounded bg-sand px-1 py-0.5 text-xs">data-quality-notes.json</code>)
                  to populate this list — each item can render as a card below.
                </span>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
