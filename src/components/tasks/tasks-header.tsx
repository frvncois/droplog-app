"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskCreateModal } from "@/components/modals/task-create-modal";
import { Task } from "@/lib/utils/dummy-data";

interface TasksHeaderProps {
  onCreateTask?: (newTaskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function TasksHeader({ onCreateTask }: TasksHeaderProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const handleCreateTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (onCreateTask) {
      onCreateTask(newTaskData);
    }
    console.log('Created new task:', newTaskData);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Manage and track all your tasks across projects
          </p>
        </div>
        <div className="space-y-0">
          <div className="flex items-center space-x-2">
            <Button variant="default" size="sm" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create new task
            </Button>
          </div>
        </div>
      </div>

      {/* Task Create Modal */}
      <TaskCreateModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        projectId="" // For global task creation, project selection handled in modal
        onCreateTask={handleCreateTask}
      />
    </div>
  );
}