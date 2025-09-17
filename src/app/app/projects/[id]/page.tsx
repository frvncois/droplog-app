// app/projects/[id]/page.tsx

import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/utils/dummy-data";
import { ProjectHeader } from "@/components/project/project-header";
import { ProjectTabs } from "@/components/project/project-tabs";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6 p-6">
      <ProjectHeader project={project} />
      <ProjectTabs project={project} />
    </div>
  );
}