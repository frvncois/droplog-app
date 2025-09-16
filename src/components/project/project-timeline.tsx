// components/project/project-timeline.tsx

"use client";

import * as React from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Grid2X2,
  Plus,
  Users,
  Package,
  Target,
  CheckCircle,
  AlertTriangle,
  Eye,
  Zap,
  CalendarDays,
  CalendarRange
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Project,
  Task
} from "@/lib/utils/dummy-data";
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isSameMonth, 
  addWeeks, 
  addMonths, 
  subWeeks, 
  subMonths,
  parseISO,
  isToday
} from "date-fns";
import { cn } from "@/lib/utils";

import { EventViewModal } from "@/components/modals/event-view-modal";
import { EventCreateModal } from "@/components/modals/event-create-modal";

// Timeline event interface
interface TimelineEvent {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  type: 'meeting' | 'delivery' | 'milestone' | 'deadline' | 'review' | 'launch' | 'event' | 'task';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  startDate: string;
  endDate?: string;
  location?: string;
  isVirtual?: boolean;
  attendees?: string[];
  organizer?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags?: string[];
  attachments?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Props interface
interface ProjectTimelineProps {
  project: Project;
  tasks?: Task[];
  events?: TimelineEvent[];
  currentUserId?: string; // Add currentUserId prop
}

// Mock timeline events data
const mockEvents: TimelineEvent[] = [
  {
    id: "tl1",
    projectId: "p1",
    title: "Project Kickoff Meeting",
    description: "Initial project planning and team introduction session",
    type: "meeting",
    status: "completed",
    startDate: "2025-09-15T10:00:00Z",
    endDate: "2025-09-15T11:30:00Z",
    location: "Conference Room A",
    attendees: ["u1", "u2", "u3"],
    organizer: "u1",
    priority: "high",
    tags: ["kickoff", "planning"],
    createdAt: "2025-08-25T09:00:00Z",
    updatedAt: "2025-09-01T11:30:00Z"
  },
  {
    id: "tl2",
    projectId: "p1",
    title: "Design Review",
    description: "Review initial design concepts and wireframes",
    type: "review",
    status: "completed",
    startDate: "2025-09-18T14:00:00Z",
    endDate: "2025-09-18T16:00:00Z",
    isVirtual: true,
    attendees: ["u1", "u3"],
    organizer: "u3",
    priority: "medium",
    tags: ["design", "review"],
    createdAt: "2025-09-05T10:00:00Z",
    updatedAt: "2025-09-08T16:00:00Z"
  },
  {
    id: "tl3",
    projectId: "p1",
    title: "Client Presentation",
    description: "Demo current progress to stakeholders",
    type: "meeting",
    status: "scheduled",
    startDate: "2025-09-20T15:00:00Z",
    endDate: "2025-09-20T16:00:00Z",
    location: "Client Office",
    attendees: ["u1", "u2"],
    organizer: "u1",
    priority: "critical",
    tags: ["client", "demo"],
    createdAt: "2025-09-10T12:00:00Z",
    updatedAt: "2025-09-12T08:00:00Z"
  }
];

// Event type icon mapping
const getEventTypeIcon = (type: string) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    meeting: Users,
    delivery: Package,
    milestone: Target,
    deadline: AlertTriangle,
    review: Eye,
    launch: Zap,
    event: Calendar,
    task: CheckCircle
  };
  return icons[type] || Calendar;
};

// Status colors
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    completed: "bg-green-100 text-green-800 border-green-200",
    in_progress: "bg-blue-100 text-blue-800 border-blue-200",
    scheduled: "bg-gray-100 text-gray-800 border-gray-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    overdue: "bg-red-100 text-red-800 border-red-200"
  };
  return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
};

// Priority colors
const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    critical: "border-l-red-500",
    high: "border-l-orange-500",
    medium: "border-l-yellow-500",
    low: "border-l-green-500"
  };
  return colors[priority] || "border-l-gray-300";
};

// Convert tasks to timeline events
const tasksToTimelineEvents = (tasks: Task[]): TimelineEvent[] => {
  return tasks
    .filter(task => task.dueDate)
    .map(task => ({
      id: `task-${task.id}`,
      projectId: task.projectId,
      title: task.title,
      description: task.description,
      type: 'task' as const,
      status: task.status === 'completed' ? 'completed' as const : 
              task.status === 'in_progress' ? 'in_progress' as const : 'scheduled' as const,
      startDate: `${task.dueDate}T23:59:59Z`,
      priority: task.priority as 'low' | 'medium' | 'high' | 'critical',
      organizer: task.assignedTo,
      tags: ['task'],
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    }));
};

export function ProjectTimeline({ 
  project, 
  tasks = [], 
  events: externalEvents,
  currentUserId = "u1" // Default to u1 if not provided
}: ProjectTimelineProps) {
  // State
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [viewMode, setViewMode] = React.useState<'week' | 'month'>('week');
  const [events, setEvents] = React.useState<TimelineEvent[]>([]);
  
  // Modal states
  const [selectedEvent, setSelectedEvent] = React.useState<TimelineEvent | null>(null);
  const [showViewModal, setShowViewModal] = React.useState(false);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<TimelineEvent | null>(null);

  // Initialize events
  React.useEffect(() => {
    const taskEvents = tasksToTimelineEvents(tasks);
    const projectEvents = externalEvents || mockEvents.filter(e => e.projectId === project.id);
    const newEvents = [...projectEvents, ...taskEvents];
    
    // Only update if events actually changed
    setEvents(prevEvents => {
      const eventsChanged = prevEvents.length !== newEvents.length || 
        !prevEvents.every(event => newEvents.some(newEvent => newEvent.id === event.id));
      
      return eventsChanged ? newEvents : prevEvents;
    });
  }, [project.id]); // Remove tasks and externalEvents from dependencies

  // Separate effect for tasks changes
  React.useEffect(() => {
    if (tasks.length > 0) {
      const taskEvents = tasksToTimelineEvents(tasks);
      setEvents(prevEvents => {
        // Remove old task events and add new ones
        const nonTaskEvents = prevEvents.filter(event => !event.id.startsWith('task-'));
        return [...nonTaskEvents, ...taskEvents];
      });
    }
  }, [tasks.length]); // Only depend on tasks length, not the array itself

  // Separate effect for external events
  React.useEffect(() => {
    if (externalEvents) {
      setEvents(prevEvents => {
        // Remove old external events and add new ones
        const taskEvents = prevEvents.filter(event => event.id.startsWith('task-'));
        return [...externalEvents, ...taskEvents];
      });
    }
  }, [externalEvents?.length]); // Only depend on external events length

  // Calendar calculations
  const calendarStart = React.useMemo(() => {
    if (viewMode === 'week') {
      return startOfWeek(currentDate, { weekStartsOn: 0 });
    } else {
      return startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    }
  }, [currentDate, viewMode]);

  const calendarEnd = React.useMemo(() => {
    if (viewMode === 'week') {
      return endOfWeek(currentDate, { weekStartsOn: 0 });
    } else {
      return endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
    }
  }, [currentDate, viewMode]);

  const calendarDays = React.useMemo(() => {
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [calendarStart, calendarEnd]);

  // Event handlers
  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(parseISO(event.startDate), day));
  };

  const handlePrevious = () => {
    if (viewMode === 'week') {
      setCurrentDate(prev => subWeeks(prev, 1));
    } else {
      setCurrentDate(prev => subMonths(prev, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'week') {
      setCurrentDate(prev => addWeeks(prev, 1));
    } else {
      setCurrentDate(prev => addMonths(prev, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleViewModeChange = (value: string) => {
    if (value === 'week' || value === 'month') {
      setViewMode(value);
    }
  };

  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setShowViewModal(true);
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowCreateModal(true);
  };

  const handleEditEvent = (event: TimelineEvent) => {
    setShowViewModal(false);
    setEditingEvent(event);
    setShowCreateModal(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setShowViewModal(false);
  };

  const handleDuplicateEvent = (event: TimelineEvent) => {
    const duplicatedEvent = {
      ...event,
      id: `tl-${Date.now()}`,
      title: `${event.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEvents(prev => [...prev, duplicatedEvent]);
    setShowViewModal(false);
  };

  const handleCreateEvent = (eventData: Omit<TimelineEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: TimelineEvent = {
      ...eventData,
      id: `tl-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleUpdateEvent = (updatedEvent: TimelineEvent) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  // Calendar title
  const getCalendarTitle = () => {
    if (viewMode === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    } else {
      return format(currentDate, 'MMMM yyyy');
    }
  };

  // Render calendar views
  const renderWeekView = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <div className="grid grid-cols-7 gap-px bg-muted border rounded-xl overflow-hidden">
        {weekDays.map((day) => (
          <div key={day} className="bg-muted p-2 text-center text-sm font-medium text-gray-700">
            {day}
          </div>
        ))}
        
        {calendarDays.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);
          
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "bg-white p-2 min-h-[200px] transition-colors hover:bg-gray-50",
                !isCurrentMonth && "bg-gray-50 text-gray-400"
              )}
            >
              <div className={cn(
                "text-sm font-medium mb-2",
                isDayToday && "bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
              )}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => {
                  const IconComponent = getEventTypeIcon(event.type);
                  
                  return (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      className={cn(
                        "p-1 rounded text-xs border-l-2 cursor-pointer hover:shadow-sm transition-shadow",
                        getStatusColor(event.status),
                        getPriorityColor(event.priority)
                      )}
                    >
                      <div className="flex items-center space-x-1">
                        <IconComponent className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate font-medium">{event.title}</span>
                      </div>
                      <div className="text-xs opacity-75 mt-0.5">
                        {format(parseISO(event.startDate), 'h:mm a')}
                      </div>
                    </div>
                  );
                })}
                
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 p-1">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMonthView = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeks: Date[][] = [];
    
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }
    
    return (
      <div className="space-y-px border rounded-xl overflow-hidden bg-muted">
        <div className="grid grid-cols-7 gap-px bg-muted">
          {weekDays.map((day) => (
            <div key={day} className="bg-muted p-2 text-center text-sm font-medium">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid gap-px bg-gray-200 rounded-b-lg overflow-hidden">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-px">
              {week.map((day) => {
                const dayEvents = getEventsForDay(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isDayToday = isToday(day);
                
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "bg-white p-2 min-h-[100px] transition-colors hover:bg-gray-50",
                      !isCurrentMonth && "bg-gray-50 text-gray-400"
                    )}
                  >
                    <div className={cn(
                      "text-sm font-medium mb-2",
                      isDayToday && "bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    )}>
                      {format(day, 'd')}
                    </div>
                    
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => {
                        const IconComponent = getEventTypeIcon(event.type);
                        
                        return (
                          <div
                            key={event.id}
                            onClick={() => handleEventClick(event)}
                            className={cn(
                              "p-1 rounded text-xs border-l-2 cursor-pointer hover:shadow-sm transition-shadow",
                              getStatusColor(event.status),
                              getPriorityColor(event.priority)
                            )}
                          >
                            <div className="flex items-center space-x-1">
                              <IconComponent className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate font-medium">{event.title}</span>
                            </div>
                          </div>
                        );
                      })}
                      
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500 p-1">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Project Timeline</h2>
          <p className="text-muted-foreground text-sm">
            Track events, milestones, and task deadlines for {project.title}
          </p>
        </div>
        <Button onClick={handleAddEvent}>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Calendar Controls */}


          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Button variant="outline" size="sm" onClick={handlePrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleToday} className="min-w-[80px]">
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={handleNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="text-lg font-semibold">{getCalendarTitle()}</h3>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                  className="rounded-r-none"
                >
                  <Columns2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'month' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('month')}
                  className="rounded-l-none"
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        
          {viewMode === 'week' ? renderWeekView() : renderMonthView()}

      {/* Event Legend */}
      <Card>
        <CardHeader>
          <div className="text-base">Event Types</div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { type: 'meeting', label: 'Meetings', icon: Users },
              { type: 'milestone', label: 'Milestones', icon: Target },
              { type: 'deadline', label: 'Deadlines', icon: AlertTriangle },
              { type: 'review', label: 'Reviews', icon: Eye },
              { type: 'delivery', label: 'Deliveries', icon: Package },
              { type: 'launch', label: 'Launches', icon: Zap },
              { type: 'task', label: 'Tasks', icon: CheckCircle },
              { type: 'event', label: 'Events', icon: Calendar }
            ].map(({ type, label, icon: Icon }) => (
              <div key={type} className="flex items-center space-x-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Priority Levels</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { priority: 'low', label: 'Low', color: 'border-l-green-500' },
                { priority: 'medium', label: 'Medium', color: 'border-l-yellow-500' },
                { priority: 'high', label: 'High', color: 'border-l-orange-500' },
                { priority: 'critical', label: 'Critical', color: 'border-l-red-500' }
              ].map(({ priority, label, color }) => (
                <div key={priority} className="flex items-center space-x-2">
                  <div className={cn("w-3 h-3 border-l-4", color)}></div>
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <EventViewModal
        open={showViewModal}
        onOpenChange={setShowViewModal}
        event={selectedEvent}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        onDuplicate={handleDuplicateEvent}
      />

      <EventCreateModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        projectId={project.id}
        currentUserId={currentUserId}
        editingEvent={editingEvent}
        onCreateEvent={handleCreateEvent}
        onUpdateEvent={handleUpdateEvent}
      />
    </div>
  );
}