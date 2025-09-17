// components/workspace/workspace-activity.tsx

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Activity,
  MessageCircle,
  CheckSquare,
  FileImage,
  FolderOpen,
  Clock,
  User,
  GitCommit,
  Upload
} from "lucide-react";
import { 
  getTeamMemberById,
  getProjectById,
  projects
} from "@/lib/utils/dummy-data";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface ActivityItem {
  id: string;
  type: "comment" | "task_completed" | "task_created" | "asset_uploaded" | "project_updated" | "task_assigned";
  userId: string;
  targetId: string;
  targetType: "task" | "project" | "asset";
  message: string;
  timestamp: string;
  projectId?: string;
  priority?: "low" | "medium" | "high" | "urgent";
}

export function WorkspaceActivity() {
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Mock current user ID (in real app, this would come from auth)
  const currentUserId = "u1";
  
  // Get user's projects for filtering activity
  const userProjects = projects.filter(p => 
    p.assignedTo?.includes(currentUserId)
  );
  const userProjectIds = userProjects.map(p => p.id);

  // Mock activity data - in real app, this would be filtered by user's projects
  const activityData: ActivityItem[] = [
    {
      id: "a1",
      type: "task_completed" as const,
      userId: "u2",
      targetId: "t3",
      targetType: "task" as const,
      message: "completed 'Design login screen'",
      timestamp: "2025-09-11T08:30:00Z",
      projectId: "p2"
    },
    {
      id: "a2",
      type: "comment" as const,
      userId: "u3",
      targetId: "t1",
      targetType: "task" as const,
      message: "added a comment on 'Fix homepage header'",
      timestamp: "2025-09-11T07:15:00Z",
      projectId: "p1"
    },
    {
      id: "a3",
      type: "task_created" as const,
      userId: "u1",
      targetId: "t4",
      targetType: "task" as const,
      message: "created new task 'Implement payment gateway'",
      timestamp: "2025-09-10T16:45:00Z",
      projectId: "p4",
      priority: "high" as const
    },
    {
      id: "a4",
      type: "asset_uploaded" as const,
      userId: "u2",
      targetId: "a1",
      targetType: "asset" as const,
      message: "uploaded 'Hero Banner' to Marketing Website",
      timestamp: "2025-09-10T14:20:00Z",
      projectId: "p1"
    },
    {
      id: "a5",
      type: "project_updated" as const,
      userId: "u1",
      targetId: "p1",
      targetType: "project" as const,
      message: "updated project status to 'In Progress'",
      timestamp: "2025-09-10T12:00:00Z",
      projectId: "p1"
    },
    {
      id: "a6",
      type: "task_assigned" as const,
      userId: "u4",
      targetId: "t5",
      targetType: "task" as const,
      message: "assigned 'API Integration' to you",
      timestamp: "2025-09-10T10:30:00Z",
      projectId: "p4",
      priority: "urgent" as const
    },
    {
      id: "a7",
      type: "comment" as const,
      userId: "u5",
      targetId: "t2",
      targetType: "task" as const,
      message: "mentioned you in a comment",
      timestamp: "2025-09-09T18:15:00Z",
      projectId: "p1"
    }
  ].filter(activity => 
    activity.projectId && userProjectIds.includes(activity.projectId)
  );

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case "comment":
        return MessageCircle;
      case "task_completed":
        return CheckSquare;
      case "task_created":
        return GitCommit;
      case "task_assigned":
        return User;
      case "asset_uploaded":
        return Upload;
      case "project_updated":
        return FolderOpen;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case "comment":
        return "text-blue-600 bg-blue-50";
      case "task_completed":
        return "text-green-600 bg-green-50";
      case "task_created":
        return "text-purple-600 bg-purple-50";
      case "task_assigned":
        return "text-orange-600 bg-orange-50";
      case "asset_uploaded":
        return "text-indigo-600 bg-indigo-50";
      case "project_updated":
        return "text-teal-600 bg-teal-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const handleActivityClick = (activity: ActivityItem) => {
    setSelectedActivity(activity);
    setIsDetailModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Recent Activity</CardTitle>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/app/workspace?tab=activity">
                View All
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activityData.length > 0 ? (
            <div className="space-y-4">
              {activityData.slice(0, 6).map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                const user = getTeamMemberById(activity.userId);
                const project = getProjectById(activity.projectId || "");
                
                return (
                  <div key={activity.id} className="relative">
                    {/* Timeline connector */}
                    {index < activityData.slice(0, 6).length - 1 && (
                      <div className="absolute left-4 top-10 w-px h-8 bg-border" />
                    )}
                    
                    <button
                      onClick={() => handleActivityClick(activity)}
                      className="w-full text-left flex items-start space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors group"
                    >
                      {/* Activity Icon */}
                      <div className={`p-1.5 rounded-full ${getActivityColor(activity.type)}`}>
                        <Icon className="h-3 w-3" />
                      </div>
                      
                      {/* Activity Details */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              {user && (
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={user.avatarUrl} />
                                  <AvatarFallback className="text-xs">
                                    {user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <span className="font-medium text-sm">
                                {user?.name || "Unknown User"}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-tight">
                              {activity.message}
                            </p>
                            <div className="flex items-center space-x-2">
                              {project && (
                                <Badge variant="outline" className="text-xs">
                                  {project.title}
                                </Badge>
                              )}
                              {activity.priority && (
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    activity.priority === "urgent" 
                                      ? "border-red-200 text-red-700"
                                      : activity.priority === "high"
                                      ? "border-orange-200 text-orange-700"
                                      : ""
                                  }`}
                                >
                                  {activity.priority}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-2">
                            <div className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
              <p className="text-xs">Activity will appear here as your team works</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Activity Details</DialogTitle>
            <DialogDescription>
              More information about this activity
            </DialogDescription>
          </DialogHeader>
          
          {selectedActivity && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={getTeamMemberById(selectedActivity.userId)?.avatarUrl} />
                  <AvatarFallback>
                    {getTeamMemberById(selectedActivity.userId)?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium">
                      {getTeamMemberById(selectedActivity.userId)?.name}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {getTeamMemberById(selectedActivity.userId)?.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedActivity.message}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Project:</span>
                  <p className="text-muted-foreground">
                    {getProjectById(selectedActivity.projectId || "")?.title || "Unknown"}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Activity Type:</span>
                  <p className="text-muted-foreground capitalize">
                    {selectedActivity.type.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Time:</span>
                  <p className="text-muted-foreground">
                    {formatDistanceToNow(new Date(selectedActivity.timestamp), { addSuffix: true })}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Target:</span>
                  <p className="text-muted-foreground capitalize">
                    {selectedActivity.targetType}
                  </p>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" size="sm" onClick={() => setIsDetailModalOpen(false)}>
                  Close
                </Button>
                <Button size="sm" asChild>
                  <Link 
                    href={`/app/projects/${selectedActivity.projectId}`}
                    onClick={() => setIsDetailModalOpen(false)}
                  >
                    View Project
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}