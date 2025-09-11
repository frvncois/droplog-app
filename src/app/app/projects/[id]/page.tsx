import { notFound } from "next/navigation";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectTabs } from "@/components/projects/project-tabs";
import { getProjectById } from "@/lib/utils/dummy-data";

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <ProjectHeader project={project} />
      
      {/* Project Tabs Content */}
      <ProjectTabs project={project} />
    </div>
  );
}