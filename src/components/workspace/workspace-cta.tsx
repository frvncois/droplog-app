// components/workspace/workspace-cta.tsx

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb,
  BookOpen,
  Zap,
  Star,
  ArrowRight,
  X,
  CheckCircle2,
  Users,
  Calendar,
  FileText
} from "lucide-react";
import Link from "next/link";

interface CtaItem {
  id: string;
  type: "tip" | "feature" | "tutorial" | "update";
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  dismissible?: boolean;
  badge?: string;
}

export function WorkspaceCta() {
  const [dismissedItems, setDismissedItems] = useState<string[]>([]);

  // Mock CTA content - in real app, this could be dynamic based on user behavior
  const ctaItems: CtaItem[] = [
    {
      id: "tip-keyboard-shortcuts",
      type: "tip",
      title: "Did you know?",
      description: "Use Cmd+K (Mac) or Ctrl+K (Windows) to quickly search across all your projects, tasks, and files.",
      dismissible: true
    },
    {
      id: "feature-calendar-view",
      type: "feature",
      title: "Try Calendar View",
      description: "Visualize your tasks and deadlines in a calendar format for better planning.",
      action: {
        label: "Open Calendar",
        href: "/app/tasks?view=calendar"
      },
      dismissible: true,
      badge: "New"
    },
    {
      id: "tutorial-team-collaboration",
      type: "tutorial",
      title: "Team Collaboration Guide",
      description: "Learn how to effectively assign tasks, share assets, and collaborate with your team members.",
      action: {
        label: "Read Guide",
        href: "/app/documentation?guide=collaboration"
      },
      dismissible: true
    },
    {
      id: "update-integration-slack",
      type: "update",
      title: "Slack Integration Available",
      description: "Connect your Slack workspace to get notifications and updates directly in your channels.",
      action: {
        label: "Setup Integration",
        href: "/app/integrations"
      },
      dismissible: true,
      badge: "Updated"
    },
    {
      id: "tip-project-templates",
      type: "tip",
      title: "Pro Tip",
      description: "Create project templates to standardize workflows and save time when starting new projects.",
      action: {
        label: "Learn More",
        href: "/app/documentation?topic=templates"
      },
      dismissible: true
    },
    {
      id: "feature-time-tracking",
      type: "feature",
      title: "Track Your Time",
      description: "Enable time tracking on tasks to better understand how long different types of work take.",
      action: {
        label: "Enable Tracking",
        href: "/app/settings?tab=features"
      },
      dismissible: true,
      badge: "Beta"
    }
  ];

  // Filter out dismissed items
  const visibleItems = ctaItems.filter(item => !dismissedItems.includes(item.id));
  
  // Show one random item that hasn't been dismissed
  const currentItem = visibleItems.length > 0 
    ? visibleItems[Math.floor(Math.random() * visibleItems.length)]
    : null;

  const handleDismiss = (itemId: string) => {
    setDismissedItems(prev => [...prev, itemId]);
  };

  const getIcon = (type: CtaItem['type']) => {
    switch (type) {
      case "tip":
        return Lightbulb;
      case "feature":
        return Zap;
      case "tutorial":
        return BookOpen;
      case "update":
        return Star;
      default:
        return Lightbulb;
    }
  };

  const getColors = (type: CtaItem['type']) => {
    switch (type) {
      case "tip":
        return {
          icon: "text-yellow-600",
          bg: "bg-yellow-50",
          border: "border-yellow-200"
        };
      case "feature":
        return {
          icon: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-200"
        };
      case "tutorial":
        return {
          icon: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-200"
        };
      case "update":
        return {
          icon: "text-purple-600",
          bg: "bg-purple-50",
          border: "border-purple-200"
        };
      default:
        return {
          icon: "text-gray-600",
          bg: "bg-gray-50",
          border: "border-gray-200"
        };
    }
  };

  if (!currentItem) {
    // Show a fallback card when all items are dismissed
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="space-y-3">
            <CheckCircle2 className="h-8 w-8 mx-auto text-green-600" />
            <h3 className="font-semibold">You're all caught up!</h3>
            <p className="text-sm text-muted-foreground">
              No new tips or updates right now. Keep up the great work on your projects!
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/app/documentation">
                Browse Documentation
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const Icon = getIcon(currentItem.type);
  const colors = getColors(currentItem.type);

  return (
    <Card className={`relative ${colors.border} ${colors.bg}/30`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-full ${colors.bg}`}>
              <Icon className={`h-4 w-4 ${colors.icon}`} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-base">{currentItem.title}</CardTitle>
                {currentItem.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {currentItem.badge}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {currentItem.dismissible && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1"
              onClick={() => handleDismiss(currentItem.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentItem.description}
          </p>
          
          {currentItem.action && (
            <Button size="sm" className="w-full group" asChild>
              <Link href={currentItem.action.href}>
                {currentItem.action.label}
                <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          )}
          
          {/* Additional quick actions based on context */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" className="text-xs" asChild>
              <Link href="/app/documentation">
                <BookOpen className="h-3 w-3 mr-1" />
                Docs
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="text-xs" asChild>
              <Link href="/app/team">
                <Users className="h-3 w-3 mr-1" />
                Team
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}