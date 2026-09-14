"use client";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, MapPin, BedDouble, Bath, Ruler, Phone, Calendar, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { useRental } from "@/hooks/use-rentals";
import { PropertyPlaceholder } from "@/components/property-placeholder";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { formatINR, formatArea, formatDate } from "@/lib/utils";

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) {
  if (!value || value === "—") return null;
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ivy-50 text-ivy-600">
        <Icon size={15} />
      </span>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}

export default function RentalDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: rental, isLoading, isError, error } = useRental(params.id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-8">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="mt-6 h-8 w-1/2" />
      </div>
    );
  }

  if (isError || !rental) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-12">
        <EmptyState
          icon={AlertCircle}
          title="Couldn't load this rental"
          description={error instanceof Error ? error.message : "It may have been removed or is temporarily unavailable."}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <button onClick={() => router.back()} className="mb-5 flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
        <ArrowLeft size={15} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <PropertyPlaceholder propertyType="apartment" className="h-64 w-full rounded-lg sm:h-80" />
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="font-display text-3xl font-semibold text-ink">
            {formatINR(rental.price)} <span className="text-base font-normal text-muted">/month</span>
          </p>
          <p className="mt-1 text-lg font-medium text-ink">{rental.title || rental.apartment_name || "Unnamed property"}</p>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted">
            <MapPin size={14} /> {rental.locality || "Locality unknown"}
          </p>

          <Card className="mt-6 divide-y divide-line px-4">
            <DetailRow icon={BedDouble} label="Bedrooms" value={rental.bedroom != null ? String(rental.bedroom) : undefined} />
            <DetailRow icon={Bath} label="Bathrooms" value={rental.bathroom != null ? String(rental.bathroom) : undefined} />
            <DetailRow icon={Ruler} label="Carpet area" value={rental.carpet_area != null ? formatArea(rental.carpet_area) : undefined} />
            <DetailRow icon={Wallet} label="Security deposit" value={rental.deposit != null ? formatINR(rental.deposit) : undefined} />
            <DetailRow icon={Wallet} label="Maintenance" value={rental.maintenance != null ? formatINR(rental.maintenance) : undefined} />
            <DetailRow icon={Calendar} label="Posted" value={formatDate(rental.posted_at)} />
          </Card>

          {rental.description && (
            <div className="mt-6">
              <h2 className="font-display text-lg font-semibold text-ink">About this property</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">{rental.description}</p>
            </div>
          )}
        </div>

        <div>
          <Card className="p-5">
            <h3 className="font-display text-base font-semibold text-ink">Contact</h3>
            <div className="mt-3 divide-y divide-line">
              <DetailRow icon={Phone} label="Contact" value={rental.posted_by_contact} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
