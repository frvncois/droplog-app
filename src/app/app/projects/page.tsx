import { ProjectsHeader } from "@/components/projects/projects-header";
import { ProjectsDataTable } from "@/components/projects/projects-data-table";
import { ProjectsStats } from "@/components/projects/projects-stats";

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <ProjectsHeader />
      
      {/* Projects Stats Overview */}
      <ProjectsStats />
      
      {/* Projects Data Table */}
      <ProjectsDataTable />
    </div>
  );
}