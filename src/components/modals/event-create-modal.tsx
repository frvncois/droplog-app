// components/modals/event-create-modal.tsx

"use client";

import * as React from "react";
import {
  Calendar,
  Users,
  Package,
  Target,
  AlertTriangle,
  Eye,
  Zap,
  Clock,
  Video
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { team } from "@/lib/utils/dummy-data";

// Timeline event interface (matches the one in project-timeline.tsx)
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

interface EventCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  currentUserId: string; // Current logged-in user ID
  onCreateEvent?: (event: Omit<TimelineEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingEvent?: TimelineEvent | null;
  onUpdateEvent?: (event: TimelineEvent) => void;
}

// Event type options with icons
const eventTypes = [
  { value: 'meeting', label: 'Meeting', icon: Users },
  { value: 'delivery', label: 'Delivery', icon: Package },
  { value: 'milestone', label: 'Milestone', icon: Target },
  { value: 'deadline', label: 'Deadline', icon: AlertTriangle },
  { value: 'review', label: 'Review', icon: Eye },
  { value: 'launch', label: 'Launch', icon: Zap },
  { value: 'event', label: 'Event', icon: Calendar }
];

// Duration options (in minutes) - removed since we're using endTime instead
// const durationOptions = [...];

export function EventCreateModal({
  open,
  onOpenChange,
  projectId,
  currentUserId,
  onCreateEvent,
  editingEvent,
  onUpdateEvent
}: EventCreateModalProps) {
  // Form state
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    type: "meeting",
    selectedDate: "",
    selectedTime: "",
    endTime: "",
    location: "",
    isVirtual: false,
    videoConferenceLink: "",
    organizer: currentUserId,
    attendees: [] as string[],
    notes: ""
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Reset form when modal opens/closes or when editing event changes
  React.useEffect(() => {
    if (editingEvent) {
      const startDate = new Date(editingEvent.startDate);
      const endDate = editingEvent.endDate ? new Date(editingEvent.endDate) : null;
      const dateStr = startDate.toISOString().split('T')[0];
      const timeStr = startDate.toTimeString().slice(0, 5);
      const endTimeStr = endDate ? endDate.toTimeString().slice(0, 5) : "";

      setFormData({
        title: editingEvent.title,
        description: editingEvent.description || "",
        type: editingEvent.type,
        selectedDate: dateStr,
        selectedTime: timeStr,
        endTime: endTimeStr,
        location: editingEvent.location || "",
        isVirtual: editingEvent.isVirtual || false,
        videoConferenceLink: "",
        organizer: editingEvent.organizer || currentUserId,
        attendees: editingEvent.attendees || [],
        notes: editingEvent.notes || ""
      });
    } else if (open) {
      // Reset form for new event
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const currentTimeStr = now.toTimeString().slice(0, 5);
      const endTimeStr = new Date(now.getTime() + 60 * 60 * 1000).toTimeString().slice(0, 5); // +1 hour

      setFormData({
        title: "",
        description: "",
        type: "meeting",
        selectedDate: todayStr,
        selectedTime: currentTimeStr,
        endTime: endTimeStr,
        location: "",
        isVirtual: false,
        videoConferenceLink: "",
        organizer: currentUserId,
        attendees: [],
        notes: ""
      });
    }
  }, [editingEvent, open, currentUserId]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.selectedDate || !formData.selectedTime) {
        return;
      }

      // Combine date and time into ISO string
      const startDateTime = new Date(`${formData.selectedDate}T${formData.selectedTime}`);
      const endDateTime = formData.endTime ? new Date(`${formData.selectedDate}T${formData.endTime}`) : undefined;
      const startDateISO = startDateTime.toISOString();
      const endDateISO = endDateTime?.toISOString();

      // Determine location and virtual status
      let location = formData.location.trim();
      let isVirtual = formData.isVirtual;
      
      // If video conference link is provided, use it as location and set virtual to true
      if (formData.videoConferenceLink.trim()) {
        location = formData.videoConferenceLink.trim();
        isVirtual = true;
      }

      // Create event object
      const eventData = {
        projectId,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type as TimelineEvent['type'],
        status: "scheduled" as const,
        startDate: startDateISO,
        endDate: endDateISO,
        location: location || undefined,
        isVirtual,
        organizer: formData.organizer || undefined,
        attendees: formData.attendees.length > 0 ? formData.attendees : undefined,
        priority: "medium" as const, // Default priority
        notes: formData.notes.trim() || undefined
      };

      if (editingEvent && onUpdateEvent) {
        // Update existing event
        onUpdateEvent({
          ...editingEvent,
          ...eventData,
          updatedAt: new Date().toISOString()
        });
      } else if (onCreateEvent) {
        // Create new event
        onCreateEvent(eventData);
      }

      // Close modal and reset form
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle attendee selection
  const handleAttendeeToggle = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.includes(memberId)
        ? prev.attendees.filter(id => id !== memberId)
        : [...prev.attendees, memberId]
    }));
  };

  // Get current organizer info
  const organizerInfo = team.find(member => member.id === formData.organizer);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingEvent ? "Edit Event" : "Create New Event"}
          </DialogTitle>
          <DialogDescription>
            {editingEvent 
              ? "Update the event details below."
              : "Schedule a new event for your project."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Event title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map(({ value, label, icon: Icon }) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the event..."
              rows={3}
            />
          </div>

          {/* Date, Time & End Time */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.selectedDate}
                  onChange={(e) => setFormData({ ...formData, selectedDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Start Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.selectedTime}
                  onChange={(e) => setFormData({ ...formData, selectedTime: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Video Conference Link */}
          <div className="space-y-2">
            <Label htmlFor="videoLink">Video Conference Link</Label>
            <div className="relative">
              <Video className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="videoLink"
                value={formData.videoConferenceLink}
                onChange={(e) => setFormData({ ...formData, videoConferenceLink: e.target.value })}
                placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Organizer */}
          <div className="space-y-2">
            <Label>Organizer</Label>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarImage src={organizerInfo?.avatarUrl} alt={organizerInfo?.name} />
                <AvatarFallback className="text-sm">
                  {organizerInfo?.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{organizerInfo?.name}</p>
                <p className="text-xs text-gray-500">{organizerInfo?.role}</p>
              </div>
            </div>
          </div>

          {/* Attendees */}
          <div className="space-y-2">
            <Label>Attendees</Label>
            <div className="border rounded-lg p-3 max-h-32 overflow-y-auto">
              <div className="space-y-2">
                {team.filter(member => member.id !== currentUserId).map(member => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`attendee-${member.id}`}
                      checked={formData.attendees.includes(member.id)}
                      onCheckedChange={() => handleAttendeeToggle(member.id)}
                    />
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                      <AvatarFallback className="text-xs">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Label htmlFor={`attendee-${member.id}`} className="text-sm cursor-pointer flex-1">
                      {member.name}
                      <span className="text-xs text-gray-500 ml-1">({member.role})</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            {formData.attendees.length > 0 && (
              <p className="text-xs text-gray-500">
                {formData.attendees.length} attendee{formData.attendees.length === 1 ? '' : 's'} selected
              </p>
            )}
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? "Saving..." 
                : editingEvent 
                  ? "Update Event" 
                  : "Create Event"
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}