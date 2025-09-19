// app/projects/[id]/page.tsx
"use client";

import React from "react";
import { ProjectHeader } from "@/components/project/project-header";
import { ProjectTabs } from "@/components/project/project-tabs";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const [id, setId] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  if (!id) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Pass projectId, not project object */}
      <ProjectHeader projectId={id} />
      <ProjectTabs projectId={id} />
    </div>
  );
}