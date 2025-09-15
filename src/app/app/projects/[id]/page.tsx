// app/projects/[id]/page.tsx

import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/utils/dummy-data";
import { ProjectTabs } from "@/components/projects/project-tabs";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  // Await params in Next.js 15
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{project.title}</h1>
        {project.description && (
          <p className="text-muted-foreground mt-2">{project.description}</p>
        )}
      </div>
      
      <ProjectTabs project={project} />
    </div>
  );
}