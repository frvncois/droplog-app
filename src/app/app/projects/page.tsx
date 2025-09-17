// app/projects/page.tsx - CLEANED

"use client";

import { useState } from "react";
import { ProjectsHeader } from "@/components/projects/projects-header";
import { ProjectsDataTable } from "@/components/projects/projects-data-table";
import { ProjectsStats } from "@/components/projects/projects-stats";
import { Project, projects as initialProjects } from "@/lib/utils/dummy-data";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const handleProjectCreated = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasksCount'>) => {
    const newProject: Project = {
      ...projectData,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasksCount: 0 
    };
    setProjects(prev => [newProject, ...prev]);
  };

  return (
    <div className="space-y-6 p-6 animate-fadeIn">
      <ProjectsHeader onProjectCreated={handleProjectCreated} />
      <ProjectsStats projects={projects} />
      <ProjectsDataTable projects={projects} />
    </div>
  );
}