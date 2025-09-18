// app/projects/[id]/page.tsx
"use client";

import React from "react";
import { useProject } from "@/hooks/use-projects";
import { ProjectHeader } from "@/components/project/project-header";
import { ProjectTabs } from "@/components/project/project-tabs";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  // Note: In Next.js 15, we need to handle the Promise params
  // For now, we'll extract the id synchronously (this might need adjustment based on your Next.js setup)
  const [id, setId] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  const { project } = useProject(id || "");

  return (
    <div className="space-y-6 p-6">
      <ProjectHeader project={project} />
      <ProjectTabs project={project} />
    </div>
  );
}