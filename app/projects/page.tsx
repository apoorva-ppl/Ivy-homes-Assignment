"use client";
import { useState } from "react";
import { AlertCircle, Building2 } from "lucide-react";
import { useProjects } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/project-card";
import { CardGridSkeleton } from "@/components/card-grid-skeleton";
import { EmptyState } from "@/components/empty-state";
import { Pagination } from "@/components/pagination";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 20;

const statusOptions = [
  { label: "Any status", value: "" },
  { label: "Under construction", value: "under-construction" },
  { label: "Ready to move", value: "ready-to-move" },
  { label: "New launch", value: "new-launch" },
];

export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const [locality, setLocality] = useState("");
  const [status, setStatus] = useState("");
  const [applied, setApplied] = useState({ locality: "", project_status: "" });

  const { data, isLoading, isError, error, isFetching } = useProjects({
    page,
    limit: PAGE_SIZE,
    locality: applied.locality || undefined,
    project_status: applied.project_status || undefined,
  });

  const results = data?.results ?? [];
  const totalPages = data ? Math.max(1, Math.ceil(data.total / (data.page_size || PAGE_SIZE))) : 1;

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-ink">New projects</h1>
        <p className="mt-1 text-sm text-muted">Explore developments across the city, from launch to possession.</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 rounded-lg border border-line bg-white p-4 shadow-card sm:flex-row sm:items-end">
        <div className="flex-1">
          <Label>Locality</Label>
          <Input placeholder="e.g. Whitefield" value={locality} onChange={(e) => setLocality(e.target.value)} />
        </div>
        <div className="flex-1">
          <Label>Status</Label>
          <Select options={statusOptions} value={status} onChange={setStatus} />
        </div>
        <Button
          onClick={() => {
            setApplied({ locality, project_status: status });
            setPage(1);
          }}
        >
          Apply
        </Button>
      </div>

      {isLoading ? (
        <CardGridSkeleton />
      ) : isError ? (
        <EmptyState
          icon={AlertCircle}
          title="Couldn't load projects"
          description={error instanceof Error ? error.message : "Something went wrong. Please try again."}
        />
      ) : results.length === 0 ? (
        <EmptyState icon={Building2} title="No projects found" description="Try a different locality or status." />
      ) : (
        <>
          <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? "opacity-60" : ""}`}>
            {results.map((project) => (
              <ProjectCard key={project.project_id} project={project} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
