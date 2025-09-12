// components/documentation/help-videos-list.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play } from 'lucide-react'
import { videoTutorials } from '@/lib/utils/dummy-data'

export function HelpVideosList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videoTutorials.map((video) => (
        <Card key={video.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="p-0">
            <div className="relative">
              <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                <Play className="h-12 w-12 text-gray-400" />
              </div>
              <Badge className="absolute top-2 right-2" variant="secondary">
                {video.duration}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg leading-tight">{video.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{video.description}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{video.views} views</span>
                <span>{video.publishedAt}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {video.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Watch Video
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}