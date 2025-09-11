'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  FileText, 
  Eye, 
  Clock, 
  Users,
  TrendingUp,
  BookOpen,
  CheckCircle,
  Edit
} from 'lucide-react'

interface DocumentationStatsProps {
  documentation: any[]
}

export function DocumentationStats({ documentation }: DocumentationStatsProps) {
  // Calculate stats
  const totalDocs = documentation.length
  const publishedDocs = documentation.filter(d => d.status === 'published').length
  const draftDocs = documentation.filter(d => d.status === 'draft').length
  const reviewDocs = documentation.filter(d => d.status === 'review').length
  
  const totalWordCount = documentation.reduce((sum, doc) => sum + doc.wordCount, 0)
  const avgReadTime = documentation.length > 0 
    ? Math.round(documentation.reduce((sum, doc) => sum + doc.readTime, 0) / documentation.length)
    : 0

  // Get unique authors
  const uniqueAuthors = new Set(documentation.map(d => d.author)).size

  // Calculate categories
  const categories = documentation.reduce((acc, doc) => {
    acc[doc.category] = (acc[doc.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Recent activity (docs updated in last 7 days)
  const recentActivity = documentation.filter(doc => {
    const updatedDate = new Date(doc.updatedAt)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return updatedDate > weekAgo
  }).length

  // Publication rate
  const publicationRate = totalDocs > 0 ? Math.round((publishedDocs / totalDocs) * 100) : 0

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Documents */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Documents
          </CardTitle>
          <div className="p-2 rounded-md bg-blue-50">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{totalDocs}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatNumber(totalWordCount)} total words
          </p>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Published</span>
              <span className="font-medium">{publicationRate}%</span>
            </div>
            <Progress value={publicationRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Published Content */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Published
          </CardTitle>
          <div className="p-2 rounded-md bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{publishedDocs}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {draftDocs} drafts, {reviewDocs} in review
          </p>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Completion</span>
              <span className="font-medium">{publicationRate}%</span>
            </div>
            <Progress value={publicationRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Average Read Time */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Avg Read Time
          </CardTitle>
          <div className="p-2 rounded-md bg-purple-50">
            <Clock className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{avgReadTime}m</div>
          <p className="text-xs text-muted-foreground mt-1">
            Average reading time
          </p>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Engagement</span>
              <span className="font-medium">
                {avgReadTime > 5 ? 'High' : avgReadTime > 3 ? 'Medium' : 'Quick'}
              </span>
            </div>
            <Progress 
              value={Math.min((avgReadTime / 10) * 100, 100)} 
              className="h-2" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Contributors */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Contributors
          </CardTitle>
          <div className="p-2 rounded-md bg-orange-50">
            <Users className="h-4 w-4 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{uniqueAuthors}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Active documentation writers
          </p>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Activity</span>
              <span className="font-medium">{recentActivity} recent</span>
            </div>
            <Progress 
              value={Math.min((recentActivity / totalDocs) * 100, 100)} 
              className="h-2" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Content Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {Object.entries(categories)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium">{category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress 
                      value={(count / totalDocs) * 100} 
                      className="w-20 h-2" 
                    />
                    <span className="text-sm font-medium w-8">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Documentation Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{recentActivity}</div>
              <p className="text-xs text-muted-foreground">Updated this week</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((publishedDocs / Math.max(totalDocs, 1)) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">Publication rate</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{avgReadTime}min</div>
              <p className="text-xs text-muted-foreground">Avg read time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}