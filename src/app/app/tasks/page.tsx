
import { TasksHeader } from "@/components/tasks/tasks-header";
import { TasksStats } from "@/components/tasks/tasks-stats";
import { TasksDataTable } from "@/components/tasks/tasks-data-table";

export default function TasksPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <TasksHeader />
      
      {/* Tasks Stats Overview */}
      <TasksStats />
      
      {/* Tasks Data Table */}
      <TasksDataTable />
    </div>
  );
}