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
  User
} from "lucide-react";
import { 
  getTeamMemberById,
  getProjectById,
  tasks
} from "@/lib/utils/dummy-data";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  type: "comment" | "task_completed" | "task_created" | "asset_uploaded" | "project_updated";
  userId: string;
  targetId: string;
  targetType: "task" | "project" | "asset";
  message: string;
  timestamp: string;
  projectId?: string;
}

// Mock activity data
const activityData: ActivityItem[] = [
  {
    id: "a1",
    type: "task_completed",
    userId: "u2",
    targetId: "t3",
    targetType: "task",
    message: "marked 'Design login screen' as completed",
    timestamp: "2025-09-11T08:30:00Z",
    projectId: "p2"
  },
  {
    id: "a2",
    type: "comment",
    userId: "u3",
    targetId: "t1",
    targetType: "task",
    message: "added a comment on 'Fix homepage header'",
    timestamp: "2025-09-11T07:15:00Z",
    projectId: "p1"
  },
  {
    id: "a3",
    type: "task_created",
    userId: "u1",
    targetId: "t4",
    targetType: "task",
    message: "created new task 'Implement payment gateway'",
    timestamp: "2025-09-10T16:45:00Z",
    projectId: "p4"
  },
  {
    id: "a4",
    type: "asset_uploaded",
    userId: "u2",
    targetId: "a1",
    targetType: "asset",
    message: "uploaded 'Hero Banner' to Marketing Website",
    timestamp: "2025-09-10T14:20:00Z",
    projectId: "p1"
  },
  {
    id: "a5",
    type: "project_updated",
    userId: "u5",
    targetId: "p1",
    targetType: "project",
    message: "updated project details for 'Marketing Website'",
    timestamp: "2025-09-10T11:30:00Z",
    projectId: "p1"
  },
  {
    id: "a6",
    type: "comment",
    userId: "u6",
    targetId: "t4",
    targetType: "task",
    message: "added a comment on 'Implement payment gateway'",
    timestamp: "2025-09-09T15:10:00Z",
    projectId: "p4"
  }
];

export function ActivityFeed() {
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const currentUserId = "u1"; // Mock current user
  
  // Filter activities for current user's projects
  const userProjectIds = ["p1", "p2", "p4"]; // Mock user's project IDs
  const relevantActivities = activityData
    .filter(activity => userProjectIds.includes(activity.projectId || ""))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "comment":
        return MessageCircle;
      case "task_completed":
      case "task_created":
        return CheckSquare;
      case "asset_uploaded":
        return FileImage;
      case "project_updated":
        return FolderOpen;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "comment":
        return "text-blue-600 bg-blue-50";
      case "task_completed":
        return "text-green-600 bg-green-50";
      case "task_created":
        return "text-purple-600 bg-purple-50";
      case "asset_uploaded":
        return "text-orange-600 bg-orange-50";
      case "project_updated":
        return "text-indigo-600 bg-indigo-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const handleActivityClick = (activity: ActivityItem) => {
    setSelectedActivity(activity);
  };

  return (
    <>
      <Card className="h-fit">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <CardTitle>Recent Activity</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {relevantActivities.length > 0 ? (
              relevantActivities.map((activity) => {
                const user = getTeamMemberById(activity.userId);
                const project = getProjectById(activity.projectId || "");
                const Icon = getActivityIcon(activity.type);
                const colorClasses = getActivityColor(activity.type);
                
                if (!user) return null;
                
                return (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 cursor-pointer hover:bg-accent/50 p-2 rounded-lg transition-colors"
                    onClick={() => handleActivityClick(activity)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback className="text-xs">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className={`p-1 rounded-full ${colorClasses}`}>
                          <Icon className="h-3 w-3" />
                        </div>
                        <span className="text-sm font-medium">{user.name}</span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {activity.message}
                      </p>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        {project && (
                          <Badge variant="outline" className="text-xs">
                            {project.title}
                          </Badge>
                        )}
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No recent activity</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Activity will appear here as your team works on projects
                </p>
              </div>
            )}
          </div>
          
          {relevantActivities.length > 5 && (
            <div className="mt-6 pt-4 border-t">
              <Button variant="outline" className="w-full" size="sm">
                View All Activity
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Detail Modal */}
      <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Activity Details</span>
            </DialogTitle>
            <DialogDescription>
              View detailed information about this activity
            </DialogDescription>
          </DialogHeader>
          
          {selectedActivity && (
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={getTeamMemberById(selectedActivity.userId)?.avatarUrl} />
                  <AvatarFallback>
                    {getTeamMemberById(selectedActivity.userId)?.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium">
                      {getTeamMemberById(selectedActivity.userId)?.name}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {getTeamMemberById(selectedActivity.userId)?.role}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {selectedActivity.message}
                  </p>
                  
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
                  
                  {/* Additional context based on activity type */}
                  {selectedActivity.type === "comment" && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm">
                        <strong>Comment:</strong> "This looks great! Ready for review."
                      </p>
                    </div>
                  )}
                  
                  {selectedActivity.type === "task_completed" && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Task completed:</strong> The task has been marked as done and is ready for review.
                      </p>
                    </div>
                  )}
                  
                  {selectedActivity.type === "task_created" && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>New task:</strong> A new task has been added to the project backlog.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedActivity(null)}>
                  Close
                </Button>
                <Button>
                  View in Project
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}