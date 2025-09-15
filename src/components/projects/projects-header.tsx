// components/projects/projects-header.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProjectCreateModal } from "@/components/modals/project-create-modal";
import { Project } from "@/lib/utils/dummy-data";

interface ProjectsHeaderProps {
  onProjectCreated?: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasksCount'>) => void;
}

export function ProjectsHeader({ onProjectCreated }: ProjectsHeaderProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasksCount'>) => {
    // Create the full project object with generated data
    const newProject: Project = {
      ...projectData,
      id: `p${Date.now()}`, // Generate a unique ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasksCount: 0 // New projects start with 0 tasks
    };

    // Call the parent callback if provided
    onProjectCreated?.(projectData);
    
    // You could also update a global state or make an API call here
    console.log('New project created:', newProject);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-0">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
            </div>
            <p className="text-muted-foreground text-sm max-w-2xl">
              Manage and organize all your projects in one place
            </p>
          </div>
          <div className="space-y-0">
            <div className="flex items-center space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create project
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Create Modal */}
      <ProjectCreateModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreateProject={handleCreateProject}
      />
    </>
  );
}