// src/components/timeline/timeline-header.tsx

"use client";

import { Button } from "@/components/ui/button";
import { CalendarDays, Plus } from "lucide-react";

export function TimelineHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <CalendarDays className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timeline</h1>
          <p className="text-muted-foreground">
            View all events and deadlines across your projects
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>
    </div>
  );
}