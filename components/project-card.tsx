"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Building2, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PropertyPlaceholder } from "@/components/property-placeholder";
import { Badge } from "@/components/ui/badge";
import { formatINR, titleCase } from "@/lib/utils";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
      <Link href={`/projects/${project.project_id}`}>
        <Card className="overflow-hidden">
          <div className="relative h-40 w-full">
            <PropertyPlaceholder propertyType="apartment" className="h-full w-full" />
            {project.project_status && (
              <Badge variant="ivy" className="absolute left-3 top-3 bg-white/90">
                {titleCase(project.project_status)}
              </Badge>
            )}
          </div>
          <div className="p-4">
            <p className="truncate font-display text-lg font-semibold text-ink">
              {project.apartment_name || "Unnamed project"}
            </p>
            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted">
              <MapPin size={12} /> {project.locality || "Locality unknown"}
            </p>
            {(project.price_min || project.price_max) && (
              <p className="mt-2 text-sm font-medium text-ink">
                {formatINR(project.price_min)} – {formatINR(project.price_max)}
              </p>
            )}
            <div className="mt-3 flex items-center gap-3 border-t border-line pt-3 text-xs text-muted">
              {project.developer_name && (
                <span className="flex items-center gap-1 truncate">
                  <Building2 size={13} /> {project.developer_name}
                </span>
              )}
              {project.total_units != null && (
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <Layers size={13} /> {project.total_units} units
                </span>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
