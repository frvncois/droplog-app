"use client";

import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  User, 
  Flag, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckSquare2, 
  Edit3,
  X
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Task, getTeamMemberById, getProjectById } from "@/lib/utils/dummy-data";

interface TaskSheetModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isNew?: boolean;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "completed": 
      return { 
        color: "bg-emerald-50 text-emerald-700 border-emerald-200", 
        dot: "bg-emerald-500",
        label: "Completed"
      };
    case "in_progress": 
      return { 
        color: "bg-blue-50 text-blue-700 border-blue-200", 
        dot: "bg-blue-500",
        label: "In Progress"
      };
    case "todo": 
      return { 
        color: "bg-slate-50 text-slate-700 border-slate-200", 
        dot: "bg-slate-400",
        label: "To Do"
      };
    default: 
      return { 
        color: "bg-slate-50 text-slate-700 border-slate-200", 
        dot: "bg-slate-400",
        label: "Unknown"
      };
  }
};

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case "urgent": 
      return { 
        color: "text-red-600", 
        bg: "bg-red-50 border-red-200",
        label: "Urgent"
      };
    case "high": 
      return { 
        color: "text-orange-600", 
        bg: "bg-orange-50 border-orange-200",
        label: "High"
      };
    case "medium": 
      return { 
        color: "text-amber-600", 
        bg: "bg-amber-50 border-amber-200",
        label: "Medium"
      };
    case "low": 
      return { 
        color: "text-emerald-600", 
        bg: "bg-emerald-50 border-emerald-200",
        label: "Low"
      };
    default: 
      return { 
        color: "text-slate-600", 
        bg: "bg-slate-50 border-slate-200",
        label: "Unknown"
      };
  }
};

export function TaskSheetModal({ task, open, onOpenChange }: TaskSheetModalProps) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  React.useEffect(() => {
    if (task) {
      const taskComments: Comment[] = task.comments?.map((comment, index) => ({
        id: `comment_${index}`,
        author: task.assignedTo || "u1",
        content: comment,
        timestamp: new Date(Date.now() - (task.comments!.length - index) * 60 * 60 * 1000).toISOString(),
        isNew: index === task.comments!.length - 1 && new Date(task.updatedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      })) || [];
      
      setComments(taskComments);
    }
  }, [task]);

  const handleAddComment = () => {
    if (!newComment.trim() || !task) return;

    const comment: Comment = {
      id: `comment_${Date.now()}`,
      author: "u1",
      content: newComment,
      timestamp: new Date().toISOString(),
      isNew: true
    };

    setComments(prev => [...prev, comment]);
    setNewComment("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  if (!task) return null;

  const assignee = task.assignedTo ? getTeamMemberById(task.assignedTo) : null;
  const project = getProjectById(task.projectId);
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const today = new Date();
  const isOverdue = dueDate && dueDate < today && task.status !== "completed";
  const statusConfig = getStatusConfig(task.status);
  const priorityConfig = getPriorityConfig(task.priority);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <SheetHeader className="flex-shrink-0 space-y-0 pb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <Flag className={`h-4 w-4 flex-shrink-0 ${priorityConfig.color}`} />
                <SheetTitle className="text-xl leading-tight break-words">
                  {task.title}
                </SheetTitle>
              </div>
              {task.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {task.description}
                </p>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onOpenChange(false)}
              className="ml-2 h-8 w-8 p-0 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6">
              {/* Status & Priority Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`rounded-lg border p-3 ${statusConfig.color}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                    <span className="text-xs font-medium uppercase tracking-wide">Status</span>
                  </div>
                  <p className="font-medium mt-1">{statusConfig.label}</p>
                </div>
                
                <div className={`rounded-lg border p-3 ${priorityConfig.bg}`}>
                  <div className="flex items-center gap-2">
                    <Flag className={`h-3 w-3 ${priorityConfig.color}`} />
                    <span className="text-xs font-medium uppercase tracking-wide">Priority</span>
                  </div>
                  <p className="font-medium mt-1">{priorityConfig.label}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="space-y-4">
                {/* Project */}
                {project && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 rounded bg-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Project</p>
                      <p className="font-medium">{project.title}</p>
                    </div>
                  </div>
                )}

                {/* Assignee */}
                <div className="flex items-center gap-3">
                  {assignee ? (
                    <>
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={assignee.avatarUrl} />
                        <AvatarFallback className="text-xs">
                          {assignee.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Assignee</p>
                        <p className="font-medium">{assignee.name}</p>
                        <p className="text-xs text-muted-foreground">{assignee.role}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Assignee</p>
                        <p className="text-muted-foreground">Unassigned</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Due Date */}
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isOverdue ? 'bg-red-50' : 'bg-muted'
                  }`}>
                    <Calendar className={`h-4 w-4 ${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Due Date</p>
                    <div className="flex items-center gap-2">
                      {dueDate ? (
                        <>
                          <p className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                            {format(dueDate, "MMM d, yyyy")}
                          </p>
                          {isOverdue && (
                            <Badge variant="destructive" className="text-xs px-2 py-0">
                              Overdue
                            </Badge>
                          )}
                        </>
                      ) : (
                        <p className="text-muted-foreground">No due date</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Comments Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">Comments</h3>
                    <Badge variant="secondary" className="text-xs">
                      {comments.length}
                    </Badge>
                  </div>
                  {comments.some(c => c.isNew) && (
                    <Badge variant="destructive" className="text-xs">
                      New
                    </Badge>
                  )}
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.length > 0 ? (
                    comments.map((comment) => {
                      const commentAuthor = getTeamMemberById(comment.author);
                      return (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={commentAuthor?.avatarUrl} />
                            <AvatarFallback className="text-xs">
                              {commentAuthor?.name.split(" ").map(n => n[0]).join("") || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium">
                                {commentAuthor?.name || "Unknown User"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                              </p>
                              {comment.isNew && (
                                <Badge variant="destructive" className="text-xs px-1">
                                  new
                                </Badge>
                              )}
                            </div>
                            <div className="bg-muted/30 rounded-lg p-3 border">
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No comments yet</p>
                      <p className="text-xs">Start the conversation below</p>
                    </div>
                  )}
                </div>

                {/* Add Comment */}
                <div className="space-y-3 pt-2 border-t">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="min-h-[80px] resize-none border-0 bg-muted/30 focus-visible:ring-1"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      Press ⏎ to send • Shift + ⏎ for new line
                    </p>
                    <Button 
                      size="sm" 
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="h-8"
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
                <div className="flex justify-between">
                  <span>Created</span>
                  <span>{format(new Date(task.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last updated</span>
                  <span>{formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Actions Footer */}
        <div className="flex-shrink-0 pt-6 border-t">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Edit3 className="h-3 w-3 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <CheckSquare2 className="h-3 w-3 mr-2" />
              {task.status === "completed" ? "Reopen" : "Complete"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}