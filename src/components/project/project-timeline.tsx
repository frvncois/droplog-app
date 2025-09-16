// components/projects/project-timeline.tsx

"use client";

import * as React from "react";
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  SortAsc,
  MoreVertical,
  MapPin,
  Users,
  Package,
  Target,
  CheckCircle,
  AlertTriangle,
  FileText,
  Video,
  Coffee,
  Zap,
  Flag,
  Eye,
  Edit,
  Copy,
  Trash2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Project,
  getTeamMemberById 
} from "@/lib/utils/dummy-data";
import { format, isToday, isTomorrow, isYesterday, isPast, isFuture } from "date-fns";
import { formatRelativeTime } from "@/lib/utils";

// Timeline event interface
interface TimelineEvent {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  type: 'meeting' | 'delivery' | 'milestone' | 'deadline' | 'review' | 'launch' | 'event';
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

// Mock timeline data
const getProjectTimeline = (projectId: string): TimelineEvent[] => [
  {
    id: "tl1",
    projectId: projectId,
    title: "Project Kickoff Meeting",
    description: "Initial project planning and team introduction session",
    type: "meeting",
    status: "completed",
    startDate: "2025-09-01T10:00:00Z",
    endDate: "2025-09-01T11:30:00Z",
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
    projectId: projectId,
    title: "Design Review Checkpoint",
    description: "Review initial design concepts and wireframes",
    type: "review",
    status: "completed",
    startDate: "2025-09-08T14:00:00Z",
    endDate: "2025-09-08T16:00:00Z",
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
    projectId: projectId,
    title: "Development Sprint 1 Delivery",
    description: "First iteration of core functionality",
    type: "delivery",
    status: "completed",
    startDate: "2025-09-15T17:00:00Z",
    organizer: "u2",
    priority: "high",
    tags: ["development", "sprint"],
    attachments: ["build-v1.0.zip", "release-notes.md"],
    createdAt: "2025-09-01T09:00:00Z",
    updatedAt: "2025-09-15T17:30:00Z"
  },
  {
    id: "tl4",
    projectId: projectId,
    title: "Client Presentation",
    description: "Demo current progress to stakeholders",
    type: "meeting",
    status: "scheduled",
    startDate: "2025-09-18T15:00:00Z",
    endDate: "2025-09-18T16:00:00Z",
    location: "Client Office",
    attendees: ["u1", "u2"],
    organizer: "u1",
    priority: "critical",
    tags: ["client", "demo"],
    createdAt: "2025-09-10T12:00:00Z",
    updatedAt: "2025-09-12T08:00:00Z"
  },
  {
    id: "tl5",
    projectId: projectId,
    title: "Beta Testing Milestone",
    description: "Launch beta version for user testing",
    type: "milestone",
    status: "scheduled",
    startDate: "2025-09-25T09:00:00Z",
    organizer: "u2",
    priority: "high",
    tags: ["beta", "testing"],
    createdAt: "2025-09-01T09:00:00Z",
    updatedAt: "2025-09-12T10:00:00Z"
  },
  {
    id: "tl6",
    projectId: projectId,
    title: "Final Deadline",
    description: "Project completion and final delivery",
    type: "deadline",
    status: "scheduled",
    startDate: "2025-10-15T23:59:59Z",
    organizer: "u1",
    priority: "critical",
    tags: ["deadline", "completion"],
    createdAt: "2025-09-01T09:00:00Z",
    updatedAt: "2025-09-01T09:00:00Z"
  }
];

const getEventTypeIcon = (type: string) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    meeting: Users,
    delivery: Package,
    milestone: Target,
    deadline: Clock,
    review: FileText,
    launch: Zap,
    event: Calendar
  };
  return icons[type] || Calendar;
};

const getEventTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    meeting: "bg-blue-100 text-blue-800 border-blue-200",
    delivery: "bg-green-100 text-green-800 border-green-200",
    milestone: "bg-purple-100 text-purple-800 border-purple-200",
    deadline: "bg-red-100 text-red-800 border-red-200",
    review: "bg-yellow-100 text-yellow-800 border-yellow-200",
    launch: "bg-indigo-100 text-indigo-800 border-indigo-200",
    event: "bg-gray-100 text-gray-800 border-gray-200"
  };
  return colors[type] || "bg-gray-100 text-gray-800 border-gray-200";
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-800",
    overdue: "bg-red-100 text-red-800"
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    low: "text-green-600",
    medium: "text-yellow-600",
    high: "text-orange-600",
    critical: "text-red-600"
  };
  return colors[priority] || "text-gray-600";
};

// Type filter options
const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "meeting", label: "Meetings" },
  { value: "delivery", label: "Deliveries" },
  { value: "milestone", label: "Milestones" },
  { value: "deadline", label: "Deadlines" },
  { value: "review", label: "Reviews" },
  { value: "launch", label: "Launches" },
  { value: "event", label: "Events" },
];

// Status filter options
const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "scheduled", label: "Scheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "overdue", label: "Overdue" },
];

// Sort options
const sortOptions = [
  { value: "startDate", label: "Date" },
  { value: "priority", label: "Priority" },
  { value: "type", label: "Type" },
  { value: "title", label: "Title A-Z" },
];

interface ProjectTimelineProps {
  project: Project;
  events?: TimelineEvent[];
  showCompact?: boolean;
  maxEvents?: number;
}

export function ProjectTimeline({ project, events: externalEvents, showCompact = false, maxEvents }: ProjectTimelineProps) {
  const originalEvents = React.useMemo(() => getProjectTimeline(project.id), [project.id]);
  const [data, setData] = React.useState(() => externalEvents || originalEvents);

  // Update data when external events change
  React.useEffect(() => {
    if (externalEvents) {
      setData(externalEvents);
    } else {
      setData(originalEvents);
    }
  }, [externalEvents, originalEvents]);

  // Filter states
  const [searchTerm, setSearchTerm] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("startDate");
  const [viewMode, setViewMode] = React.useState<'timeline' | 'list'>('timeline');

  // Timeline statistics
  const timelineStats = React.useMemo(() => {
    const totalEvents = data.length;
    const completedEvents = data.filter(e => e.status === "completed");
    const upcomingEvents = data.filter(e => e.status === "scheduled" && isFuture(new Date(e.startDate)));
    const overdueEvents = data.filter(e => e.status === "overdue" || (e.status === "scheduled" && isPast(new Date(e.startDate))));
    const todayEvents = data.filter(e => isToday(new Date(e.startDate)));
    
    const completionRate = totalEvents > 0 ? Math.round((completedEvents.length / totalEvents) * 100) : 0;
    
    return {
      totalEvents,
      completedEvents: completedEvents.length,
      upcomingEvents: upcomingEvents.length,
      overdueEvents: overdueEvents.length,
      todayEvents: todayEvents.length,
      completionRate
    };
  }, [data]);

  // Filter and sort events
  const filteredAndSortedEvents = React.useMemo(() => {
    let filtered = data;

    // For compact mode, only show upcoming and today's events
    if (showCompact) {
      const today = new Date();
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.startDate);
        return eventDate >= today || isToday(eventDate);
      });
    }

    // Apply search filter (only in full mode)
    if (!showCompact && searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      );
    }

    // Apply type filter (only in full mode)
    if (!showCompact && typeFilter !== "all") {
      filtered = filtered.filter(event => event.type === typeFilter);
    }

    // Apply status filter (only in full mode)
    if (!showCompact && statusFilter !== "all") {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      const sortKey = showCompact ? "startDate" : sortBy;
      switch (sortKey) {
        case "startDate":
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case "priority":
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
                 (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
        case "type":
          return a.type.localeCompare(b.type);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    // Limit events for compact mode
    if (showCompact && maxEvents) {
      filtered = filtered.slice(0, maxEvents);
    }

    return filtered;
  }, [data, searchTerm, typeFilter, statusFilter, sortBy, showCompact, maxEvents]);

  const handleEventAction = (action: string, event: TimelineEvent) => {
    console.log(`${action} event:`, event.id);
  };

  const formatEventDate = (event: TimelineEvent) => {
    const startDate = new Date(event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : null;
    
    if (isToday(startDate)) {
      return `Today, ${format(startDate, "h:mm a")}${endDate ? ` - ${format(endDate, "h:mm a")}` : ""}`;
    } else if (isTomorrow(startDate)) {
      return `Tomorrow, ${format(startDate, "h:mm a")}${endDate ? ` - ${format(endDate, "h:mm a")}` : ""}`;
    } else if (isYesterday(startDate)) {
      return `Yesterday, ${format(startDate, "h:mm a")}${endDate ? ` - ${format(endDate, "h:mm a")}` : ""}`;
    } else {
      return `${format(startDate, "MMM d, yyyy h:mm a")}${endDate ? ` - ${format(endDate, "h:mm a")}` : ""}`;
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header - Hidden in compact mode */}
      {!showCompact && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-medium tracking-tight">Timeline</h2>
            <p className="text-muted-foreground text-sm">
              Project events, meetings, and milestones for {project.title}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => console.log('Add event clicked')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards - Hidden in compact mode */}
      {!showCompact && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{timelineStats.completionRate}%</div>
              <p className="text-xs text-muted-foreground">
                {timelineStats.completedEvents} of {timelineStats.totalEvents} completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{timelineStats.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">
                {timelineStats.todayEvents} today
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Events</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{timelineStats.todayEvents}</div>
              <p className="text-xs text-muted-foreground">
                Scheduled for today
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{timelineStats.overdueEvents}</div>
              <p className="text-xs text-muted-foreground">
                Need attention
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Controls - Hidden in compact mode */}
      {!showCompact && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <CheckCircle className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )} {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">Timeline</h2>
          <p className="text-muted-foreground text-sm">
            Project events, meetings, and milestones for {project.title}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => console.log('Add event clicked')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timelineStats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {timelineStats.completedEvents} of {timelineStats.totalEvents} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{timelineStats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">
              {timelineStats.todayEvents} today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Events</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{timelineStats.todayEvents}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled for today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{timelineStats.overdueEvents}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <CheckCircle className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Timeline View */}
      {filteredAndSortedEvents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {data.length === 0 ? 'No events scheduled' : 'No events match your filters'}
            </h3>
            <p className="text-gray-500 mb-4">
              {data.length === 0 
                ? 'Add your first event to get started'
                : 'Try adjusting your search or filters'
              }
            </p>
            {data.length === 0 && !showCompact && (
              <Button onClick={() => console.log('Add event clicked')}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Event
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={`space-y-4 ${showCompact ? 'space-y-2' : ''}`}>
          {filteredAndSortedEvents.map((event, index) => {
            const IconComponent = getEventTypeIcon(event.type);
            const startDate = new Date(event.startDate);
            const isEventPast = isPast(startDate) && event.status !== "completed";
            const isEventToday = isToday(startDate);
            const organizer = event.organizer ? getTeamMemberById(event.organizer) : null;
            
            return (
              <div key={event.id} className="relative">
                {/* Timeline connector - smaller in compact mode */}
                {index < filteredAndSortedEvents.length - 1 && (
                  <div className={`absolute left-6 ${showCompact ? 'top-12 h-6' : 'top-16 h-8'} w-0.5 bg-gray-200 z-0`} />
                )}
                
                <Card className={`relative z-10 hover:shadow-md transition-all duration-200 ${showCompact ? 'py-2' : ''}`}>
                  <CardHeader className={showCompact ? "pb-2 py-3" : "pb-3"}>
                    <div className="flex items-start gap-4">
                      {/* Icon - smaller in compact mode */}
                      <div className={`${showCompact ? 'p-1.5' : 'p-2'} rounded-full border-2 ${getEventTypeColor(event.type)} flex-shrink-0`}>
                        <IconComponent className={`${showCompact ? 'h-3 w-3' : 'h-4 w-4'}`} />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className={`font-semibold ${showCompact ? 'text-base' : 'text-lg'}`}>{event.title}</h3>
                              <Badge className={getStatusColor(event.status)}>
                                {event.status.replace("_", " ")}
                              </Badge>
                              <Flag className={`${showCompact ? 'h-3 w-3' : 'h-4 w-4'} ${getPriorityColor(event.priority)}`} />
                            </div>
                            
                            {/* Description - hide in compact mode for space */}
                            {!showCompact && event.description && (
                              <p className="text-sm text-muted-foreground mb-3">
                                {event.description}
                              </p>
                            )}
                            
                            <div className={`flex items-center gap-4 text-sm text-muted-foreground ${showCompact ? 'mb-1' : 'mb-2'}`}>
                              <div className={`flex items-center gap-1 ${isEventToday ? 'font-medium text-blue-600' : isEventPast ? 'text-red-600' : ''}`}>
                                <Clock className={`${showCompact ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                <span className={showCompact ? 'text-xs' : ''}>{formatEventDate(event)}</span>
                              </div>
                              
                              {!showCompact && event.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                              
                              {event.isVirtual && (
                                <Badge variant="outline" className="text-xs">
                                  Virtual
                                </Badge>
                              )}
                            </div>
                            
                            {/* Organizer and Attendees - simplified in compact mode */}
                            <div className={`flex items-center gap-4 ${showCompact ? 'text-xs' : ''}`}>
                              {/* Organizer - show only in full mode or if no attendees */}
                              {(!showCompact || !event.attendees?.length) && organizer && (
                                <div className="flex items-center gap-2">
                                  <Avatar className={`${showCompact ? 'h-5 w-5' : 'h-6 w-6'}`}>
                                    <AvatarImage src={organizer.avatarUrl} />
                                    <AvatarFallback className="text-xs">
                                      {organizer.name.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-muted-foreground">
                                    {showCompact ? organizer.name : `Organized by ${organizer.name}`}
                                  </span>
                                </div>
                              )}
                              
                              {/* Attendees */}
                              {event.attendees && event.attendees.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <div className="flex -space-x-2">
                                    {event.attendees.slice(0, showCompact ? 2 : 3).map((attendeeId) => {
                                      const attendee = getTeamMemberById(attendeeId);
                                      if (!attendee) return null;
                                      
                                      return (
                                        <Avatar key={attendeeId} className={`${showCompact ? 'h-5 w-5' : 'h-6 w-6'} border-2 border-background`}>
                                          <AvatarImage src={attendee.avatarUrl} />
                                          <AvatarFallback className="text-xs">
                                            {attendee.name.split(" ").map(n => n[0]).join("")}
                                          </AvatarFallback>
                                        </Avatar>
                                      );
                                    })}
                                    {event.attendees.length > (showCompact ? 2 : 3) && (
                                      <div className={`${showCompact ? 'h-5 w-5' : 'h-6 w-6'} rounded-full border-2 border-background bg-gray-100 flex items-center justify-center`}>
                                        <span className="text-xs text-muted-foreground">
                                          +{event.attendees.length - (showCompact ? 2 : 3)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  {!showCompact && (
                                    <span className="text-sm text-muted-foreground">
                                      {event.attendees.length} attendee{event.attendees.length === 1 ? '' : 's'}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Actions - hide in compact mode */}
                          {!showCompact && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEventAction('view', event)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEventAction('edit', event)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit event
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEventAction('copy', event)}>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Duplicate event
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500" onClick={() => handleEventAction('delete', event)}>
                                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                  Delete event
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}