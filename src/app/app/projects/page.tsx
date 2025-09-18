// app/projects/page.tsx
"use client";

import { ProjectsHeader } from "@/components/projects/projects-header";
import { ProjectsDataTable } from "@/components/projects/projects-data-table";
import { ProjectsStats } from "@/components/projects/projects-stats";
import { useProjects } from "@/hooks/use-projects";

export default function ProjectsPage() {
  const { projects } = useProjects();

  return (
    <div className="space-y-6 p-6 animate-fadeIn">
      <ProjectsHeader />
      <ProjectsStats projects={projects} />
      <ProjectsDataTable projects={projects} />
    </div>
  );
}