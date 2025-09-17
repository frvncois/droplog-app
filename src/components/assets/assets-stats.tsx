"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  File,
  HardDrive,
  TrendingUp,
  Upload,
  Image,
  Video,
  FileText,
  Folder
} from "lucide-react";
import { 
  assets, 
  projects
} from "@/lib/utils/dummy-data";

export function AssetsStats() {
  // Calculate comprehensive asset statistics
  const totalAssets = assets.length;
  const activeProjectAssets = assets.filter(a => {
    const project = projects.find(p => p.id === a.projectId);
    return project?.status === "active";
  });
  
  // Type distribution
  const imageAssets = assets.filter(a => a.type === "image");
  const videoAssets = assets.filter(a => a.type === "video");
  const documentAssets = assets.filter(a => a.type === "document" || a.type === "pdf");
  const audioAssets = assets.filter(a => a.type === "audio");
  const otherAssets = assets.filter(a => a.type === "other");
  
  // Size analysis (simulate file sizes for demo)
  const totalSize = assets.reduce((sum, asset) => {
    // Simulate file sizes based on type
    let estimatedSize = 0;
    switch (asset.type) {
      case "image":
        estimatedSize = Math.random() * 5000000; // 0-5MB
        break;
      case "video":
        estimatedSize = Math.random() * 100000000; // 0-100MB
        break;
      case "document":
      case "pdf":
        estimatedSize = Math.random() * 10000000; // 0-10MB
        break;
      case "audio":
        estimatedSize = Math.random() * 20000000; // 0-20MB
        break;
      default:
        estimatedSize = Math.random() * 1000000; // 0-1MB
    }
    return sum + estimatedSize;
  }, 0);
  
  // Recent activity (uploaded in last 7 days)
  const recentAssets = assets.filter(asset => {
    const createdDate = new Date(asset.createdAt || asset.updatedAt);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return createdDate > weekAgo;
  });
  
  // Project distribution
  const assetsPerProject = projects.map(project => ({
    project,
    count: assets.filter(a => a.projectId === project.id).length
  })).sort((a, b) => b.count - a.count);
  
  // Storage usage (simulate 1TB limit)
  const storageLimit = 1000000000000; // 1TB
  const storageUsagePercent = Math.min((totalSize / storageLimit) * 100, 100);
  
  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const stats = [
    {
      title: "Total Assets",
      value: totalAssets,
      description: `${activeProjectAssets.length} in active projects`,
      icon: File,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      progress: totalAssets > 0 ? Math.min((totalAssets / 100) * 100, 100) : 0,
      trend: `${imageAssets.length} images, ${videoAssets.length} videos`
    },
    {
      title: "Storage Used",
      value: formatFileSize(totalSize),
      description: `${Math.round(storageUsagePercent)}% of 1TB limit`,
      icon: HardDrive,
      color: storageUsagePercent > 80 ? "text-red-600" : storageUsagePercent > 60 ? "text-orange-600" : "text-green-600",
      bgColor: storageUsagePercent > 80 ? "bg-red-50" : storageUsagePercent > 60 ? "bg-orange-50" : "bg-green-50",
      progress: storageUsagePercent,
      trend: storageUsagePercent > 80 ? "Storage almost full" : "Space available"
    },
    {
      title: "Documents",
      value: documentAssets.length,
      description: "PDFs and documents",
      icon: FileText,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      progress: totalAssets > 0 ? Math.round((documentAssets.length / totalAssets) * 100) : 0,
      trend: `${audioAssets.length} audio files`
    },
    {
      title: "Recent Uploads",
      value: recentAssets.length,
      description: "Uploaded this week",
      icon: Upload,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      progress: Math.min((recentAssets.length / 10) * 100, 100),
      trend: recentAssets.length > 5 ? "High activity" : "Normal activity"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Usage</span>
                  <span className="font-medium">{Math.round(stat.progress)}%</span>
                </div>
                <Progress value={stat.progress} className="h-2" />
              </div>
              
              <div className="flex items-center mt-3">
                <Badge variant="secondary" className="text-xs">
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}