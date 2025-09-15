// components/tasks/task-view-sheet.tsx
"use client";

interface TaskViewSheetProps {
  task: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskViewSheet({ task, open, onOpenChange }: TaskViewSheetProps) {
  return (
    <div>
      {open && task && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 m-4 rounded">
            <h2 className="text-xl font-bold">{task.title}</h2>
            <p className="mt-2">Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            {task.description && <p className="mt-2">{task.description}</p>}
            <button 
              onClick={() => onOpenChange(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}