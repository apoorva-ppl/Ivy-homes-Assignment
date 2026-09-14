"use client";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, MapPin, Layers, Building2, Calendar, FileCheck, Ruler, Home } from "lucide-react";
import { motion } from "framer-motion";
import { useProject } from "@/hooks/use-projects";
import { PropertyPlaceholder } from "@/components/property-placeholder";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate, titleCase } from "@/lib/utils";

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

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: project, isLoading, isError, error } = useProject(params.id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-8">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="mt-6 h-8 w-1/2" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-12">
        <EmptyState
          icon={AlertCircle}
          title="Couldn't load this project"
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

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative">
        <PropertyPlaceholder propertyType="apartment" className="h-64 w-full rounded-lg sm:h-80" />
        {project.project_status && (
          <Badge variant="ivy" className="absolute left-4 top-4 bg-white/90">
            {titleCase(project.project_status)}
          </Badge>
        )}
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="font-display text-3xl font-semibold text-ink">{project.apartment_name || "Unnamed project"}</p>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted">
            <MapPin size={14} /> {project.locality || "Locality unknown"}
          </p>
          {(project.price_min || project.price_max) && (
            <p className="mt-2 text-lg font-medium text-ink">
              {formatINR(project.price_min)} – {formatINR(project.price_max)}
            </p>
          )}

          <Card className="mt-6 divide-y divide-line px-4">
            <DetailRow icon={Building2} label="Developer" value={project.developer_name} />
            <DetailRow icon={Layers} label="Total units" value={project.total_units != null ? String(project.total_units) : undefined} />
            <DetailRow icon={Layers} label="Total towers" value={project.total_towers != null ? String(project.total_towers) : undefined} />
            <DetailRow
              icon={Ruler}
              label="Unit area range"
              value={
                project.min_area_sqft != null || project.max_area_sqft != null
                  ? `${project.min_area_sqft ?? "—"} – ${project.max_area_sqft ?? "—"} sq.ft`
                  : undefined
              }
            />
            <DetailRow icon={Calendar} label="Launch date" value={formatDate(project.launch_date)} />
            <DetailRow icon={Calendar} label="Possession date" value={formatDate(project.possession_date)} />
            <DetailRow icon={FileCheck} label="RERA number" value={project.rera_number} />
            <DetailRow icon={Home} label="Linked listings" value={project.total_listings != null ? String(project.total_listings) : undefined} />
          </Card>

          {project.amenities && project.amenities.length > 0 && (
            <div className="mt-6">
              <h2 className="font-display text-lg font-semibold text-ink">Amenities</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.amenities.map((a) => (
                  <Badge key={a} variant="outline">
                    {titleCase(a)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <Card className="p-5">
            <h3 className="font-display text-base font-semibold text-ink">At a glance</h3>
            <div className="mt-3 space-y-2 text-sm text-muted">
              <p>
                <span className="font-medium text-ink">{project.total_listings ?? 0}</span> active listings linked to this project
              </p>
              {project.rera_number && (
                <p className="flex items-center gap-1.5">
                  <FileCheck size={14} className="text-ivy-600" /> RERA registered
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
