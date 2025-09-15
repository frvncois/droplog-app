"use client";

import React from "react";

interface SimpleTaskViewerProps {
  taskId: string | null;
  onClose: () => void;
}

export function SimpleTaskViewer({ taskId, onClose }: SimpleTaskViewerProps) {
  if (!taskId) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded">
        <h2>Task: {taskId}</h2>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Close
        </button>
      </div>
    </div>
  );
}