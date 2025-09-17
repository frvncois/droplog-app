// src/app/app/timeline/page.tsx

import { TimelineHeader } from "@/components/timeline/timeline-header";
import { TimelineCalendar } from "@/components/timeline/timeline-calendar";

export default function TimelinePage() {
  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <TimelineHeader />
      
      {/* Timeline Calendar */}
      <TimelineCalendar />
    </div>
  );
}