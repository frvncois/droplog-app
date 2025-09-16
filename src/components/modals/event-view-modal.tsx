// components/modals/event-view-modal.tsx

"use client";

import * as React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Package,
  Target,
  CheckCircle,
  AlertTriangle,
  Eye,
  Zap,
  Video,
  Edit,
  Trash2,
  Copy,
  User
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getTeamMemberById } from "@/lib/utils/dummy-data";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

// Timeline event interface (should match the one in timeline component)
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

interface EventViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: TimelineEvent | null;
  onEdit?: (event: TimelineEvent) => void;
  onDelete?: (eventId: string) => void;
  onDuplicate?: (event: TimelineEvent) => void;
}

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
    completed: "bg-green-100 text-green-800",
    in_progress: "bg-blue-100 text-blue-800",
    scheduled: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
    overdue: "bg-red-100 text-red-800"
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

// Priority colors
const getPriorityColor = (priority: string) => {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    critical: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    high: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
    medium: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
    low: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" }
  };
  return colors[priority] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };
};

export function EventViewModal({
  open,
  onOpenChange,
  event,
  onEdit,
  onDelete,
  onDuplicate
}: EventViewModalProps) {
  if (!event) return null;

  const IconComponent = getEventTypeIcon(event.type);
  const organizer = event.organizer ? getTeamMemberById(event.organizer) : null;
  const priorityStyle = getPriorityColor(event.priority);
  
  const startDate = parseISO(event.startDate);
  const endDate = event.endDate ? parseISO(event.endDate) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={cn(
                "p-2 rounded-lg",
                event.status === "completed" ? "bg-green-100" :
                event.status === "in_progress" ? "bg-blue-100" :
                event.status === "overdue" ? "bg-red-100" :
                "bg-gray-100"
              )}>
                <IconComponent className={cn(
                  "h-5 w-5",
                  event.status === "completed" ? "text-green-600" :
                  event.status === "in_progress" ? "text-blue-600" :
                  event.status === "overdue" ? "text-red-600" :
                  "text-gray-600"
                )} />
              </div>
              <div className="flex-1">
                <SheetTitle className="text-left">{event.title}</SheetTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className={cn("text-xs", getStatusColor(event.status))}>
                    {event.status.replace("_", " ")}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {event.type}
                  </Badge>
                  <Badge className={cn("text-xs", priorityStyle.bg, priorityStyle.text, priorityStyle.border)}>
                    {event.priority} priority
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          {event.description && (
            <SheetDescription className="text-left mt-3">
              {event.description}
            </SheetDescription>
          )}
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Date and Time */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Date & Time</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">{format(startDate, "EEEE, MMMM d, yyyy")}</p>
                  <p className="text-xs text-gray-500">
                    {format(startDate, "h:mm a")}
                    {endDate && (
                      <span> - {format(endDate, "h:mm a")}</span>
                    )}
                  </p>
                </div>
              </div>
              
              {endDate && (
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm">Duration: {Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))} minutes</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Location */}
          {event.location && (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Location</h3>
                <div className="flex items-center space-x-3">
                  {event.isVirtual ? (
                    <Video className="h-4 w-4 text-gray-400" />
                  ) : (
                    <MapPin className="h-4 w-4 text-gray-400" />
                  )}
                  <div>
                    <p className="text-sm">{event.location}</p>
                    {event.isVirtual && (
                      <p className="text-xs text-gray-500">Virtual meeting</p>
                    )}
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Organizer */}
          {organizer && (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Organizer</h3>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={organizer.avatarUrl} alt={organizer.name} />
                    <AvatarFallback>
                      {organizer.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{organizer.name}</p>
                    <p className="text-xs text-gray-500">{organizer.role}</p>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Attendees */}
          {event.attendees && event.attendees.length > 0 && (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">
                  Attendees ({event.attendees.length})
                </h3>
                <div className="space-y-2">
                  {event.attendees.map(attendeeId => {
                    const attendee = getTeamMemberById(attendeeId);
                    if (!attendee) return null;
                    
                    return (
                      <div key={attendeeId} className="flex items-center space-x-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={attendee.avatarUrl} alt={attendee.name} />
                          <AvatarFallback className="text-xs">
                            {attendee.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">{attendee.name}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {event.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Notes */}
          {event.notes && (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Notes</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{event.notes}</p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Attachments */}
          {event.attachments && event.attachments.length > 0 && (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">
                  Attachments ({event.attachments.length})
                </h3>
                <div className="space-y-2">
                  {event.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{attachment}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Metadata */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Event Details</h3>
            <div className="space-y-2 text-xs text-gray-500">
              <p>Created: {format(parseISO(event.createdAt), "MMM d, yyyy 'at' h:mm a")}</p>
              <p>Last updated: {format(parseISO(event.updatedAt), "MMM d, yyyy 'at' h:mm a")}</p>
              <p>Event ID: {event.id}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 mt-6 border-t">
          <div className="flex space-x-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(event)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {onDuplicate && (
              <Button variant="outline" size="sm" onClick={() => onDuplicate(event)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
            )}
          </div>
          
          {onDelete && (
            <Button variant="destructive" size="sm" onClick={() => onDelete(event.id)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}